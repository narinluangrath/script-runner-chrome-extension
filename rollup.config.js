export default [
  {
    input: "src/background.js",
    output: {
      file: "dist/background.js",
      format: "iife",
    },
  },
  {
    input: "src/content.js",
    output: {
      file: "dist/content.js",
      format: "iife",
    },
  },
  {
    input: "src/popup.js",
    output: {
      file: "dist/popup.js",
      format: "iife",
    },
  },
];
