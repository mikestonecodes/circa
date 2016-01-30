'use strict';
import React from 'react';
import Reflux from 'reflux';
import ChatStore from '../shared/ChatStore';
import ChatActions from '../shared/ChatActions';
import {List} from 'immutable'
  const ChatView = React.createClass({
     mixins: [Reflux.connect(ChatStore, 'chatstore')],
    getInitialState: function(){
      return { 
          chatstore:{},
          "minamized": true
      }
    },
    onKeyDown: function(event) {
      if (event.keyCode === 13) {
        console.log(event.target.value);
        ChatActions.submitChatMessage(event.target.value.toString());
        event.target.value="";
      }
    },
    ChatBarClick:function(event)
    {
        ChatActions.clearUnread();
      this.setState({minamized:!this.state.minamized});
    
    },
    render: function() {
      var newchats='';
      if(this.state.chatstore.unread!=0)
      {
        newchats=<span className='closechat'>{this.state.chatstore.unread}</span>
      }  

          var minclass='minclass'
             var topchatmin='topchatmin'
             var topclose=<span className='closechat'>{newchats}</span>
          if(this.state.minamized==false){
            minclass=''
            topchatmin=''
            topclose=<span className='closechat'>x</span>
          }

          var messages=this.state.chatstore.messages?this.state.chatstore.messages.map(msg => {
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
         <div id='topchat' onClick={this.ChatBarClick} className={topchatmin}>Chat {topclose} </div>
           <div id='chatbox' className={minclass}>
            <div id='chatmessages' >
             
             {messages}
             </div>
        
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

