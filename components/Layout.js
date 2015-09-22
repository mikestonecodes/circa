"use strict";

import React from 'react'
import {Link} from 'react-router'
export default class Layout {
  render() {

  	var login_item=( <div> <Link to='login'>Login</Link> <Link to='register'>Register</Link> </div>);
  	if(this.props.user&&this.props.user.username)login_item=<a href='/logout'>Logout</a> ;
    return (
      <div>
        <nav>
            <div id='title'>Circa </div>
        	<div id='login'> {login_item}        </div> 
     </nav>
     <div id='main'>
        {this.props.children}
        </div>
    </div>
    )
  }
}