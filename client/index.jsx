import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import routes from 'routes';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import promiseMiddleware from 'lib/promiseMiddleware';
import transit from 'transit-immutable-js';
import * as reducers from 'reducers';

/**
 * Client gateway into the app.
 */

//make sure we are in the browser before requiring styles, otherwise, there shall be errors!
if (process.env.BROWSER) {
  //require styles
  require('font-awesome/css/font-awesome.css');
  require('nprogress/nprogress.css');
  require('../shared/styles/fonts.scss');
  require('../shared/styles/modalPicture.scss');
  require('../shared/styles/modal.scss');
  require('../shared/styles/screen.scss');

  //require all images (TODO: look into this, especially the webpack config)
  require.context('../shared/media', true, /^\.\//);
}

//initial state (transform into Immutable.js collections, but leave top level keys untouched for Redux)
const state = transit.fromJSON(JSON.stringify(window.state));
const reducer = combineReducers(reducers);
const store = applyMiddleware(promiseMiddleware)(createStore)(reducer, state);
var hadPicture = undefined;

let onUpdate = function() {
  if (process.env.BROWSER) {

    //slide up except when going to or from a picture
    if (hadPicture !== true && !this.state.params.picture) {
      window.scrollTo(0, 0);
    }
    hadPicture = typeof this.state.params.picture !== 'undefined';

    //track the change in the router
    _paq.push(['setCustomUrl', window.location.pathname]);
    _paq.push(['trackPageView', document.title]);
  }
}

//render the app into the `#app` element
render(
  <Provider store={store}>
  <Router children={routes} history={browserHistory} onUpdate={onUpdate}/>
</Provider>, document.getElementById('app'));
