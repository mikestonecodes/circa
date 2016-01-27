import Reflux from 'reflux';
import React from 'react';

import Layout from './Layout';

      export default class Login extends React.Component  {
      render(){
          return (
            <div className='login booyah-box col-xs-6 col-xs-offset-3'>
            <h2>Sign in</h2><br/>
             { this.props.errors}
                 <form role="form" action="/auth/local" method="post">
  					<input type="text" name="identifier" placeholder="Username or Email" />  <br/>

					  <input type="password" name="password" placeholder="Password"/> <br/>
					  <button type="submit">Sign in</button>
</form>
           </div>
          )
      }
  }


