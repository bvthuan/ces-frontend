'use strict';

const webpackMerge = require('webpack-merge');
const webpack = require('webpack');

const commonConfig = require('./webpack.config.common');
const helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  mode: 'development',

  devtool: 'cheap-module-eval-source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },

  optimization: {
    noEmitOnErrors: true
  },

  module: {
    rules: [{
      test: /\.ts$/,
      loaders: [{
          loader: 'awesome-typescript-loader',
          options: {
            configFileName: helpers.root('tsconfig.json')
          }
        },
        'angular2-template-loader',
        'angular-router-loader',
      ],
      exclude: [/node_modules/],
    }]
  },

  plugins: [
    new webpack.DefinePlugin({
      // global app config object
      config: JSON.stringify({
        apiUrl: 'https://localhost:44301'
      })
    })
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
  }
});