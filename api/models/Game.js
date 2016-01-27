import board from '../../shared/board';
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
    blackScore:
    {
       type:'int',
       defaultsTo :0
    },whiteScore:
    {
       type:'int',
       defaultsTo :0
    },
    winner:{
      model:'user',
      defaultsTo : {}
    },
    creator:{
      model:'user',
      defaultsTo : {}
    },
    state:{
      type:'string',
      defaultsTo:'starting'
    },
  ranked:{
    type:'boolean',
    defaultsTo:true
  },
  ispublic:{
    type:'boolean',
    defaultsTo:true
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
  },

 },endGame:function(options,cb)
  {
     Game.findOne(options.id).exec(function(err,game){
      if (err) return cb(err);
      Game.publishEndGame(game,cb)
     });
  },publishEndGame:function(game,cb){
    if(game.state=='final')cb(new Error("Game done already"));
      game.state='ending'    
       board.set(game.history);
        var result=board.calculateWin();
          console.log("pendgame",result);
       game.blackTerritories=result[0];
       game.whiteTerritories=result[1]; 
       game.blackScore=result[2];
       game.whiteScore=result[3];

      

      Game.publishUpdate(game.id, {
        action: 'ending',
        Territories:result
      });
      game.save(cb);
  } 
};
