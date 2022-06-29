/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/wallet-sdk.ts'),
      name: 'wallet-sdk',
      fileName: (format) => `wallet-sdk.${format}.js`,
    },
  },
})
