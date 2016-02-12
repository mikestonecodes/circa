import validators from '../../shared/Validators';
import board from '../../shared/board';
module.exports = {

  attributes: {
    place: 'string',
    color: 'int',
    from: 'string',
    expired:'boolean',
    game:{
      model:'Game'
    }  
  },
   beforeCreate: function (values, cb) {
     Game.findOne(values.game).populate('moves').exec(function (err, game) {
              if (err) return cb(err);
             
              if (!values.place||!values.color) return cb(new Error('Move color or place not found.'));
              if (!values.gamestate) return cb(new Error('No gamestate found'));
             // if(values.place!="pass" && values.place.length!=2 ) return cb(new Error('place error'));
              //if(values.from&& (values.from!="pass" && values.from.length!=2)) return cb(new Error('from location error'));
              
              if(   !(game.black&&game.white)) return cb(new Error('Both players must join'));
              if(game.state=='ending'||game.state=='final')return cb(new Error('Game ending or not playable.'));
              if(game.state=='starting')return cb(new Error('Game has not started'));

              var color=parseInt(values.color);
          //    console.log("COLOR",color);
              if(color!=1&&color!=2) return cb(new Error('Color Value incorrect'));
              var lastmove=game.moves.reverse()[0]; // NOT immutable
              
              if(!lastmove){
                if(color!=2)return cb(new Error('First piece must be black'));

              }
             

               if(game.advancedValidations){

              board.set(game.history); 
              var getColorAtIntersection=function(loc){
                if(loc=='pass')return 0;
                var mloc=notationToLocation(loc);
                return(board.board[mloc.ring-1][mloc.hour-1])
              }

              var notationToLocation = function(notation)
              {
               return { ring: notation.charCodeAt(0)-64  , hour: parseInt(notation.substring(1)) }   
              }




              if(getColorAtIntersection(values.place) != 0 )
              {
              if(values.place!='pass'){
                  return cb(new Error('Spot full'));
              }
              }
              if(lastmove&&parseInt(lastmove.color)==color){

                var twomovesbehind=game.moves[1];
                if(!values.from)return cb(new Error('from value needed for sliding move ( even if passing )'));
                  if(twomovesbehind&&parseInt(twomovesbehind.color)==color){
                  return cb(new Error('It is not your turn'));
                }
             

                if(getColorAtIntersection(values.from) != color )
                 {
                  if(values.place!='pass'){
                    return cb(new Error('You have to slide a piece of your color already on the board'));
                  }
                }
                  //notationToLocation
                  if(!validators.slidable( notationToLocation(values.from),notationToLocation(values.place)))   {
                     if(values.place!='pass'){
                     return cb(new Error('You Did not slide on a intersecting ring'));
                   }
                  }



              
               
              }else{

                 if(values.from)return cb(new Error('Do not use from value without slide move'));
                 
                if(twomovesbehind&&parseInt(twomovesbehind.color)!=color){
                  return cb(new Error('It is not your turn'));
                }
               
              }
            }


               cb();
    });
  },

  afterCreate: function (values, cb) {
     
      var self=this;

      Game.findOne(values.game).populate('moves').exec(function (err, game) {

              if (err) return cb(err);
              if (!game) return cb(new Error('Game not found.'));
          if (!values.place||!values.color) return cb(new Error('Move color or place not found.'));
              if(game.state=='ending'||game.state=='final')return cb();
         if(game.timer>2)
         {
         self.countdown=game.timer; 
      clearInterval(self.timer);

       Game.publishUpdate(game.id,{  action: 'timer',timer:self.countdown});

        self.timer=setInterval(function() { 
            self.countdown--;
            if(game.state=='ending'){
              self.countdown=null;
               clearInterval(game.timer);
               game.timer=null;
            }
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
      
             var data={game:game.id,place:'pass',gamestate:gamestate,color:color,expired:true}
             if(gamestate=='sliding')data.from='pass';

              game.moves.add(data);
              var allpasses=game.moves.reverse().slice(0, 3).every(function(move){
                return move.place=='pass';
              });
                 if(allpasses&&color==1&&gamestate=='sliding'){
                  
                  self.countdown=null;
                  /*
                  Game.publishUpdate(game.id, {action: 'ending',terroritories:result});*/
                  Game.publishEndGame(game);
                }
              game.save()
             }
             Game.publishUpdate(game.id,{  action: 'timer',timer:self.countdown});
        }, 1000);
      
        }
          
      
          if(values.from)game.history+="#";
            game.history+=values.place+(values.color==1?"!":"@");
            if(values.from)game.history+=values.from+"$";
             game.save(cb);
            if(values.expired) Game.publishAdd(game.id,"moves",values);

          var countdown;
         

      });
  }

};