import Reflux from 'reflux';
import React from 'react';
import Layout from './Layout';
import Lobby from './Lobby';
    const botApi = React.createClass({
      render: function() {
          if(!this.props.user)
          {
            return <div><br/>Please login</div>
          }
          return (
            <div>
      
                 <h1>{this.props.user.username} </h1>
                 <div className='stats'>
                    Access Token:<span className='wins'>{this.props.token}</span> <br/>
                 </div>      
           </div>
          )
      }
  });
  export default botApi