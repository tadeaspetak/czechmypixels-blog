import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware'; // eslint-disable-line import/no-extraneous-dependencies
import webpackHotMiddleware from 'webpack-hot-middleware'; // eslint-disable-line import/no-extraneous-dependencies

import config from './webpack.config';

// dev configuration (extends production configuration)
export default function (app) {
  config.devtool = 'inline-source-map';
  config.entry.unshift('webpack-hot-middleware/client');

  // remove the extract-text-webpack-plugin
  config.module.loaders[1].loader = 'style!css!postcss!sass';
  config.plugins.splice(0, 1);

  // possibly speed up the dev build a background-position
  config.resolve.unsafeCache = true;

  // react hot module reload
  config.module.loaders[0].query.plugins.push(['react-transform', {
    transforms: [{ transform: 'react-transform-hmr', imports: ['react'], locals: ['module'] }]
  }]);

  // extra plugins
  config.plugins.unshift(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );

  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}
