import Reflux from 'reflux';
import React from 'react';
import Layout from './Layout';
import Lobby from './Lobby';
    const userView = React.createClass({
      render: function() {

          return (
            <div>
      
                 <h1>{this.props.user.username} </h1>
                 <div className='stats'>
                    Wins:<span className='wins'>{this.props.wins}</span> <br/>
                    Losses:<span className='losses'>{this.props.losses}</span> <br/>
                 </div>
                           <div className=' booyah-box usergames '>
                 <h2>games</h2>
                 <Lobby  count={this.props.count} games={this.props.games} user={this.props.user} />
                 
                 </div>
           </div>
          )
      }
  });
  export default userView