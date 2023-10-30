#!/usr/bin/env bun
import path from 'path'
import fs from 'fs'
import { build } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { JSDOM } from 'jsdom'
import crypto from 'crypto'
import css from 'css'
import { exit } from 'process'
import { program } from 'commander'

program
    .argument('<input>', 'input file')
    .option('--offline', 'offline mode')

program.parse(process.argv)
const opts = program.opts()
const args = program.args

const input = args[0]
const inputParent = path.dirname(input)

const hereDir = path.dirname(import.meta.url).replace('file://', '')
const templateDir = path.join(hereDir, 'template')
const staticFiles = {
    'comps.js': path.join(templateDir, 'comps.js'),
    'index.js': path.join(templateDir, 'index.js'),
    'style.css': path.join(templateDir, 'style.css'),
}
const templateFile = path.join(templateDir, 'index.html')

const applyTemplate = () => {
    console.log(input)
    let content = fs.readFileSync(input, 'utf8')
    const html = fs.readFileSync(templateFile, 'utf8')

    return html.replace('<!-- content -->', content)
}

// create local temp folder
const distDir = path.join(inputParent, 'dist')
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir)
}

// resolve external dependencies
const vendorDir = path.join(distDir, 'vendor')
const isExternal = (url) => {
    return url.startsWith('http') || url.startsWith('//')
}

const toLocal = (url) => {
    // convert url using md5
    const hash = crypto.createHash('sha256')
    hash.update(url)
    const localFilename = hash.digest('hex')
    const extension = path.extname(url)
    return path.join(vendorDir, localFilename + extension)
}

const html = applyTemplate()
const dom = new JSDOM(html)
const scripts = dom.window.document.querySelectorAll('script')
const links = dom.window.document.querySelectorAll('link')
let deps = {}

if (opts.offline) {
    deps = [...scripts, ...links].reduce((acc, el) => {
        const attr = el.tagName === 'SCRIPT' ? 'src' : 'href'
        const value = el.getAttribute(attr)

        if (value && isExternal(value)) {
            acc[value] = toLocal(value)

            let newUrl = acc[value]
            if (!el.hasAttribute('module')) {
                newUrl = path.relative(distDir, acc[value])
            }

            el.setAttribute(attr, newUrl)
            el.removeAttribute('integrity')
            el.removeAttribute('crossorigin')
        }
        return acc
    }, {})

    const cssUrlRe = /url\((.+?)\)/g
    const resolveCssFonts = async (cssStr) => {
        const cssAst = css.parse(cssStr)
        // find imports 
        const imports = cssAst.stylesheet.rules.filter(r => r.type === 'import')

        // find fonts
        const fonts = cssAst.stylesheet.rules.filter(r => r.type === 'font-face')
        const fontSrcValues = fonts.map(f => f.declarations.find(d => d.property === 'src').value)

        const deps = {}
        fontSrcValues.forEach(src => {
            src.replace(cssUrlRe, (match, url) => {
                const local = toLocal(url)
                deps[url] = local 
                return match.replace(url, local)
            })
        })
    }
        

    // fetch external dependencies
    if (!fs.existsSync(vendorDir)) {
        fs.mkdirSync(vendorDir)
    }
    const fetches = Object.entries(deps).map(async ([url, local]) => {
        console.log(`fetching ${url}`)

        const resp = await fetch(url)
        if (resp.ok) {
            const text = await resp.text()
            
            if (path.extname(url) === '.css') {
                await resolveCssFonts(text)
            }

            fs.writeFileSync(local, text)
            console.log(`fetched ${url} => ${local}`)
        }
    })
    await Promise.all(fetches)
}

// write index.html
const indexFile = path.join(distDir, 'index.html')
fs.writeFileSync(indexFile, dom.serialize())

await build({
    plugins: [viteSingleFile()],
    root: inputParent,
    resolve: {
        alias: {
            '/@': inputParent,
            ...staticFiles,
            ...deps,
        },
    },
    build: {
        rollupOptions: {
            input: indexFile,
        },
        outDir: inputParent,
    },
})
