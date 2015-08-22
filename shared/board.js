import Reflux from 'reflux';
import BoardActions from './BoardActions';
import {Transport} from './Transport'
import {List} from 'immutable'

	const Board = Reflux.createStore({
		listenables: [BoardActions],
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
	    this.whitescore=0;
        this.captured=[];
	    this.blackscore=0;
	    this.sliding= undefined;
	    this.last_move_passed = false;
	    this.in_atari = false;
	    this.attempted_suicide = false;
	    this.history=List();	
	    this.gameid=-1;
    	this.onChanges = [];
    	this.socket = new Transport();
    	this.moves = []; 
    	this.listenTo(BoardActions.placeStone,this.play.bind(this));
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
        this.whitescore=0;
        this.blackscore=0;
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

            self.board=board;

            location.color=item.color;
            var kills=self.emanateKill(location);

            kills.forEach(function(kill){
               board[kill.ring-1][kill.hour-1]=0;
               if(item.color==2)self.blackscore++
               else self.whitescore++;
            });
            
	    	return board;
    	},this.create_board());
        

      
    	if(this.history.count()>0){


            var lastmove=this.history.get(0);
            this.updategameState(lastmove);
            /**/
        }
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
        if(snapshot.verb=='addedTo'&&snapshot.attribute=='moves')
		BoardActions.retrieveMove();
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
			  gameState:this.gameState,
              whitescore:this.whitescore,
              blackscore:this.blackscore
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

          
    
            to.color=this.current_color;
            var enemyGroup = this.getGroup(to);
            var atari = this.countLiberties(enemyGroup);
         
            if (atari===0) {
               console.log("OH HELL NO");
               return false;  
            }
      
    	
    	this.socket.post("/move",data);



   
    	return true;
	},
    formatCaptured:function(killedGroup)
    {
        var self=this;
        return killedGroup.reduce(function(string,capture){
           return string+capture.color+self.locationToNotation(capture);
        },'');
    },

	//Terrority counter functions

	//Group Library
	calcoffset :function(move,n,hof2)
        {

            var mn=move.ring+n;
            var hoffset=hof2||0; 
            if(mn<1)
            {
                mn=1;
                hoffset+=4;
            }else  if(mn>5)
            {
                mn=5;
                hoffset+=12;
            }
            if(move.ring==1&&n==-1&&hof2!=-1&&hof2!=1)hoffset+=3;      
            if(move.hour+hoffset==-1)hoffset+=12;
            if(hoffset==-1)hoffset=11; 
            var ring=mn;
            var hour=(((move.hour-1+hoffset))%12)+1
            return  {ring:ring,hour:hour,color:this.board[ring-1][hour-1]};
        },
        getAdjacent: function(move){
        var movesAvaibletoSlide=[];
        var movesAvaibletoSlide=[
            this.calcoffset(move,1),     
            this.calcoffset(move,-1),
            this.calcoffset(move,1,-1),   
            this.calcoffset(move,-1,1)
        ];
        if(move.ring==6) delete movesAvaibletoSlide[2];
        if(move.ring==6) delete movesAvaibletoSlide[1];
        return movesAvaibletoSlide;            
    },

	getEmptyGroup : function (target, group) {
    if (group === undefined) {
        var group = [[],[],[]];
    } // create our container if we're at the top of the descent path
    if(target.color=== undefined&&target.ring)target+= this.board[target.ring-1][target.hour-1];
    if (target.color==0) {
        group[0].push(target); // add the target in question.
        var buddies = this.getAdjacent(target);


        buddies.forEach(function(location){ 
                         var notInGroup = true;
            for (var j=0; j<group[0].length;j++) {
                if (buddies[i] === group[0][j]) {
                    notInGroup = false;
                }
            }
            if (notInGroup === true) {
                this.getEmptyGroup(location,group);
            }
            
                    
                           
                           
           });

     
    }
    else if (target.color === 2) {
        var notInGroup = true;
        for (var i=0; i<group[1].length; i++) {
            if (target === group[1][i]) {
                notInGroup = false;
            }
        }
        if (notInGroup) {
            group[1].push(this.board[target.ring-1][target.hour-1]);
        }
    }
    else if (target.color === 1) {
        var notInGroup = true;
        for (var i=0; i<group[2].length; i++) {
            if (target === group[2][i]) {
                notInGroup = false;
            }
        }
        if (notInGroup) {
            group[2].push(target);
        }
    }
    return group;
},

