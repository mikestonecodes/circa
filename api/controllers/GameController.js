var routes = require('../../components/routes.js');

module.exports = {
  show : function(req, res) {
  			return Game.findOne(req.params.id, function(err, game) {
          		if(game === undefined) return res.notFound();
                if(req.isSocket) {
                    Game.subscribe(req, req.params.id);
                 }else{
                   renderTo(routes, res.view, '/game/'+req.param('id'), {},{game:game});
                 }
      });
  		 
  },
  join : function (req,res)
  {

  },
  capture : function(req, res) {
        return Game.findOne(req.params.id, function(err, game) {
              if(game === undefined) return res.notFound();
                if(req.isSocket) {
                    Game.subscribe(req, req.params.id);
                 }
      });
       
  },
  create : function(req,res,next)
  {
    console.log("create");
  	Game.create({}, function(err, game) {
        if (err) return next(err);
        res.redirect("/game/"+game.id);

    });
  }
 }
