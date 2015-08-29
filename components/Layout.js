"use strict";

import React from 'react'
import {Link} from 'react-router'
export default class Layout {
  render() {

  	var login_item=( <div> <Link to='login'>Login</Link> <Link to='register'>Register</Link> </div>);
  	if(this.props.user&&this.props.user.username)login_item="Hello "+this.props.user.username;
    return (
      <div>
        <nav>
            <div id='title'>Circa </div>
        	<div id='login'> {login_item}        </div> 
     </nav>
        {this.props.children}
    </div>
    )
  }
}