import Reflux from 'reflux';  
import {List} from 'immutable'
import {Transport} from './Transport'
import TimerActions from './TimerActions';
const TimerStore = Reflux.createStore({
	listenables: [TimerActions],

	init: function(){
		this.socket = new Transport();
		this.timer=0;
		this.gameid=-1;
		this.socket.on('game', this.update.bind(this) );
	},
	retrieveHistory:function(game){
		this.gameid=game.id;
		this.socket.get('/game/'+this.gameid);	
	},
    update:function(snapshot){
		   if(snapshot.verb=='updated'&&snapshot.data.action=='timer'){
           		this.timer=snapshot.data.timer; 
           		this.triggerBoard();      
        }
    },
    triggerBoard: function()
	{	
		this.trigger({
               timer:this.timer
    	});
	}
});
export default TimerStore;