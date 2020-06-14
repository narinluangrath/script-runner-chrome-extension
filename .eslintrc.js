module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    node: true,
    webextensions: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
  },
};
