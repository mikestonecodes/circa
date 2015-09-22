var routes = require('../../components/routes.js');

module.exports = {
  show : function(req, res) {
  			 Game.findOne(req.params.id).populate('white').populate('black').exec(function(err, game) {
              ChatMessage.find({game:game.id}).populate('user').exec(function(err,messages){
              
          		if(game === undefined) return res.notFound();
                if(req.isSocket) {
                    Game.subscribe(req, req.params.id);
                 }else{
                   renderTo(routes, res.view, '/game/'+req.param('id'), {},{game:game,messages:messages,user:req.user});
                 }
               });
      });
  		 
  },
  join : function (req,res)
  {
    Game.findOne(req.params.id).exec(function afterwards(err,game){
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
  },
  submitChatMessage: function(req,res)
  {
    console.log(req.params.message);
    Game.findOne(req.params.id).exec(function afterwards(err,game){
      if(err){
        return res.json(err);
      }
      if(!req.user){   
        return res.json({error:"Not logged in"});
      }
      game.messages.add({message:req.param('message'),user:req.user});
      Game.publishUpdate(req.params.id, {
        user:req.user,
        message:req.params.message,
        action: 'chatMessageSubmited'
      });
      game.save();
      return res.json(game);
    });
  }
 }
