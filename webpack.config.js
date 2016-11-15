const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

// webpack production configuration
var config = {
  entry: [path.resolve(__dirname, 'client')],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    //modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {test: /.jsx?$/, loader: 'babel', exclude: /node_modules/, query: {plugins: []}},
      {test: /\.(s)?css$/, loader: ExtractTextPlugin.extract("style", "css!postcss!sass")},
      {test: /\.(jpg|jpeg|gif|png|ico)$/, exclude: /node_modules/, loader: 'file?name=media/[name].[ext]'},
      {test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=fonts/[name].[ext]"}
    ]
  },
  plugins: [
    new ExtractTextPlugin("screen.css"),
    new CleanPlugin(['build']),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV ? process.env.NODE_ENV : 'development'),
        BROWSER: JSON.stringify(true)
      }
    })
  ]
};

/*query: {
  presets: ['es2015', 'stage-0', 'react'],
  plugins: ['transform-decorators-legacy']
}*/

module.exports = config;
