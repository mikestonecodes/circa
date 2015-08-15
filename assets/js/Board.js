define(['reflux','app/Actions'], function (Reflux,Actions) {
	
	var Board = Reflux.createStore({
		listenables: [Actions],
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
	    this.history= [];
	    this.gameid=-1;
    	this.onChanges = [];
    	this.moves = []; 
    	this.listenTo(Actions.placeStone,this.play.bind(this));
    	//subscribed via io.socket.get
    	io.socket.on('game', this.update.bind(this) ); 
	},
	retrieveMove:function(move)
	{
		var self=this;
		io.socket.get('/game/'+this.gameid+"/moves?sort=createdAt%20DESC&limit=1", function (moves) {
    		//sets the board array based on move history
    		self.add(moves[0]);
    		
      });
	},

	retrieveHistory:function(gameid)
	{

  		var self=this;
  		if(gameid)this.gameid=gameid;
  		console.log("here");
  		//retrieves the entire state of the current game and subscribes to current game's socket room by default 
  		io.socket.get('/game/'+this.gameid, function (game) {
    		//sets the board array based on move history
    		console.log(game.history);;
    		self.set(game.history);
    		
      });
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
	    if (this.last_move_passed) {
	        this.end_game();
	    }
	    this.last_move_passed = true;

	},

	end_game: function() {
	    console.log("GAME OVER");
	},

	//adds move to move history
	add : function(move)
	{
		this.history.push(move);
		this.set(this.history);
	},
	//populates the board array based on move history
	set: function(history)
	{

		if(Array.isArray(history)){
			moves=history;
		}else{
			var regex=/#([A-Z][0-9]+)([!|@])([A-Z][0-9]+)|([A-Z][0-9]+)([!|@])/g;
			var moves=[];
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
				moves.push(move_data);
			}
		}	
		var self=this;
		this.history=moves;	
		this.history.forEach(function(item){
			var location=self.notationToLocation(item.place);
			if(location.hour>0&&location.hour<13&&location.ring>0&&location.ring<7){
				self.board[location.ring-1][location.hour-1]=parseInt(item.color);
	    	}
	    	if(item.from){
	    		var fromlocation=self.notationToLocation(item.from);
	    		self.board[fromlocation.ring-1][fromlocation.hour-1]=0;
	    	}
    	});
    	if(moves.length>0)this.updategameState(moves[moves.length-1]);
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
		console.log(snapshot);
		Actions.retrieveMove();
	},
	//this triggers a refresh and sends all the info needed for the 
    //boardview and any other react elements listening via mixins.
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
    	io.socket.post("/move",data);
    	return true;
	}
	});
	return Board;
});