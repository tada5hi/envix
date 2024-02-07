import resolve from '@rollup/plugin-node-resolve';
import swc from "@rollup/plugin-swc";
import pkg from './package.json' assert {type: 'json'};

const extensions = [
    '.cjs',
    '.mjs',
    '.mts',
    '.cts',
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
];

export default [
    {
        input: './src/index.ts',
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
        ],
        plugins: [
            resolve({ extensions}),

            swc()
        ],
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: true
            }, {
                file: pkg.module,
                format: 'esm',
                sourcemap: true
            }
        ]
    }
];
