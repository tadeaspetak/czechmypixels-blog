import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './app';
import Home from './pages/home';
import Trip from './pages/trip';
import Post from './pages/post';
import Picture from './pages/picture';

export default(
  <Route name="app" component={App} path="/">
    <IndexRoute component={Home} name="home" />
    <Route component={Trip} name="trip" path="/trip/:slug" />
    <Route component={Post} name="post" path="/post/:slug">
      <Route component={Picture} name="picture" path="/post/:slug/:picture" />
    </Route>
  </Route>
);
