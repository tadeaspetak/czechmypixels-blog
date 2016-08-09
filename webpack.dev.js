import path from 'path';
import productionConfiguration from './webpack.config.js';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

/**
 * Webpack configuration for development.
 * It extends the production configuration.
 */

export default function(app) {
  const config = productionConfiguration;

  //add SourceMap as DataUrl to the JavaScript file
  config.devtool = 'inline-source-map';
  //allow hot swapping
  config.entry.unshift('webpack-hot-middleware/client');

  //configure the `react transform` plugin
  config.module.loaders[0].query.plugins.push(['react-transform', {
        transforms: [{
          transform: 'react-transform-hmr',
          imports: ['react'],
          locals: ['module']
        }]
      }
    ]
  );

  //styles into the `bundle.js`
  /*config.module.loaders[1] = {
    test: /\.(s)?css$/,
    loader: "style!css!postcss!sass"
  };*/

  //augment the plugin array
  config.plugins.unshift(
    //all the following three plugins are required by the webpackHotMiddleware middleware
    //assign the module and chunk ids by occurrence count -> ids that are used often get lower (shorter) ids
    new webpack.optimize.OccurrenceOrderPlugin(),
    //hot reload plugin
    new webpack.HotModuleReplacementPlugin(),
    //do not exit with a fail code on encountering an error during compilation; skip emitting phase instead
    new webpack.NoErrorsPlugin()
  );

  //"load" the configuration
  const compiler = webpack(config);

  //serve the files emitted from webpack over a connect server (nothing is written to the disk)
  app.use(webpackDevMiddleware(compiler, {
    // display all info to console (not only warnings and errors)
    noInfo: true
  }));
  //allow webpack hot reloading
  app.use(webpackHotMiddleware(compiler));
}
