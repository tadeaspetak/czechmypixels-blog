import transit from 'transit-immutable-js';

import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import promiseMiddleware from '../shared/lib/promiseMiddleware';
import reducers from '../shared/reducers';
import routes from '../shared/routes';

// import css & assets
require('font-awesome/css/font-awesome.css');
require('react-simple-modal/dist/react-simple-modal.css');
require('nprogress/nprogress.css');
require('../shared/styles/screen.scss');

require.context('../shared/assets/media', true, /^\.\//);

// initial state, leave top level keys untouched for Redux)
const state = transit.fromJSON(JSON.stringify(window.state));
const store = applyMiddleware(promiseMiddleware)(createStore)(reducers, state);
let hadPicture;
let renderedOnServer = true;

const onUpdate = function () {
  if (!renderedOnServer && process.env.BROWSER) {
    // slide up except when going to or from a picture
    if (hadPicture !== true && !this.state.params.picture) {
      window.scrollTo(0, 0);
    }
    hadPicture = typeof this.state.params.picture !== 'undefined';

    // track the change in the router
    _paq.push(['setCustomUrl', window.location.pathname]);
    _paq.push(['trackPageView', document.title]);
  }
  renderedOnServer = false;
};

render(
  <Provider store={store}>
    <Router history={browserHistory} onUpdate={onUpdate}>{routes}</Router>
  </Provider>, document.getElementById('app'));
