import Reflux from 'reflux';
import BoardActions from './BoardActions';
import {Transport} from './Transport'
import Validators from './Validators'
import {List} from 'immutable'

	const Board = Reflux.createStore({
		listenables: [BoardActions],
		colors:{
			EMPTY:0,
			WHITE:1,
			BLACK:2
		},
	   	init : function(){
	    this.turn =this.colors.BLACK;
	   
	    this.whitescore=0;
        this.blackscore=0;
        this.blackcaptures=0;
        this.whitecaptures=0;
        this.captured=[];
	    this.sliding= undefined;
        this.currentUser={};
	    this.history=List();	
        this.messages=List();
	    this.gameid=-1;
    	this.onChanges = [];
        this.whiteSocket='';
        this.blackAcceptScore=false;
        this.whiteAcceptScore=false;
        this.blackSocket='';    
    	this.socket = new Transport();
    	this.moves = []; 
    	this.listenTo(BoardActions.placeStone,this.play.bind(this));
    	this.socket.on('game', this.update.bind(this) ); 
        var countdown=1000;
        var self=this;
	},
    
    begin:function(options)
    {         
        this.gameState='joining';
        var self=this;
        io.socket.put('/game/'+this.gameid, { state: 'playing',timer:options.timer }, function (resData) {      
                 self.triggerBoard();
        });  
    },
    joinGame: function(color)
    {
        this.socket.post('/game/'+this.gameid+"/join/"+color)
    },
	retrieveMove:function(move)
	{
		var self=this;
		this.socket.get('/game/'+this.gameid+"/moves?sort=createdAt%20DESC&limit=1", function (moves) {
    		//sets the board array based on move history

    		self.add(moves[0]);	
      });
	},
	retrieveHistory:function(game,user,messages)
	{
        if(game.state=='starting'||game.state=='ending') this.gameState= game.state;
        this.gameid=game.id;
        this.currentUser=user;
        this.whiteUser=game.white || game.white;
        this.blackUser=game.black || game.black;
    	this.socket.get('/game/'+this.gameid);	
       
        this.messages=List(messages);
     	this.set(game.history);

        if(game.state=='ending'||game.state=='final')
        {
            this.fillTerritories([game.blackTerritories,game.whiteTerritories]);
        }
	},
	locationToNotation:function(location)
    {
		return  String.fromCharCode(64 + location.ring  ) +location.hour;
    },
    placeable:function(move){
        return validators.placeable(move,this.board,this.whiteUser.id==this.currentUser.id ,this.blackUser.id==this.currentUser.id );
    },
	notationToLocation :function(notation)
	{
	    return { ring: notation.charCodeAt(0)-64  , hour: parseInt(notation.substring(1)) }   
	},
	//init board array
	create_board : function() {
	    var m = [];
	    //hours and rings start 1 not 0 tho
	    for (var i=0; i<6; i++) {
	        m[i] = [];
	        for (var j = 0; j < 12; j++) {
	            m[i][j] = this.colors.EMPTY;
	        }
	    }
	    return m;
	},
	pass :function() {
        var cv=this.consecutivePasses=this.history.slice(0, 3).every(function(move){
            return move.place=='pass';
        });
        if(this.gameState=='notyourturn'){
            return;
        }
		var data= {game:this.gameid,place:'pass',color:this.turn,gameState:this.gameState} ;
	    if(this.gameState=='sliding'||this.gameState=='slide') {
			data['from']='pass';	
    	}
        if(cv && this.turn==1&&(this.gameState=='sliding'||this.gameState=='slide')) {
            this.endGame();
        } else {
    	   this.socket.post("/move",data);
        }
	},
	endGame: function() {

	    console.log("GAME OVER");
        this.socket.post('/game/'+this.gameid+"/endGame/")     
	},
    //Deletes and scores captured pieces. location is newly added piece to the board.
    kill: function(board,newPiece)
    {
        var self=this;
        this.emanateKill(newPiece).forEach(function(kill){      
                var positionColor= board[kill.ring-1][kill.hour-1];
                if(newPiece.color==2&&positionColor==1){
                    self.blackscore++
                    board[kill.ring-1][kill.hour-1]=0;
                }
                else if(newPiece.color==1&&positionColor==2) {
                    self.whitescore++;
                    board[kill.ring-1][kill.hour-1]=0;
                }
            });
    },
	//adds move to move history
	add : function(move)
	{
      this.history=this.history.unshift(move);
        if(move.place!='pass'){
<<<<<<< Updated upstream
          var moveLocation=this.notationToLocation(move.place);
=======
            var moveLocation=this.notationToLocation(move.place);
>>>>>>> Stashed changes
           this.board[moveLocation.ring-1][moveLocation.hour-1]=move.color;
            if(move.from){
                var fromLocation=this.notationToLocation(move.from);
                this.board[fromLocation.ring-1][fromLocation.hour-1]=0;
            } 
            moveLocation.color=move.color;
            var self=this;
            console.log(move);
            this.kill(this.board,moveLocation);
        }
        this.triggerBoard();
	},

<<<<<<< Updated upstream
    //

=======
>>>>>>> Stashed changes
	//populates the board array based on move history string from server
	set: function(history)
	{
        this.whitescore=0;
        this.blackscore=0;
		var moves=[];
		var regex=/#([A-Z][0-9]+|pass)([!|@])([A-Z][0-9]+|pass)|([A-Z][0-9]+|pass)([!|@])/g;
		var move=[];
		while (move = regex.exec(history)) {
			var move_data={};
			if(!move[1]&&move[4]){
				move_data={ place:move[4], color:move[5]=="!"?1:2 }
			}else if(move[1])
			{
				move_data={ place:move[1],color:move[2]=="!"?1:2,from:move[3] }
			}
			moves.unshift(move_data);
		}
        this.history=List(moves);	
        if(this.history.size!=0)this.turn=this.history.first().color;
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
            self.board=board;
            location.color=item.color;

            self.kill(self.board,location);
            /*self.emanateKill(location).forEach(function(kill){
                var positionColor= board[kill.ring-1][kill.hour-1];
                if(item.color==2&&positionColor==1)self.blackscore++
                else if(item.color==2&&positionColor==2) self.whitescore++;
                board[kill.ring-1][kill.hour-1]=0;
            });*/
            return board;
        },this.create_board());    
        this.triggerBoard();
	},
	//move the game along based off lastest move recieved from server
	updategameState: function()
