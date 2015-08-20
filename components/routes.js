"use strict";

import React from 'react'
import {RouteHandler, Route} from 'react-router'

module.exports = (
  <Route handler={RouteHandler}>
    <Route name="game" path="/game/:id" handler={require('./GameView.js')} />
  </Route>
);