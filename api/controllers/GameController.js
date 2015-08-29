var routes = require('../../components/routes.js');

module.exports = {
  show : function(req, res) {
  			return Game.findOne(req.params.id).populate('white').populate('black').exec(function(err, game) {
          		if(game === undefined) return res.notFound();
                if(req.isSocket) {
                    Game.subscribe(req, req.params.id);
                 }else{
                   renderTo(routes, res.view, '/game/'+req.param('id'), {},{game:game,user:req.user});
                 }
      });
  		 
  },
  join : function (req,res)
  {
    
    
    console.log(req.params);
      return Game.findOne(req.params.id).exec(function afterwards(err,game){
        if(err){
          return res.json(err);
        }
          if(!req.user){   
        return res.json({error:"Not logged in"});
      }
        game[req.params.color]=req.user;
      Game.publishUpdate(req.params.id, {
        joinedUser:req.user,
        color:req.params.color,
        action: 'userJoined'
      });
        game.save();
        return res.json(game);
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