<<<<<<< Updated upstream
	{
        if(this.gameState=='starting'||this.gameState=='ending'||this.gameState=='final')return;
=======
    {
        if(this.gameState=='starting')return;
>>>>>>> Stashed changes
        var lastmove=this.history.get(0) || this.history.count()>0;
        var nextcolor=2;
        if(lastmove){
            nextcolor=lastmove.color;
        }
        if(lastmove&&lastmove.from)nextcolor = lastmove.color==1 ? 2 : 1;
       
        if(this.currentUser&& 
            ((nextcolor==1&&this.whiteUser.id==this.currentUser.id ) ||
             (nextcolor==2&&this.blackUser.id==this.currentUser.id ) )) {     
            if(lastmove){
                if(lastmove.from) {
                    this.gameState='place';
                    this.turn = nextcolor = lastmove.color==1 ? 2 : 1;
                    this.sliding=undefined;
                }else if(this.gameState!='slide') {
                    this.gameState='sliding';
                }
            }else{
               this.gameState='place';
            }
        }else if(this.gameState!='joining'){
            this.gameState='notyourturn';
            this.sliding=undefined;
        }
<<<<<<< Updated upstream
	},
    acceptScore:function()
    {
        this.socket.post('/game/'+this.gameid+"/acceptScore/");
=======
    },

    playMove:function(play)
    {

        console.log("PLAY THIS SON",play);
       // this.add(play);
>>>>>>> Stashed changes
    },
    submitChatMessage:function(msg)
    {
        this.socket.post('/game/'+this.gameid+"/submitChatMessage/"+msg)
    },
	update: function(snapshot)
	{
        
       if(snapshot.verb=='addedTo'&&snapshot.attribute=='moves') {
          BoardActions.retrieveMove();
        }
         if(snapshot.verb=='updated'&&snapshot.data.action=='chatMessageSubmited'){
           this.messages=this.messages.push(snapshot.data);
           this.triggerBoard();      
        }
        if(snapshot.verb=='updated'&&snapshot.data.action=='timer'){
           this.timer=snapshot.data.timer;
           
           this.triggerBoard();      
        }
        if(snapshot.verb=='updated'&&snapshot.data.action=='userJoined'){
           this[ snapshot.data.color+'User']=snapshot.data.joinedUser;
           this.triggerBoard();      
        }
        if(snapshot.verb=='updated'&&snapshot.data.action=='ending')
        {
           
            console.log(snapshot.data);
            var self=this;
            this.gameState='ending';
            this.fillTerritories(snapshot.data.Territories);
            //BoardActions.confirmTerritories();   

            //this.socket.post("/move",data);
        }
   
        if(snapshot.verb=='updated'&&snapshot.data.action=='updateTerritories')
        {
             this.fillTerritories([snapshot.data.blackTerritories,snapshot.data.whiteTerritories]);
        }

        if(snapshot.verb=='updated'&&snapshot.data.action=='acceptScore')
        {
            this.gameState=snapshot.data.state;

            if(snapshot.data.blackAcceptScore)this.blackAcceptScore=true;
            if(snapshot.data.whiteAcceptScore)this.whiteAcceptScore=true;
            this.triggerBoard();

        }
	},
    clearTerritories:function()
    {
        for (var i=0; i<this.board.length; i++) {
            for (var j=0; j<this.board[i].length; j++) {
                if (this.board[i][j] === 3 || this.board[i][j] === 4) {
                   this.board[i][j]=0;
                }
               
        }
    }
    },
    fillTerritories:function(fillTerritories)
    {
        var self=this;
        console.log(fillTerritories);
        if(!fillTerritories)return;
        this.clearTerritories();

        this.blackscore=this.blackcaptures;
        this.whitescore=this.whitecaptures;
        fillTerritories.forEach(function(terrorityGroup,color){
             console.log(terrorityGroup);
               if(!terrorityGroup)return;
                terrorityGroup.substring(1).split("!").forEach(function(locnotation){
                    var loc=self.notationToLocation(locnotation);
                    console.log(loc);
                    if(loc.ring&&loc.hour){
                         console.log(color);
                        if(color==0)self.board[loc.ring-1][loc.hour-1]=4;
                        if(color==1)self.board[loc.ring-1][loc.hour-1]=3;
                        if(color==0)self.blackscore++;
                        else if(color==1)self.whitescore++;
                     }
                })
            });
        this.triggerBoard();
    },
	//this triggers a refresh and sends all the info needed for the 
    //boardview and any other react elements listening.
	triggerBoard: function()
	{
        this.updategameState();
		this.trigger({
            sliding:this.sliding,
            history:this.history, 
            board:this.board,
            turn:this.turn,
            gameState:this.gameState,
            whitescore:this.whitescore,
            blackscore:this.blackscore,
            blackUser:this.blackUser,
            blackAcceptScore:this.blackAcceptScore,
            whiteAcceptScore:this.whiteAcceptScore,
            whiteUser:this.whiteUser,
            messages:this.messages,
            timer:this.timer
    	});
	},
	//place or move stone 
	play:  function(to) {
<<<<<<< Updated upstream
        console.log(this.gameState);
        if(this.gameState=='ending'&&this.board[to.ring-1][to.hour-1] !=1&&this.board[to.ring-1][to.hour-1] !=2)
        {
            if(this.board[to.ring-1][to.hour-1]==0)
            {
                this.board[to.ring-1][to.hour-1]=2;
            }
            this.board[to.ring-1][to.hour-1]++;
            if(this.board[to.ring-1][to.hour-1]==5)this.board[to.ring-1][to.hour-1]=0;
            var result=this.calculateScore();
            console.log('/game/'+this.gameid+"/updateTerritories/"+result[0]+"/"+result[1]);
            this.socket.post('/game/'+this.gameid+"/updateTerritories/"+result[0]+"/"+result[1]);     
            this.triggerBoard();
            return true;
        }
        this.consecutivePasses=0;
		if(this.gameState == 'sliding' || this.gameState == 'slide' ){
			if(this.board[to.ring-1][to.hour-1]==this.turn ){
				this.sliding=to;   
				this.gameState = 'slide';
=======
        
         this.consecutivePasses=0;
        if(this.gameState == 'sliding' || this.gameState == 'slide' ){
            if(this.board[to.ring-1][to.hour-1]==this.turn ){
                this.sliding=to;   
                this.gameState = 'slide';
>>>>>>> Stashed changes
                this.triggerBoard();
                return true;
            }
        }
        if (this.board[to.ring-1][to.hour-1] != this.colors.EMPTY) {
            return false;
        }
        var data= {game:this.gameid,place:this.locationToNotation(to),color:this.turn,gameState:this.gameState} ;
        if(this.sliding) {
            data['from']=this.locationToNotation(this.sliding); 
        }
        to.color=this.turn;
        this.board[to.ring-1][to.hour-1]=to.color;
        var enemyGroup = this.getGroup(to);
      
        var atari = this.countLiberties(enemyGroup);
       
        if (atari===0) {
            this.board[to.ring-1][to.hour-1]=0;
           console.log("OH HELL NO");
           return false;  
        }else{
           this.socket.post("/move",data);
           return true;
        }

        

	},
    formatCaptured:function(killedGroup) {
        var self=this;
        return killedGroup.reduce(function(string,capture){
           return string+capture.color+self.locationToNotation(capture);
        },'');
    },

	//Terrority counter functions
	//Group Library
    
	calcoffset :function(move,n,hof2) {
            var mn=move.ring+n;
            var hoffset=hof2||0; 
            if(!hof2)hof2=0;
            if(mn<1)
            {
                mn=1;
                hoffset+=4;
            }else  if(mn>6)
            {
                mn=6;
                hoffset+=12;
            }

            if(move.ring==1&&n==-1&&hof2!=-1&&hof2!=1)hoffset+=3;      
            if(move.hour+hoffset==-1)hoffset+=12;
            if(hoffset==-1)hoffset=11; 

            var ring=mn;
          //   console.log(n,ring,hof2);
            if(n==1&&move.ring==6&&hof2==0)hoffset+=1;
            var hour=(((move.hour-1+hoffset))%12)+1;
           // console.log(move,ring,hour);
            return  {ring:ring,hour:hour,color:Number(this.board[ring-1][hour-1])};
    },
    getAdjacent: function(move){

        var movesAvaibletoSlide=[];
        var movesAvaibletoSlide=[
           this.calcoffset(move,1),     
            this.calcoffset(move,-1),
            this.calcoffset(move,1,-1),   
            this.calcoffset(move,-1,1)
        ];

        return movesAvaibletoSlide;            
    },
    calculateScore:function()
    {
        this.blackscore=this.blackcaptures;
        this.whitescore=this.whitecaptures;
        var blackTerritories='@';
        var whiteTerritories='@';
        for (var i=0; i<this.board.length; i++) {
            for (var j=0; j<this.board[i].length; j++) {
                if (this.board[i][j] === 3) {
                    this.whitescore++;
                    whiteTerritories+=this.locationToNotation({ring:i+1,hour:j+1})+"!";
                }
                if (this.board[i][j] === 4) {
                    this.blackscore++;
                    blackTerritories+=this.locationToNotation({ring:i+1,hour:j+1})+"!";
                }
        }
    }
        if(blackTerritories.length!=1){
            blackTerritories=blackTerritories.slice(0, - 1);
        }
         if(whiteTerritories.length!=1){
            whiteTerritories=whiteTerritories.slice(0, - 1);
        }
        return [blackTerritories,whiteTerritories];
    },
	getEmptyGroup : function (target, group) {
        if (group === undefined) {
            var group = [[],[],[]];
        } // create our container if we're at the top of the descent path
        if(target.color==undefined||target.ring>6){
            console.log('eh');
           // target= {ring:target.ring-1,hour:target.hour-1,color:this.board[target.ring-1][target.hour-1]};
        }
        if (target.color==0) {
            group[0].push(target); // add the target in question.
            var buddies = this.getAdjacent(target);
            var self=this;
            buddies.forEach(function(location,i){ 
                var notInGroup = true;
                for (var j=0; j<group[0].length;j++) {
                   // console.log(location,group[0][j]);
                    if (location.ring === group[0][j].ring && location.hour === group[0][j].hour) {

                        notInGroup = false;
                    }
                }
                if (notInGroup === true) {
                    self.getEmptyGroup(location,group);
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
        var blackScore = this.blackscore;
        var whiteScore = this.whitescore;

        var groups = Array();
        var empties = Array();
       for (var i=0; i<this.board.length; i++) {
        for (var j=0; j<this.board[i].length; j++) {
            if (this.board[i][j] === 0) {
                empties.push({ring:i,hour:j,color:this.board[i][j]});
                empties[empties.length-1].grouped = false;
            }
        }
    }
        
         
        // take each empty space, get the group it's in
        for (var i=0; i<empties.length; i++) {
            if(!empties[i].grouped) {
                groups.push(this.getEmptyGroup(empties[i]));
                var empscg=true;
                for (j=0; j<groups[groups.length-1][0].length; j++) {
                    // subtract all empty spaces in that group from consideration

                    for (var m=0; m<empties.length; m++) {
                        if (groups[groups.length-1][0][j] === empties[m]) {
                            console.log('yo');

                            empties[m].grouped = true;
                        }
                    }
                }
            }
        }
        console.log(groups);

        //TODO: find bug that causes this
       
        // determine which ones are territory and add to total
        var blackTerritories='@';
        var whiteTerritories='@';
        var self=this;
        for (var i=0; i< groups.length; i++) {
            if (groups[i][1].length>1 && groups[i][2].length===0) { //black group
                
                groups[i][0].forEach(function(loc){
                    if( self.board[loc.ring-1][loc.hour-1]==0){
                      //  self.board[loc.ring-1][loc.hour-1]=4;
                        blackScore++;
                        blackTerritories+=self.locationToNotation(loc)+"!";
                    }
                    
                });
               console.log(groups[i][0]);
            } else if (groups[i][2].length>1 && groups[i][1].length ===0 ) {
                //whiteScore += groups[i][0].length;
                 groups[i][0].forEach(function(loc){
                     if( self.board[loc.ring-1][loc.hour-1]==0){
                       // self.board[loc.ring-1][loc.hour-1]=3;
                        whiteScore++;
                        whiteTerritories+=self.locationToNotation(loc)+"!";
                    }
                });
                console.log(groups[i][0]);
            
        }
    }
        this.triggerBoard();
        console.log("black score is: " + blackScore);
        console.log("white score is: " + whiteScore);
        return [blackTerritories.slice(0, - 1),whiteTerritories.slice(0, - 1)];

       // alert("Black Score is: " + blackScore + '\n' + "White Score is: " + whiteScore);
        // bob's your uncle
    },
    emanateKill : function(piece) {
        if(piece=='pass')return;
        piece.color=parseInt(piece.color);
        var self=this;
        var killedgroup=[];
        this.getAdjacent(piece).forEach(function(location){ 
            var touching={};
            touching.color=self.board[location.ring-1][location.hour-1];
            touching.ring=location.ring;
            touching.hour=location.hour;
           




            if (touching.color != piece.color) {
                var enemyGroup = self.getGroup(touching);
                var atari = self.countLiberties(enemyGroup);

                if (atari===0) {
                    killedgroup=killedgroup.concat(enemyGroup);
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
                    if (JSON.stringify(libArray[m]) === JSON.stringify(adjacencies[j])) {
                        //libArray[m] === adjacencies[j]) {
                        notInGroup = false;
                    }
                }
              //    console.log("lb",libArray)
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