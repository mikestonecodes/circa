var board = require('../../shared/board.js');
module.exports = {
  attributes: {
  	white:{
    	model:'user',
         defaultsTo : {}
    },
  	black:{
    	model:'user',
         defaultsTo : {}
    }, 
    history: {
      type:'string',
       defaultsTo : ''
    },
    blackAcceptScore:{
      type:'boolean'
    },
    whiteAcceptScore:{
        type:'boolean'
    },
    blackTerritories:{
      type:'string',
      defaultsTo : ''
    },
    whiteTerritories:{
      type:'string',
      defaultsTo : ''
    },
    creator:{
      model:'user',
      defaultsTo : {}
    },
    state:{
      type:'string',
      defaultsTo:'starting'
    },
  timer:{
      type:'int',
       defaultsTo :100
  },  
	moves:{
	    collection: 'Move',
	    via: 'game'
	},
  messages:{
      collection: 'chatMessage',
      via: 'game'
  },
  captures:{
     type:'string',
       defaultsTo : ''
  }

 },endGame:function(options,cb)
  {
     Game.findOne(options.id).exec(function(err,game){
      if (err) return cb(err);
      Game.publishEndGame(game,cb)
     });
  },publishEndGame:function(game,cb){

      game.state='ending'    
       board.set(game.history);
        var result=board.calculateWin();
          console.log("YOOOO",result);
       game.blackTerritories=result[0];
       game.whiteTerritories=result[1];         
      Game.publishUpdate(game.id, {
        action: 'ending',
        Territories:result
      });
      game.save(cb);
  } 
};
