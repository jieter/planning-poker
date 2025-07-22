/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
    base: '',
    ssr: false,
    server: {
        port: 5174,
        strictPort: true,
    },
    build: {
        manifest: 'manifest.json',
        outDir: './assets/',
        rollupOptions: {
            input: {
                poker: 'js/index.ts',
            },
        },
        sourcemap: true,
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['js/testsetup.js'],
    },
    resolve: {
        conditions: ['browser'],
        alias: {
            '@neoconfetti/svelte': path.resolve(__dirname, 'node_modules/@neoconfetti/svelte/dist/index.js'),
        },
    },
    plugins: [
        svelte({
            // enable run-time checks when not in production
            compilerOptions: {
                dev: true,
            },
            emitCss: false,
        }),
    ],
});
