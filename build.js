import fs from "fs";
import path from "path";
import { build } from "vite";

let here = path.resolve(import.meta.url.replace("file://", ""));
here = path.dirname(here);

const VENDOR_FOLDER = path.join(here, "vendor");
const localPackages = fs.readdirSync(VENDOR_FOLDER).reduce((pkgs, name) => {
    return {
        ...pkgs,
        [name]: path.join(VENDOR_FOLDER, name),
    };
}, {});

// load presentation data
const cwd = process.cwd();
const cfgPath = path.join(cwd, "presentation.json");
const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf-8"));

await build({
    root: here,
    base: "",
    define: {
        __SLIDES__: JSON.stringify(cfg.slides),
    },
    resolve: {
        alias: {
            ...localPackages,
            react: localPackages["preact"] + "/compat",
            "@slides": path.join(cwd, "slides"),
            "@pres": path.join(here, "lib"),
        },
    },
    esbuild: {
        jsxFactory: "h",
        jsxFragment: "Fragment",
        jsxInject: `import { h, Fragment } from 'preact'`,
    },
    build: {
        rollupOptions: {
            output: {
                dir: path.join(cwd, "dist"),
            },
        },
    },
});
