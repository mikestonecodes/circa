import Reflux from 'reflux';
import React from 'react';
import Layout from './Layout';
    const userView = React.createClass({
      render: function() {

          return (
            <div>
                 <h1>{this.props.user.username} </h1>
                 <a href='/game/create'>New Game!! </a>
           </div>
          )
      }
  });
  export default userView