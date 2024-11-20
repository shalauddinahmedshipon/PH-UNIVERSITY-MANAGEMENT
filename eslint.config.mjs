import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],

    // Define language options, including globals
    languageOptions: {
      parser: tseslintParser,
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node, // Includes `process` and other Node.js globals
      },
    },

    // Ignore unnecessary files
    ignores: ["node_modules", "dist"],

    // Define rules
    rules: {
      "no-unused-vars": "error",
      "no-unused-expressions": "error",
      "prefer-const": "error",
      "no-console": "warn",
      "no-undef": "error",
    },
  },

  // Include recommended configs
  pluginJs.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
];
