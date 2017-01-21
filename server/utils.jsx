import transit from 'transit-immutable-js';

import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { RouterContext } from 'react-router';

const { piwik } = require('./third-party');

/**
 * Fetch component data.
 *
 * Traverse through the component tree for the current view and load
 * data by `dispatching` methods in the `needs` property of the component
 * before returning the HTML of the view. This way, the returned response
 * contains HTML equivalent to the one rendered on the client, making
 * it truly isomorphic.
 */

export function fetchComponentData(store, props) {
  const needs = props.components.reduce((previous, component) =>
    (component.needs || []).map(need => need(props)).concat(
        ((component.WrappedComponent ? component.WrappedComponent.needs : []) || [])
          .map(need => need(props))
      ).concat(previous), []);
  return Promise.all(needs.map(need => store.dispatch(need)));
}

/**
 * Render the HTML data.
 */

export function renderPage(store, props) {
  return new Promise((resolve) => {
    const app = renderToString((<Provider store={store}><RouterContext {...props} /></Provider>));
    const head = Helmet.rewind();
    const html = `
    <!doctype html>
    <html>
      <head>
        <!-- keep the following three metas as the first ones in the head! -->
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <meta name="keywords" content="travelling, travels, hiking, pictures, photos, trips">
        <meta name="description" content="Pictures and scribbles from some of our travels 'round this blue planet.">
        <meta name="author" content="Marie Malá, Tadeáš Peták">
        <meta name="contact" content="tadeaspetak@gmail.com">

        ${head.meta.toString()}

        <link rel="icon" type="image/png" href="/media/favicon.ico">
        ${head.title.toString()}
        ${process.env.NODE_ENV === 'prod' ? '<link rel="stylesheet" type="text/css" href="/screen.css">' : ''}
        <script type="application/javascript">
          window.state = ${transit.toJSON(store.getState())};
        </script>
        ${piwik(process.env.NODE_ENV === 'prod' ? 'analytics.czechmypixels.com' : 'analytics.czechmypixels')}
      </head>
      <body>
        <div id="app"><div>${app}</div></div>
        <script src="/bundle.js"></script>
      </body>
    </html>
    `;

    resolve(html);
  });
}
