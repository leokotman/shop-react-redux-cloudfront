/* eslint-env node */
const path = require("path");

const repoRoot = __dirname;

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // Absolute paths + tsconfigRootDir so resolution does not depend on shell cwd.
    // Do not use a cwd-based "infra/**/*.ts" override: from `infra/`, paths are `lib/...`
    // and would miss the override, falling back to root tsconfig (`bundler`) and breaking
    // parsers that only allow node16/nodenext.
    project: [
      path.join(repoRoot, "tsconfig.json"),
      path.join(repoRoot, "infra", "tsconfig.json"),
    ],
    tsconfigRootDir: repoRoot,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:prettier/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "react", "prettier"],
  env: {
    browser: true,
    node: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      // This file is JS, not part of any tsconfig "include". Parsing it with
      // @typescript-eslint/parser + project loads TS compiler options in a way
      // that breaks in some environments (e.g. moduleResolution "bundler").
      files: [".eslintrc.cjs"],
      parser: "espree",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "script",
        project: null,
      },
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
