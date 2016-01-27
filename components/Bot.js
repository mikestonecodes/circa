import Reflux from 'reflux';
import React from 'react';
import { Button } from 'react-bootstrap';
import BoardActions from '../shared/BoardActions';
import Layout from './Layout';
    const botView = React.createClass({
       getInitialState: function() {
        console.log(this.props.user)
        return {
            code: this.props.user.botclass
        };
    },
    updateCode: function(event) {
        this.setState({
            code: event.target.value.toString()
        });
    },
    save: function()
    {
      BoardActions.updateBot(this.props.user.username,this.state.code);
    },
    render: function() {
      
        return (
          <div>
            <h1>{this.props.user.username}</h1>
            <textarea className='botcode' value={this.state.code} onChange={this.updateCode}  />  
            <Button onClick={this.save}>Update</Button>
          </div>
        )
    }
  });
  export default botView