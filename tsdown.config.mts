import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: 'src/index.ts',
    format: ['esm'],
    dts: false,
    onSuccess: 'npm run build:types',
    clean: false,
    target: 'es2020',
    sourcemap: true,
    outExtensions: () => ({ js: '.mjs' }),
});
