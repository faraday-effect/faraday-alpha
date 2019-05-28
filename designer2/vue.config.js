// Found at https://cli.vuejs.org/guide/webpack.html#adding-a-new-loader
// with additions from https://github.com/Akryum/vue-cli-plugin-apollo

module.exports = {
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule("graphql")
      .test(/\.(gql|graphql)$/)
      .use("graphql-tag/loader")
      .loader("graphql-tag/loader")
      .end();
  }
};
