import Reflux from 'reflux';
import actions from './Actions';
import {Transport} from './Transport'
import {List} from 'immutable'

	const Board = Reflux.createStore({
		listenables: [actions],
		colors:{
			EMPTY:0,
			WHITE:1,
			BLACK:2
		},
	   	init : function(){
	    this.current_color =this.colors.BLACK;
	    //a 2D array representing all the stones currently on the board. board[ring][hour]
	    //0th index is ring 1, the most inner ring. index 6 the most outer ring. 0th hour is 1 oclock, 11 is 12 oclock
	    this.board = this.create_board();
	    this.gameState= 'place';
	    this.sliding= undefined;
	    this.last_move_passed = false;
	    this.in_atari = false;
	    this.attempted_suicide = false;
	    this.history=List();	
	    this.gameid=-1;
    	this.onChanges = [];
    	this.socket = new Transport();
    	this.moves = []; 
    	this.listenTo(actions.placeStone,this.play.bind(this));
    	this.socket.on('game', this.update.bind(this) ); 
    	//subscribed via this.socket.get

	},
	retrieveMove:function(move)
	{
		var self=this;
		this.socket.get('/game/'+this.gameid+"/moves?sort=createdAt%20DESC&limit=1", function (moves) {
    		//sets the board array based on move history
    		self.add(moves[0]);
    		
      });
	},

	retrieveHistory:function(game)
	{
				this.gameid=game.id;
				this.socket.get('/game/'+this.gameid);
   	 			
  		 		this.set(game.history);
	},

	locationToNotation:function(location)
    {
		return  String.fromCharCode(64 + location.ring  ) +location.hour;
    },

	notationToLocation :function(notation)
	{
	    return { ring: notation.charCodeAt(0)-64  , hour: parseInt(notation.substring(1)) }   
	},
	//init board array
	create_board : function() {
	    var m = [];
	    //Remember hours and rings start 1 not 0 tho
	    for (var i=0; i<6; i++) {
	        m[i] = [];
	        for (var j = 0; j < 12; j++) {
	            m[i][j] = this.colors.EMPTY;
	        }
	    }
	    return m;
	},

	
	pass :function() {
		var data= {game:this.gameid,place:'pass',color:this.current_color,gameState:this.gameState} ;

	    if(this.gameState=='sliding'||this.gameState=='slide') {
			data['from']='pass';	
    	}
    	this.socket.post("/move",data);

	},

	end_game: function() {
	    console.log("GAME OVER");
	},

	//adds move to move history
	add : function(move)
	{
		this.history=this.history.unshift(move);
		this.set();
	},
	//populates the board array based on move history
	set: function(history)
	{
		if(typeof history === 'string' || history instanceof String){
			var moves=[];
			var regex=/#([A-Z][0-9]+|pass)([!|@])([A-Z][0-9]+|pass)|([A-Z][0-9]+|pass)([!|@])/g;
			var move=[];
			while (move = regex.exec(history)) {
				var move_data={};
				if(!move[1]&&move[4]){
					move_data={
						place:move[4],
						color:move[5]=="!"?1:2
					}
				}else if(move[1])
				{
					move_data={
						place:move[1],
						color:move[2]=="!"?1:2,
						from:move[3]
					}
				}
				moves.unshift(move_data);
			}
			this.history=List(moves);	
		}	
		var self=this;
		this.board=this.history.reverse().reduce(function(board,item){
			if(item.place=='pass')return board;
			var location=self.notationToLocation(item.place);
			if(location.hour>0&&location.hour<13&&location.ring>0&&location.ring<7){
				board[location.ring-1][location.hour-1]=parseInt(item.color);
	    	}
	    	if(item.from){
	    		var fromlocation=self.notationToLocation(item.from);
	    		board[fromlocation.ring-1][fromlocation.hour-1]=0;
	    	}
	    	return board;
    	},this.create_board());
    	if(this.history.count()>0)this.updategameState(this.history.get(0));
    	this.triggerBoard();
	},
	//move the game along based off lastest move recieved from server
	updategameState: function(lastmove)
	{
		if(lastmove.from)
		{
			this.gameState='place';
			this.current_color = 
	        lastmove.color == this.colors.BLACK ? this.colors.WHITE : this.colors.BLACK;
	        this.sliding=undefined;
		}else 
		{
			this.gameState='sliding';
		}
	},

	update: function(snapshot)
	{
		actions.retrieveMove();
	},
	//this triggers a refresh and sends all the info needed for the 
    //boardview and any other react elements listening.
	triggerBoard: function()
	{
		this.trigger({
    		  sliding:this.sliding,
			  history:this.history, 
			  board:this.board,
			  current_color:this.current_color,
			  gameState:this.gameState
    		});
	},
	//place or move stone 
	play:  function(to) {
		if(this.gameState == 'sliding' || this.gameState == 'slide' ){
			if(this.board[to.ring-1][to.hour-1]==this.current_color ){
				this.sliding=to;
				this.gameState = 'slide';
				this.triggerBoard();
				return true;
			}
		}

		if (this.board[to.ring-1][to.hour-1] != this.colors.EMPTY) {
	        return false;
		}

		var data= {game:this.gameid,place:this.locationToNotation(to),color:this.current_color,gameState:this.gameState} ;
	    if(this.sliding) {
			data['from']=this.locationToNotation(this.sliding);	
    	}
    	var self=this;
    	this.socket.post("/move",data);
    	return true;
	}
	});
	export default Board;