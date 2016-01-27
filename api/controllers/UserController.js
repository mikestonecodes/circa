import routes from '../../components/routes' 

module.exports = {
  show : function(req, res) {
  			return User.findOne({username:req.params.username}, function(err, user) {
       
   
     Game.find().where({ or:[{black : user.id},{white:user.id }]}).limit(40).sort('createdAt DESC').populate('white').populate('black').exec(function(err, games) {
      User.getWins(user.id,function(wins){
         User.getLosses(user.id,function(losses){
         Game.count({ or:[{black : user.id},{white:user.id }]}).exec(function(err,count) {

          		if(user === undefined) return res.notFound();
                if(req.isSocket) {
                    User.subscribe(req,  user.id);
                 }else{
                   renderTo(routes, res.view, '/user/'+req.param('username'), {},{count:Math.floor(count/40),wins:wins,losses:losses,games:games,user:user,loggedInAs:req.user});
                 }
      });
          });
           });
        });
  		  });
  },
  update : function(req,res) {

    
  }
 }
