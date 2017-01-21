import express from 'express';
import { createMemoryHistory } from 'history';
import path from 'path';

import React from 'react'; // eslint-disable-line no-unused-vars
import { match } from 'react-router';
import { applyMiddleware, createStore } from 'redux';

import reducers from '../shared/reducers';
import promiseMiddleware from '../shared/lib/promiseMiddleware';
import routes from '../shared/routes';
import { fetchComponentData, renderPage } from './utils';

import devConfiguration from '../webpack.dev';

const app = express();
if (process.env.NODE_ENV !== 'production') devConfiguration(app);

app.use('/', express.static(path.join(__dirname, '../build')));
app.use((req, res) => {
  const history = createMemoryHistory(req.url);
  const store = applyMiddleware(promiseMiddleware)(createStore)(reducers);

  match({ routes, location: req.url, history }, (err, redirect, props) => {
    // set the `host` variable for later URL resolution when making calls to the API from the server
    process.env.HOST = req.get('host');

    if (err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }

    if (!props) {
      return res.status(404).end('Not found');
    }

    return fetchComponentData(store, props)
      .then(() => renderPage(store, props))
      .then(html => res.type('html').send(html))
      .catch((error) => {
        console.log(error);
        res.end('There has been an error! No pixels to be czeched here, sorry...');
      });
  });
});

export default app;
