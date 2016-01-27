import React from 'react';
import { Router, Route,browserHistory } from 'react-router';
import routes from './routes'
import _ from 'lodash';
//React.createElement(Component, props),
ReactDOM.render((<Router history={browserHistory} createElement={createElement}>{routes}</Router>), document.getElementById('main_react'));
delete window.__ReactInitState__;
function createElement(Component, props) {
   // Add myprop to props for all route components
   console.log(window.__ReactInitState__);
   let CompontentWithProps=<Component {...window.__ReactInitState__}{...props} />
   //;
  return CompontentWithProps
}
/*
render(<Router history={history}>{require('./routes.js')}<Router>, (Root) => {
  React.render(<Root {...window.__ReactInitState__} />, document.body);
  delete window.__ReactInitState__;
});*/


