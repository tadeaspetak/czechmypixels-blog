const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const includes = [
  path.resolve(__dirname, 'client'),
  path.resolve(__dirname, 'server'),
  path.resolve(__dirname, 'shared'),
  path.resolve(__dirname, 'node_modules/font-awesome'),
  path.resolve(__dirname, 'node_modules/react-simple-modal'),
  path.resolve(__dirname, 'node_modules/nprogress')
];

// webpack production configuration
const config = {
  entry: [path.resolve(__dirname, 'client')],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    // modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /.jsx?$/, loader: 'babel', include: includes, query: { plugins: [] } },
      { test: /\.(s)?css$/, include: includes, loader: ExtractTextPlugin.extract('style', 'css!postcss!sass') },
      { test: /\.(jpg|jpeg|gif|png|ico)$/, include: includes, loader: 'file?name=media/[name].[ext]' },
      { test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, include: includes, loader: 'file?name=fonts/[name].[ext]' }
    ]
  },
  plugins: [
    new ExtractTextPlugin('screen.css'),
    new CleanPlugin(['build']),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV ? process.env.NODE_ENV : 'development'),
        BROWSER: JSON.stringify(true)
      }
    })
  ]
};

module.exports = config;
