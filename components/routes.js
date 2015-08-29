"use strict";

import React from 'react'
import {RouteHandler, Route} from 'react-router'

module.exports = (
  <Route handler={RouteHandler}>
    <Route name="game" path="/game/:id" handler={require('./GameView.js')} />
    <Route name="login" path="/login" handler={require('./Login.js')}  />
     <Route name="user" path="/user/:username" handler={require('./User.js')}  />
        <Route name="register" path="/register" handler={require('./Register.js')}  />
  </Route>
);