import Reflux from 'reflux';
import React from 'react';

import Layout from './Layout';

    const Login = React.createClass({
      render: function() {
          return (
            <Layout user={this.props.user}>
             { this.props.errors}
                 <form role="form" action="/auth/local" method="post">
  					<input type="text" name="identifier" placeholder="Username or Email" />
					  <input type="password" name="password" placeholder="Password"/>
					  <button type="submit">Sign in</button>
</form>
           </Layout>
          )
      }
  });
  export default Login;


