const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');

module.exports = merge(common, {
  // Set the mode to development or production
  mode: 'development',
  // Control how source maps are generated
  devtool: 'inline-source-map',

  // Spin up a server for quick development
  devServer: {
    port: 9000,
    historyApiFallback: true,
    open: true,
    compress: true,
    static: [
      {
        directory: './src/index.html',
        directory: './src/js/workers/'
      },
    ],
    client: {
      //Close overlay, if use workbox 
      overlay: true,
    },
  },

  plugins: [
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),
  ],
});
