"use strict";

import React from 'react'
import {RouteHandler, Route,Router,IndexRoute,browserHistory} from 'react-router'
import Layout from './Layout';
import Login from './Login';
import Lobby from './Lobby';
import GameView from './GameView';
import User from './User';
import Bot from './Bot';
import Register from './Register';
 export default (
 
	//console.log(require('./GameView.js'));
 <Route path="/" component={Layout}>
 	<Route path="game/:id" component={GameView} />
 	<Route path="game/:id/join/:joincolor" component={GameView} />
 	<Route path="login" component={Login} />
 	<Route path="lobby" component={Lobby} />
 	<IndexRoute component={Lobby} />
 	<Route path="user/:username" component={User} />
 	<Route path="bot/:username" component={Bot} />
 	<Route path="register" component={Register} />
 </Route>
);