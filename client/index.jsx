import transit from 'transit-immutable-js';

import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';

import promiseMiddleware from '../shared/lib/promiseMiddleware';
import reducers from '../shared/reducers';
import routes from '../shared/routes';

//make sure we are in the browser before requiring styles, otherwise, there shall be errors!
if (process.env.BROWSER) {
  require('font-awesome/css/font-awesome.css');
  require('nprogress/nprogress.css');
  require('../shared/styles/screen.scss');

  require.context('../shared/assets/media', true, /^\.\//);
}

//initial state (transform into Immutable.js collections, but leave top level keys untouched for Redux)
const state = transit.fromJSON(JSON.stringify(window.state));
const store = applyMiddleware(promiseMiddleware)(createStore)(reducers, state);
var hadPicture = undefined;
var renderedOnServer = true;

let onUpdate = function() {
  if (!renderedOnServer && process.env.BROWSER) {
    //slide up except when going to or from a picture
    if (hadPicture !== true && !this.state.params.picture) {
      window.scrollTo(0, 0);
    }
    hadPicture = typeof this.state.params.picture !== 'undefined';

    //track the change in the router
    _paq.push(['setCustomUrl', window.location.pathname]);
    _paq.push(['trackPageView', document.title]);
  }
  renderedOnServer = false;
}

render(
  <Provider store={store}>
  <Router children={routes} history={browserHistory} onUpdate={onUpdate}/>
</Provider>, document.getElementById('app'));
