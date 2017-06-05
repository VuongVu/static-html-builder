// Webpack config for development
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const host = (process.env.HOST || 'localhost');
const port = (Number(process.env.PORT) + 1) || 3001;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSCSS = new ExtractTextPlugin('[name].css');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const isDev = process.env.NODE_ENV === 'development';
const pages = require('../src/data/pages')(isDev);

module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..', 'src'),
  entry: {
    // 'hmr': 'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
    'livereload': `webpack-livereload-plugin?path=http://${host}:${port}/__webpack_livereload`,
    'app': './js/app.js',
    'style': './sass/style.scss'
  },
  output: {
    path: path.resolve(__dirname, isDev ? '../dist' : '../build'),
    filename: 'js/[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: ''
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractSCSS.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './webpack/postcss.config.js'
              }
            }
          }, {
            loader: 'sass-loader',
            options: {
              includePaths: [
                'node_modules/bootstrap-sass/assets/stylesheets'
              ]
            }
          }]
        })
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
              name: './fonts/[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          { 
            loader: 'file-loader',
            options: {
              name: './fonts/[hash].[ext]'
            }
          }
        ]
      },
      { 
        test: /\.png$/, 
        use: {
          loader: 'file-loader',
          options: {
            name: './images/[hash].[ext]'
          }
        }
      },
      { 
        test: /\.pug$/, 
        use: {
          loader: 'pug-loader',
          options: {
            pretty: isDev
          }
        }
      }
    ]
  },
  resolve: {
    moduleExtensions: [
      'src',
      'node_modules'
    ],
    extensions: ['.json', '.js']
  },
  plugins: [
    // live reload
    ...isDev ? [new LiveReloadPlugin()] : [],
    // minify
    ...isDev ? [] : [new webpack.optimize.UglifyJsPlugin({
      include: /\.js$/,
      minimize: true
    })],
    // css
    extractSCSS,
    // html pages
    ...pages.map((page) => {
      return new HtmlWebpackPlugin(Object.assign(
        {},
        { inject: false }, // favicon: 'favicon.ico'
        { dev: isDev },
        page
      ));
    })
  ]
};
