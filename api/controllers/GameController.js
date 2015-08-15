module.exports = {
  show : function(req, res) {
  		if(req.isSocket) {
  			console.log("HE");
  			Game.subscribe(req, req.params.id);
  			return Game.findOne(req.params.id, function(err, game) {
          		if(game === undefined) return res.notFound();
          		res.json(game);
      });
  		} else {
	    	return res.view({gameid:req.params.id});
		}
  },
  create : function(req,res,next)
  {
  	Game.create({}, function(err, game) {
  		console.log(game);
        if (err) return next(err);

        res.redirect("/game/"+game.id);

    });
  }
 }
