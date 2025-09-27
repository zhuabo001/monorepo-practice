import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
const ignores = ['**/node_modules/**', '**/dist/**', '**/public/**', '.*', 'scripts/**', '**/*.d.ts'];

export default defineConfig({
    extends: [eslint.configs.recommended],
    ignores,
    plugins: {
        vue: eslintPluginVue,
        prettier: eslintPluginPrettier
    },
    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.es2022
        }
    },
    settings: {
        vue: {
            version: 'detect'
        }
    },

    rules: {
        'no-console': 'warn',
        'no-unused-vars': 'warn',
        'no-extra-semi': 'warn',
        'no-extra-boolean-cast': 'warn'
    },
    env: {
        node: true,
        es2022: true
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    }
});
