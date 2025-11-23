// eslint.config.js
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default [
  // Config JS recommandée
  js.configs.recommended,

  // Config TS recommandée
  ...tseslint.configs.recommended,

  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["dist/"],

    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },

      // Déclare les globals pour éviter les erreurs "not defined"
      globals: {
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        console: "readonly",
      },
    },

    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
    },

    rules: {
      /** React */
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      /** Hooks rules */
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      /** TS rules */
      "@typescript-eslint/no-unused-vars": "warn",

      /** Override JS rules */
      "no-undef": "off", // TS gère déjà
    },

    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
