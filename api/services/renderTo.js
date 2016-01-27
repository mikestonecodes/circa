import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import DataWrapper from '../../shared/datawrapper'
import _ from 'lodash';

module.exports = function(routes, method, url, locals, state) {
	//serve((req, res) => {
  // Note that req.url here should be the full URL path from
  // the original request, including the query string.

  match({ routes, location: url }, (error, redirectLocation, renderProps) => {

    if (error) {
    //  res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      if (state)
      locals.state = 'window.__ReactInitState__=' + JSON.stringify(state) + ';';

 	function createElement(Component, props) {
    return <Component {...state} {...props} />;
  }

 
    method("layout", {
      locals: locals||{title:'',description:''},
      body: renderToString(<RouterContext createElement = {createElement} {...renderProps}/> )
    });
    } else {
    	console.log("not found");
      //res.status(404).send('Not found')
    }
    

  //})
})

 /*
  render(<Router>{routes}</Router>, url, (Root) => {
    
  });
*/

}