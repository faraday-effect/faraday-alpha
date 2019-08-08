// Source map setup: https://vuejs.org/v2/cookbook/debugging-in-vscode.html#Displaying-Source-Code-in-the-Browser

module.exports = {
  configureWebpack: {
    // Source mappings in order of increasing time and utility.
    //  - https://webpack.js.org/configuration/devtool/#devtool
    // devtool: "cheap-module-eval-source-map",
    // devtool: "eval-source-map",
    devtool: "source-map", // Recommended for VSCode Chrome extension
    // devtool: "inline-source-map",

    output: {
      devtoolModuleFilenameTemplate: info => {
        let $filename = "sources://" + info.resourcePath;
        if (
          info.resourcePath.match(/\.vue$/) &&
          !info.query.match(/type=script/)
        ) {
          $filename =
            "webpack-generated:///" + info.resourcePath + "?" + info.hash;
        }
        console.log("FILENAME", $filename);
        return $filename;
      },

      devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]?[hash]"
    }
  }
};
