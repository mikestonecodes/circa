import Reflux from 'reflux';
import React from 'react';

import Layout from './Layout';

    const Register = React.createClass({
      render: function() {
          return (
                      <div className='login booyah-box col-xs-6 col-xs-offset-3'>
            <h2>Sign in</h2><br/>
           { this.props.errors}
         <form role="form" action="/auth/local/register" method="post">
          <input type="text" name="username" placeholder="Username"/> <br/>
          <input type="text" name="email" placeholder="Email"/> <br/>
         <input type="password" name="password" placeholder="Password"/> <br/>
            <button type="submit">Sign up</button>
          </form>
            </div>
          )
      }
  });
  export default Register;


