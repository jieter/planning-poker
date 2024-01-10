import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    base: '',
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
