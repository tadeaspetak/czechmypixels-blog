import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from 'app';

//pages
import Home from 'pages/home';
import Post from 'pages/post';
import Picture from 'pages/picture';

/**
 * Route definitions.
 */

export default(
  <Route name="app" component={App} path ="/">
    <IndexRoute component={Home} name="home" />
    <Route component={Post} name="post" path="/post/:slug">
      <Route component={Picture} name="picture" path="/post/:slug/:picture" />
    </Route>
  </Route>
);
