// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from "globals";
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      '@stylistic': stylistic
    }
  },
  {
    ignores: ["build", "node_modules"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/no-trailing-spaces': ['error'],
      '@stylistic/no-multi-spaces': ['error'],
      '@stylistic/key-spacing': ['error'],
      '@stylistic/semi': ['error'],
      '@typescript-eslint/no-unused-vars': ['error', { "argsIgnorePattern": "^_" }]
    }
  }
);