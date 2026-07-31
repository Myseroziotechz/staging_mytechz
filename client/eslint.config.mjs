import { globalIgnores } from "eslint/config";

const nextPlugin = (await import("@next/eslint-plugin-next")).default;
const reactPlugin = (await import("eslint-plugin-react")).default;
const reactHooksPlugin = (await import("eslint-plugin-react-hooks")).default;

const eslintConfig = [
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
    "next-env.d.ts",
  ]),

  // Language options — this project writes JSX inside plain `.js` files
  // (e.g. app/**/page.js), so JSX must be enabled for every linted file or
  // espree fails with "Parsing error: Unexpected token <".
  {
    name: "language-options",
    files: ["**/*.{js,mjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // Browser
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        fetch: "readonly",
        crypto: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        console: "readonly",
        // Node / Next runtime
        process: "readonly",
        Buffer: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
      },
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // Next.js recommended rules
  {
    name: "nextjs-recommended",
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      "@next/next/google-font-display": "warn",
      "@next/next/google-font-preconnect": "warn",
      "@next/next/next-script-for-ga": "warn",
      "@next/next/no-async-client-component": "warn",
      "@next/next/no-before-interactive-script-outside-document": "warn",
      "@next/next/no-css-tags": "warn",
      "@next/next/no-head-element": "warn",
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "warn",
      "@next/next/no-page-custom-font": "warn",
      "@next/next/no-styled-jsx-in-document": "warn",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-title-in-document-head": "warn",
      "@next/next/no-typos": "warn",
      "@next/next/no-unwanted-polyfillio": "warn",
      "@next/next/inline-script-id": "error",
      "@next/next/no-assign-module-variable": "error",
      "@next/next/no-document-import-in-page": "error",
      "@next/next/no-duplicate-head": "error",
      "@next/next/no-head-import-in-document": "error",
      "@next/next/no-script-component-in-head": "error",
    },
  },

  // React + Hooks rules. `react-hooks` must be registered as a plugin or
  // inline `// eslint-disable-next-line react-hooks/exhaustive-deps` comments
  // fail with "Definition for rule ... was not found".
  {
    name: "react-and-hooks",
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-key": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/no-children-prop": "error",
      "react/no-direct-mutation-state": "error",
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
