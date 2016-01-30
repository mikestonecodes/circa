import Reflux from 'reflux';  
import {List} from 'immutable'
import {Transport} from './Transport'
import ChatActions from './ChatActions';
const ChatStore = Reflux.createStore({
	listenables: [ChatActions],
	
	init: function(){
		this.socket = new Transport();
		this.messages=List();
		this.gameid=-1;
		this.unread=0;
		this.socket.on('game', this.update.bind(this) );
	},
	retrieveHistory:function(game,messages){
		console.log(messages);
		this.gameid=game.id;
		this.socket.get('/game/'+this.gameid);	
		this.messages=List(messages);
		this.triggerBoard();
	},
	submitChatMessage:function(msg)
    {
        this.socket.post('/game/'+this.gameid+"/submitChatMessage/"+msg)
    },
    clearUnread:function(msg)
    {
      this.unread=0;
      this.triggerBoard();     
    },
    update:function(snapshot){
		if(snapshot.verb=='updated'&&snapshot.data.action=='chatMessageSubmited'){
			this.messages=this.messages.push(snapshot.data);
			this.unread++;
			this.triggerBoard();      
		}
    },
    triggerBoard: function()
	{	
		this.trigger({
			unread:this.unread,
            messages:this.messages
    	});
	}
});
export default ChatStore;