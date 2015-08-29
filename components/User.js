import Reflux from 'reflux';
import React from 'react';
import Layout from './Layout';
    const userView = React.createClass({
      render: function() {
          return (
            <Layout user={this.props.loggedInAs}>
                 <h1>{this.props.user.username} </h1>
                 <a href='/game/create'>New Game!! </a>
           </Layout>
          )
      }
  });
  export default userView