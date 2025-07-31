import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': 'error', // prettier 포맷 규칙 적용
    },
  },
  pluginReact.configs.flat.recommended,
  prettier, // prettier 설정을 가장 마지막에 넣어야 합니다!
]);

