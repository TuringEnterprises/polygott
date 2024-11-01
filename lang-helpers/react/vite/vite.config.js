import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { viteSingleFile } from 'vite-plugin-singlefile';


export default defineConfig({
    plugins: [react(), viteSingleFile()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: 'data/out/inline',
        assetsDir: '',
        assetsInlineLimit: 100000000
    }
})
