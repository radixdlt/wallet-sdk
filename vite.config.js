const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/main.ts"),
      name: "js-sdk",
      fileName: (format) => `js-sdk.${format}.js`,
    },
  },
});
