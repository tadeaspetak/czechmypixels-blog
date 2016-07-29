import {useBasename, createMemoryHistory} from 'history';
import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import routes from 'routes';
import {RouterContext, match} from 'react-router';
import path from 'path';
import fs from 'fs';

//state
import {applyMiddleware, createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import promiseMiddleware from 'lib/promiseMiddleware';
import transit from 'transit-immutable-js';
import * as reducers from 'reducers';
import Helmet from 'react-helmet';

/**
 * Server configuration.
 */

const app = express();
var history = useBasename(createMemoryHistory)({basename: '/'})

//make sure the path to EVERYTHING is corrrect
process.chdir(__dirname);

// load `dev` configuration if we are not in the production environment (TODO: try removing the `default` bit below)
if (process.env.NODE_ENV === 'production') {
  console.log("PRODUCTION!");
} else {
  require('./webpack.dev').default(app);
  console.log("DEVELOPMENT!");
}

// static files in `/dist` (TODO: how does this work in the `dev` mode?)
app.use(express.static(path.join(__dirname, 'build')));

app.use((req, res) => {
  const reducer = combineReducers(reducers);
  const store = applyMiddleware(promiseMiddleware)(createStore)(reducer);

  match({
    routes: routes,
    location: history.createLocation(req.url)
  }, (err, redirect, props) => {
    //an error occured!
    if (err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }

    //page not found
    if (!props) {
      return res.status(404).end('Not found');
    }

    /**
     * Render the view.
     *
     * This function reads the `index.html` from the file system and replaces
     * the `{{appHtml}}` bit in it with the page renedered. It's isomorphic
     * (or universal?) as rendering happens on the server and the client receives
     * full HTML for the current path.
     */

    function renderView() {
      return new Promise((resolve, reject) => {
        let app = renderToString((<Provider store={store}><RouterContext {...props}/></Provider>));
        let head = Helmet.rewind();

        let html = `
        <!doctype html>
        <html>
          <head>
            <!-- keep the following three metas as the first ones in the head! -->
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">

            <!-- TODO: keywords and description -->
            <meta name="keywords" content="">
            <meta name="description" content="">
            <meta name="author" content="Tadeas Petak <tadeaspetak@gmail.com>">

            ${head.meta.toString()}

            <!-- necessary when dealing with nested routes -->
            <base href="/">

            <link rel="icon" type="image/png" href="media/favicon.ico">
            ${head.title.toString()}
            <link rel="stylesheet" type="text/css" href="screen.css">
            <script type="application/javascript">
              window.state = ${transit.toJSON(store.getState())};
            </script>
          </head>

          <body>
            <div id="app"><div>${app}</div></div>
            <script src="bundle.js"></script>
          </body>
        </html>
        `;

        resolve(html);
      });
    }

    fetchComponentData(store.dispatch, props.components, props.params)
        .then(renderView)
        .then(html => res.type('html').send(html))
        .catch(error => res.end(error.message));
  });
});

function fetchComponentData(dispatch, components, params) {
  const needs = components.reduce((previous, component) => {
    return (component.needs || []).map(need => need.bind(component))
      .concat(((component.WrappedComponent ? component.WrappedComponent.needs : []) || []).map(need => need.bind(component)))
      .concat(previous);
    }, []);

    return Promise.all(needs.map(need => dispatch(need(params))));
}

export default app;
