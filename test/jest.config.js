module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': '@swc/jest',
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
    testRegex: '(/unit/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
    testPathIgnorePatterns: [
        'dist',
        'unit/mock-util.ts',
    ],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,tsx,js,jsx}',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    rootDir: '../',
};
