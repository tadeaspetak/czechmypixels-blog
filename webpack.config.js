/**
 * Webpack configuration for production.
 *
 * Development configuration augments this production
 * config object -> ensure any changes are not breaking.
 */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
  addVendor: function(name, path) {
    this.resolve.alias[name] = path;
    this.module.noParse.push(new RegExp(path));
  },
  //entry point(s) to the app
  entry: [
    path.resolve(__dirname, './client')
  ],
  //output goes to `build/bundle.js`
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  //modules resolving
  resolve: {
    //module directories (not necessary to pass full paths as webpack looks in `./`,`../`, `../../`, etc.)
    modulesDirectories: ['node_modules', 'shared'],
    //extensions that should be used to resolve modules
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      //.jsx file loader -> es2015 and react babel extensions (make sure to also include the same config in the `.babelrc` file)
      test: /.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'stage-0', 'react'],
        plugins: ['transform-decorators-legacy']
      }
    }, {
      //SASS
      test: /\.(s)?css$/,
      loader: ExtractTextPlugin.extract("style", "css!postcss!sass")
    }, {
      //all images into the `media` directory
      test: /\.(jpg|jpeg|gif|png|ico)$/,
      exclude: /node_modules/,
      loader: 'file?name=media/[name].[ext]'
    }, {
      //all font files into the `fonts` directory
      test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      loader: "file?name=fonts/[name].[ext]"
    }]
  },
  plugins: [
    //combine all the .css and .sass files into `screen.css`
    new ExtractTextPlugin("screen.css"),
    new webpack.DefinePlugin({
      "process.env": {
        //set `NODE_ENV` variable equal to the `process.env.NODE_ENV` variable (forces React to use production version)
        NODE_ENV: JSON.stringify(process.env.NODE_ENV ? process.env.NODE_ENV : 'development'),
        //set the `BROWSER` variable to true (useful for determining context in the shared code base)
        BROWSER: JSON.stringify(true)
      }
    })
  ]
};

module.exports = config;
