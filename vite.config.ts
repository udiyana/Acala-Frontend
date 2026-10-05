import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// URL backend Laravel (ubah sesuai environment)
const BACKEND_URL = process.env.VITE_BACKEND_URL ?? 'http://localhost:8000';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'next/image': fileURLToPath(new URL('./src/shims/NextImage.tsx', import.meta.url)),
            'next/link': fileURLToPath(new URL('./src/shims/NextLink.tsx', import.meta.url)),
            'next/navigation': fileURLToPath(new URL('./src/shims/NextNavigation.ts', import.meta.url)),
            'next-themes': fileURLToPath(new URL('./src/shims/Theme.tsx', import.meta.url)),
        },
    },
    server: {
        port: 5173,
        // Proxy semua request /api/* ke backend Laravel
        proxy: {
            '/api': {
                target: BACKEND_URL,
                changeOrigin: true,
                secure: false,
            },
            '/storage': {
                target: BACKEND_URL,
                changeOrigin: true,
                secure: false,
            },
        },
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            onwarn(warning, warn) {
                if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')) {
                    return;
                }
                warn(warning);
            },
        },
    },
});
