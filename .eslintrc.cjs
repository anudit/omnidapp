module.exports = {
  extends: [
    "universe",
    "universe/shared/typescript-analysis",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/jsx-runtime"
  ],
  rules: {
    "prettier/prettier": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off"
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.d.ts"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  ],
};
