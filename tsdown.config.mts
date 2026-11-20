import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: 'src/index.ts',
    format: ['esm'],
    dts: true,
    clean: false,
    target: 'es2020',
    sourcemap: true,
    outExtensions: () => ({ js: '.mjs', dts: '.d.ts' }),
});
