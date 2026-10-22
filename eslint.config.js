import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
export default tseslint.config(
  { ignores: ['dist/**','coverage/**'] }, js.configs.recommended, ...tseslint.configs.recommended,
  { files: ['src/ui/**/*.{ts,tsx}'], languageOptions: { globals: globals.browser }, plugins: { 'react-hooks': reactHooks }, rules: reactHooks.configs.recommended.rules },
  { files: ['src/plugin/**/*.ts'], languageOptions: { globals: { figma: 'readonly', __html__: 'readonly' } } },
  { files: ['scripts/**/*.{js,mjs,ts}', 'vite.config.ts'], languageOptions: { globals: globals.node } },
  { rules: { '@typescript-eslint/no-explicit-any': 'off' } }
);
