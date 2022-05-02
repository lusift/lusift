module.exports = {
    parser: '@typescript-eslint/parser',
    ignorePatterns: ["**/node_modules/**"],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-parameter-properties': 0,
        '@typescript-eslint/interface-name-prefix': 0
    }
};
