import Reflux from 'reflux';
import React from 'react';

import Layout from './Layout';

    const Register = React.createClass({
      render: function() {
          return (
                       <Layout user={this.props.user}>
           { this.props.errors}
         <form role="form" action="/auth/local/register" method="post">
          <input type="text" name="username" placeholder="Username"/>
          <input type="text" name="email" placeholder="Email"/>
         <input type="password" name="password" placeholder="Password"/>
            <button type="submit">Sign up</button>
          </form>
            </Layout>
          )
      }
  });
  export default Register;


