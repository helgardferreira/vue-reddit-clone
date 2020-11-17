module.exports = {
    env: {
        browser: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/essential',
        'plugin:vue/recommended',
    ],
    globals: {
        'Vue': false,
    },
    plugins: [
        'vue',
    ],
    rules: {
        'comma-dangle': ['error', {
            'arrays': 'always',
            'objects': 'always',
            'imports': 'always',
            'exports': 'always',
            'functions': 'never',
        },],
        indent: [ 'error', 4, { SwitchCase: 1, }, ],
        'no-console': [
            'error',
            { allow: [ 'error', 'log', 'warn', ], },
        ],
        'no-trailing-spaces': [ 'error', ],
        semi: [ 'error', 'always', ],
        quotes: [ 'error', 'single', ],
        'vue/html-indent': [ 'error', 4, ],
    },
};
