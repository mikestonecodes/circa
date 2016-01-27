"use strict";

import React from 'react'
import {Link} from 'react-router'
class Layout extends React.Component {
    
  render() {
  	var login_item=( <div> <Link to='login'>Login</Link> <Link to='register'>Register</Link> </div>);
  	if(this.props.loggedInAs&&this.props.loggedInAs.username)login_item=(<div><a href='/game/create'>New Game </a><a href='/logout'>Logout</a></div>) ;
    return (
      <div>
        <nav>
            <div id='title'><a href='/'>Circa</a> </div>

        	<div id='login'> {login_item}        </div> 
     </nav>
     <div id='main'>
        {this.props.children}
        </div>
    </div>
    )
  }
}

export default Layout