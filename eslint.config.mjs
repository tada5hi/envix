import config from '@tada5hi/eslint-config';

export default config(
    { typescript: true },
    { ignores: ['**/dist/**', '**/*.d.ts', '**/coverage/**'] },
);
