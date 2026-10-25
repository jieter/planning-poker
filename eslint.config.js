import importX from 'eslint-plugin-import-x';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
    {
        ignores: ['assets/', 'staticfiles/', 'htmlcov/'],
    },
    ...svelte.configs.prettier,
    {
        files: ['**/*.svelte', '**/*.svelte.ts'],
        languageOptions: {
            parserOptions: {
                parser: ts.parser,
            },
        },
    },
    {
        files: ['**/*.ts'],
        ignores: ['**/*.svelte.ts'],
        languageOptions: {
            parser: ts.parser,
        },
    },
    {
        languageOptions: {
            globals: globals.browser,
        },
        plugins: {
            'import-x': importX,
        },
        rules: {
            'no-unsafe-optional-chaining': 'error',
            'import-x/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', ['parent', 'sibling']],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
        },
    },
);
