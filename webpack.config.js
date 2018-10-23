const { resolve } = require('path')
const excludeNodeModules = require('webpack-node-externals')
const HtmlPlugin = require('html-webpack-plugin')
const ExtractPlugin = require('extract-text-webpack-plugin')

module.exports = [
  {
    target: 'node',
    externals: [excludeNodeModules()],
    mode: 'production',
    entry: './server/index.ts',
    output: {
      filename: 'server.js',
      path: resolve(__dirname, 'built')
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    watch: true
  },
  {
    target: 'web',
    mode: 'production',
    entry: './client/index.ts',
    output: {
      filename: 'client.js',
      path: resolve(__dirname, 'built')
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader'
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
      new ExtractPlugin('style.css')
    ],
    watch: true
  }
]

