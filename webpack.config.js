const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './app.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'final.js',
  },
  target: 'node',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
    new webpack.IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [
          'bson-ext',
          'kerberos',
          '@mongodb-js/zstd',
          'snappy',
          'aws4',
          'mongodb-client-encryption',
          'bufferutil',
          'utf-8-validate',
          'snappy',
          'snappy/package.json',
        ];
        if (!lazyImports.includes(resource)) {
          return false;
        }
        try {
          require.resolve(resource);
        } catch (err) {
          return true;
        }
        return false;
      },
    }),
  ],
};