/* globals process:true */
import { readdirSync } from 'fs';

import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-css-only';
import analyze from 'rollup-plugin-analyzer';

const production = !process.env.ROLLUP_WATCH;
const target = 'assets/';

export default {
    input: 'js/index.js',
    output: {
        sourcemap: !production,
        format: 'iife',
        name: 'app',
        dir: target,
        indent: false,
    },
    plugins: [
        svelte({
            // enable run-time checks when not in production
            compilerOptions: {
                dev: !production,
            },
        }),
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css({
            output: `poker.css`,
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ['svelte'],
        }),
        commonjs(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload(target),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),

        !production && analyze({ summaryOnly: true, limit: 10 }),
    ],
    watch: {
        clearScreen: false,
    },
};
