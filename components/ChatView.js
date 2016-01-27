'use strict';
import React from 'react';
import Reflux from 'reflux';
import BoardActions from '../shared/BoardActions';
import {List} from 'immutable'
  const ChatView = React.createClass({
    
    onKeyDown: function(event) {
      if (event.keyCode === 13) {
        console.log(event.target.value);
        BoardActions.submitChatMessage(event.target.value.toString());
      }
    },
    render: function() {

          var messages=this.props.board.messages?this.props.board.messages.map(msg => {
            var chaticonclass='chatusericon';
            if(this.props.board.whiteUser.id==msg.user.id)chaticonclass+=' white';
            if(this.props.board.blackUser.id==msg.user.id)chaticonclass+=' black';
            return <div className='chatentry'> 
              <div className={chaticonclass}>
                <div className='notplayerchat'>
                <div className='innerchatusertext'>
                {msg.user.username?msg.user.username[0].toUpperCase():""}
                </div>
                </div>
                  <div className="black-half"></div>
                  <div className="white-half"></div>
              </div> 
              <div className='outerchatmessage'>
              <div className='chatuser'>{msg.user.username}</div> 
              <div className='chatmessage'>{msg.message}</div> 
              </div>
            </div>
          }).reverse():[] ;
           return <div id='chat'>
           {messages}
           <div id='chatbox'>
           <input
              className="submitChatMessage"
              id={this.props.id}
              placeholder="Chat"
              onKeyDown={this.onKeyDown}
            />
           </div>
           </div>
    }
});
  export default ChatView;