calculateWin: function() {
    // start with number of captures
    var blackScore = gameState.blackCaptures;
    var whiteScore = gameState.whiteCaptures;

    // get all empty groups
    // first get all empty spaces
    var empties =  moves.reduce(function(start,move){
        move.grouped=false;
        if(move.color==0)start.push(move);

        return move;   
    },[]);;

    var groups = Array();
     
    // take each empty space, get the group it's in
    for (var i=0; i<empties.length; i++) {
        if(!empties[i].grouped) {
            groups.push(this.getEmptyGroup(empties[i]));
            for (j=0; j<groups[groups.length-1][0].length; j++) {
                // subtract all empty spaces in that group from consideration
                for (var m=0; m<empties.length; m++) {
                    if (groups[groups.length-1][0][j] === empties[m]) {
                        empties[m].grouped = true;
                    }
                }
            }
        }
    }

    // remove the grouped property entirely 
    for (var i=0; i<moves.length; i++) {
        for (var j=0; j<this.board[i].length; j++) {
            delete this.board[i].grouped;
        }
    }
    
    // determine which ones are territory and add to total
    for (var i=0; i< groups.length; i++) {
        if (groups[i][1].length>1 && groups[i][2].length===0) { //black group
            blackScore += groups[i][0].length;
        } else if (groups[i][2].length>1 && groups[i][1].length ===0 ) {
            whiteScore += groups[i][0].length;
        }
    }
    console.log("black score is: " + blackScore);
    console.log("white score is: " + whiteScore);
    alert("Black Score is: " + blackScore + '\n' + "White Score is: " + whiteScore);
    // bob's your uncle

},

killGroup : function(enemyGroup) {
    console.log("Bang! You're dead");
    if(enemyGroup[0].color===2){
        this.whitescore += enemyGroup.length;
        console.log("White has captured " + this.whitescore + " stones so far");
    } else {
        this.blackscore += enemyGroup.length;
        console.log("Black has captured " + this.blackscore + " stones so far");
    }
        console.log("destroying:",enemyGroup);
        var self=this;
          enemyGroup.forEach(function(curstone){ 
          		//self.board[curstone.ring-1][curstone.hour-1]=enemyGroup[0].color===2?3:4;   
             //   curstone.color=enemyGroup[0].color===2?1:2;
              //  self.captured.push(curstone);          
           });
},
emanateKill : function(piece) {
                piece.color=parseInt(piece.color);
            if(piece=='pass')return;
            piece.color=parseInt(piece.color);
 	var self=this;
    var killedgroup=[];
     this.getAdjacent(piece).forEach(function(location){ 
     	var touching={};
           touching.color=self.board[location.ring-1][location.hour-1];
           touching.ring=location.ring;
           touching.hour=location.hour;
      
        if (touching.color !== piece.color) {
       
            var enemyGroup = self.getGroup(touching);
            var atari = self.countLiberties(enemyGroup);
         
            if (atari===0) {
               
                killedgroup=killedgroup.concat(enemyGroup);
                console.log(killedgroup);
            }
        }   
      });
 
    return killedgroup;
  },

getAdjacentLiberties : function(piece) { // takes a piece

    var buddies = this.getAdjacent(piece);
    var emptyTargets = Array();
         var self=this;
         buddies.forEach(function(location){ 
                        if (! self.board[location.ring-1][location.hour-1]!=0) {
            emptyTargets.push(location);  
            }                       
                        });         
    
    return emptyTargets; // returns TARGETS
},

countLiberties : function(group) {
    var libArray = Array();
    for (var i=0; i<group.length; i++) {
        var adjacencies = this.getAdjacentLiberties(group[i]);
        for (var j=0; j<adjacencies.length; j++) {
            var notInGroup = true;
            for (var m=0; m<libArray.length;m++) {
                if (libArray[m] === adjacencies[j]) {
                    notInGroup = false;
                }
            }
            if (notInGroup) {
                libArray.push(adjacencies[j]);
            }
        }
    }
    if (libArray.length >=1) {
            return libArray.length
        } else {
            return 0;
        }
},


 getGroup : function (piece, group, color) {
    
    if (group === undefined) {
        var group = Array();
    } // create our container if we're at the top of the descent path
    if (color === undefined) {
        var color = piece.color;
    }
 
    if (color === piece.color) {
        group.push(piece); // add the piece in question.
        var buddies = this.getAdjacent(piece); // get all friends
       
        for (var i=0; i<buddies.length;i++) {
            var notInGroup = true;
            for (var j=0; j<group.length;j++) {
         
                if ( JSON.stringify(buddies[i]) === JSON.stringify(group[j]) ) {
                    notInGroup = false;
                }
            }
            if (notInGroup === true) {
                this.getGroup(buddies[i],group,color);
            }
        } 
    }
    return group;
}

});


	export default Board;