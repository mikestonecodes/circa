module.exports = {

  attributes: {
    place: 'string',
    color: 'string',
    from: 'string',
    expired:'boolean',
    game:{
    	model:'Game'
    }  
  },
  afterCreate: function (values, cb) {
     
      var self=this;

  		Game.findOne(values.game).populate('moves').exec(function (err, game) {
              if (err) return cb(err);
         self.countdown=game.timer;
      clearInterval(self.timer);

       Game.publishUpdate(game.id,{  action: 'timer',timer:self.countdown});

        self.timer=setInterval(function() { 
            self.countdown--;
             if(self.countdown==0)
             {
              clearInterval(game.timer);
              self.countdown=self.timer;
              var color=2;
              var lastmove=values;
              if(game.moves.length>1){
                color=lastmove.color;
                if(game.moves.length%2==0)
                {
                  color=color==1?2:1;
                }
            } 
              var gamestate=lastmove.gamestate=='sliding'?'place':'sliding';
              var from=null;
              if(gamestate=='sliding')from='pass';
             
              game.moves.add({game:game.id,place:'pass',from:from,gamestate:gamestate,color:color,expired:true});
              game.save()
             }
             Game.publishUpdate(game.id,{  action: 'timer',timer:self.countdown});
        }, 1000);
      
  
      		if (!game) return cb(new Error('Game not found.'));
      		if (!values.place||!values.color) return cb(new Error('data not found.'));
      
          if(values.from)game.history+="#";
      		  game.history+=values.place+(values.color==1?"!":"@");
      		  if(values.from)game.history+=values.from+"$";
      		   game.save(cb);
            if(values.expired) Game.publishAdd(game.id,"moves",values);

          var countdown;
         

  		});
  }

};
