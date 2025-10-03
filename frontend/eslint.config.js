import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: '18.3' },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx'], // ⚡ plus besoin de mettre .jsx explicitement
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      // --- Règles JS de base ---
      ...js.configs.recommended.rules,
      'no-undef': 'error', // variables non définies = erreur
      'no-unused-vars': 'off', // remplacé par unused-imports
      'no-console': 'warn', // warning sur console.log
      eqeqeq: ['error', 'always'], // === obligatoire

      // --- Imports ---
      'import/no-unresolved': 'error', // import inexistant
      'import/no-duplicates': 'error',
      'import/named': 'error', // ⚡ check que les exports existent
      'import/no-named-as-default-member': 'error',
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external', 'internal']],
          alphabetize: { order: 'ignore' }, // on ignore l’ordre alpha pour plugins
        },
      ],

      // --- Nettoyage ---
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      // --- React ---
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react/prop-types': 'off', // si tu n’utilises pas PropTypes
      'react/jsx-no-target-blank': 'error',

      // --- Hooks ---
      ...reactHooks.configs.recommended.rules,

      // --- Refresh ---
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
    },
  },
];
