import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-node-polyfills";

const SRC_FILES = ["background.js", "content.js", "popup.js"];

export default SRC_FILES.map((file) => ({
  input: `src/${file}`,
  output: {
    file: `dist/${file}`,
    format: "iife",
  },
  plugins: [resolve(), commonjs(), nodePolyfills()],
}));
