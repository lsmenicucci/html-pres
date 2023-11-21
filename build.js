import fs from 'fs'
import path from 'path'
import { build, defineConfig } from 'vite'
import { viteSingleFile } from "vite-plugin-singlefile"

let here = path.resolve(import.meta.url.replace('file://', ''))
here = path.dirname(here)

const VENDOR_FOLDER = path.join(here, 'vendor')
const localPackages = fs.readdirSync(VENDOR_FOLDER).reduce((pkgs, name) => {
    return {
        ...pkgs,
        [name]: path.join(VENDOR_FOLDER, name),
    }
}, {})

// load presentation data
const cwd = process.cwd()

// get entry from env
const envEntry = process.env._PRES_VITE_ENTRY
const entryParent = path.dirname(envEntry)

export default defineConfig({
    root: here,
    base: '',
    define: {},
    resolve: {
        alias: {
            '@entry': envEntry,
            '@cwd': path.dirname(envEntry),
            '@slides': path.join(cwd, 'slides'),
            '@lib': path.join(here, 'lib'),
        },
    },
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        jsxInject: `import { h, Fragment } from 'preact'`,
    },
    build: {
        rollupOptions: {
            output: {
                dir: path.join(entryParent, 'dist'),
            },
        },
    },
    optimizeDeps: {
        disable: true,
    },
    plugins: [require('tailwindcss'), require('autoprefixer'), viteSingleFile()],
})
