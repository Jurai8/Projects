const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  webpack: {
    plugins: [
      new NodePolyfillPlugin(),
    ],
    configure: (webpackConfig) => {
      // Modify the webpack configuration
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        process: require.resolve('process/browser'),
        fs: false, // Disable fs as it's not available in the browser
        net: false,
        child_process: false,
      };

      // Ignore 'express' dynamic imports and other specific modules
      webpackConfig.module.rules.push({
        test: /express/,
        loader: 'ignore-loader', // Ignore 'express' module's dynamic require calls
      });

      // You can also add a custom warning suppressor if necessary
      webpackConfig.ignoreWarnings = [
        (warning) =>
          warning.message &&
          warning.message.includes('Critical dependency: the request of a dependency is an expression'),
      ];

      return webpackConfig;
    },
  },
};