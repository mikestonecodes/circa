/**
 * MoveController
 *
 * @description :: Server-side logic for managing moves
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create : function(req,res,next)
	{
		Game.findOne(req.body.game).exec(function afterwards(err,game){

			if(err){
				
				return res.json(err);
			}

		    if(req.user&&req.isSocket){

		    	if( !( game.white==req.user.id && game.black==req.user.id )  ){
		    	if(game.black==req.user.id){
		    		if(req.body.color!=2){
		    			Game.publishUpdate(game.id,{  action: 'moveError',move:req.body,error:"Wrong Color"});
		    			return res.json({error:"Wrong Color"})
		    		}
		    	}else if(game.white==req.user.id){
		    		if(req.body.color!=1){
		    			Game.publishUpdate(game.id,{  action: 'moveError',move:req.body,error:"Wrong Color"});
		    			return res.json({error:"Wrong Color"})
		    		}
		    	}
		    }
		    	var data={place:req.body.place,game:req.body.game,color:req.body.color,gamestate:req.body.gamestate}
		    	if(req.body.from)data.from=req.body.from;
		    	if(!req.body.gamestate&&!req.body.from)data.gamestate='place';
		    	if(!req.body.gamestate&&req.body.from)data.gamestate='sliding';
		    	Move.create(data, function(err, move) {
		    	
		          if (err) {

		          	Game.publishUpdate(game.id,{  action: 'moveError',move:move,error:err.toString()});
		          	return res.json(err);
		          }
		          Game.publishAdd(game.id,"moves",move)
      			});
  			}else{

  				Game.publishUpdate(game.id,{  action: 'moveError',move:req.body,error:"access Denied"});
  				return res.json({error:"access Denied"});
  			}
  })
}
}

