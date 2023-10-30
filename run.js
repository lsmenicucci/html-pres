#!/usr/bin/env bun
import fs from 'fs'
import crypto from 'crypto'
import { serve, file } from 'bun'
import path from 'path'
import showdown from 'showdown'

// get input as argument
const input = process.argv[2]

const getFileHahsum = () => {
    const hash = crypto.createHash('sha256')
    hash.update(fs.readFileSync(input))
    return hash.digest('hex')
}

const wsConnections = new Set()

// watch for changes
const inputParent = path.dirname(input)
let fileHash = getFileHahsum()

fs.watch(inputParent, (event, filename) => {
    if (filename !== path.basename(input)) {
        const newFileHash = getFileHahsum()
        if (newFileHash !== fileHash) {
            console.log('file changed')
            fileHash = newFileHash
            wsConnections.forEach((ws) => {
                ws.send('reload')
            })
        }
    }
})

const hereDir = path.dirname(import.meta.url).replace('file://', '')
const templateDir = path.join(hereDir, 'template')
const staticFiles = {
    '/comps.js': path.join(templateDir, 'comps.js'),
    '/index.js': path.join(templateDir, 'index.js'),
    '/style.css': path.join(templateDir, 'style.css'),
}
const templateFile = path.join(templateDir, 'index.html')

const applyTemplate = () => {
    let content = fs.readFileSync(input, 'utf8')
    if (input.endsWith('.md')) {
        console.log('converting markdown to html')
        const converter = new showdown.Converter()
        content = converter.makeHtml(content)
    }

    const html = fs.readFileSync(templateFile, 'utf8')

    return html.replace('<!-- content -->', content)
}

// start server
console.log('starting server at http://localhost:3000')
serve({
    fetch: (req, server) => {
        const pathname = new URL(req.url).pathname

        if (pathname === '/ws') {
            if (server.upgrade(req)) {
                return
            }
        }

        if (pathname in staticFiles) {
            return new Response(file(staticFiles[pathname]))
        }

        return new Response(applyTemplate(), { headers: { 'content-type': 'text/html' } })
    },
    websocket: {
        open(ws) {
            wsConnections.add(ws)
        },
        close(ws) {
            wsConnections.delete(ws)
        },
    },
})
