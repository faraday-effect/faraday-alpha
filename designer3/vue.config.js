// Source map setup: https://vuejs.org/v2/cookbook/debugging-in-vscode.html#Displaying-Source-Code-in-the-Browser

module.exports = {
  configureWebpack: {
    // Source mappings in order of increasing time and utility.
    //  - https://webpack.js.org/configuration/devtool/#devtool
    // devtool: "cheap-module-eval-source-map",
    // devtool: "eval-source-map",
    // devtool: "inline-source-map",
    devtool: "source-map" // Recommended for VSCode Chrome extension; also works in Chrome debugger
  },

  pluginOptions: {
    // https://www.npmjs.com/package/vue-cli-plugin-webpack-bundle-analyzer
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  }
};
