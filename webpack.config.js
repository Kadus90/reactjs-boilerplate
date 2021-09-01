/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const {HotModuleReplacementPlugin} = require('webpack');

const mode = process.env.ENV || 'development';

module.exports = {
  mode,
  entry: path.join(__dirname, 'src/index.jsx'),
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: '[name].[chunkhash].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
    },
  },
  devServer: {
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      favicon: false,
      showErrors: true,
      cache: true,
      template: path.join(__dirname, './src/index.html'),
    }),
    new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
    }),
    new ESLintPlugin(),
  ],
  performance: {
    hints: 'warning',
    assetFilter(assetFilename) {
      return assetFilename.endsWith('.js.gz');
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules\/*/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
  },
};
