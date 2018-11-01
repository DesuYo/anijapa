const { resolve } = require('path')
const excludeNodeModules = require('webpack-node-externals')
const HtmlPlugin = require('html-webpack-plugin')
const ExtractPlugin = require('extract-text-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = [
  {
    target: 'node',
    externals: [excludeNodeModules()],
    mode: 'production',
    entry: './server/index.js',
    node: {
      __dirname: false
    },
    output: {
      filename: 'server.js',
      path: resolve(__dirname, 'built')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader'
        },
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    }
  },
  {
    target: 'web',
    mode: 'production',
    entry: './client/index.js',
    output: {
      filename: 'client.js',
      path: resolve(__dirname, 'built', 'public')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader'
        },
        {
          test: /\.vue$/,
          use: 'vue-loader'
        },
        {
          test: /\.scss$/,
          use: ExtractPlugin.extract({
            fallback: 'style-loader',
            use: 'sass-loader'
          })
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    plugins: [
      new HtmlPlugin({
        template: './client/index.html'
      }),
      new ExtractPlugin('style.css'),
      new VueLoaderPlugin()
    ]
  }
]

