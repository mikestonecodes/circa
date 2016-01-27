import routes from '../../components/routes' 

module.exports = {
  show : function(req, res) {
  			return User.findOne({username:req.params.username}, function(err, user) {
          		if(user === undefined) return res.notFound();
                if(req.isSocket) {
                    User.subscribe(req,  user.id);
                 }else{
                   renderTo(routes, res.view, '/user/'+req.param('username'), {},{user:user,loggedInAs:req.user});
                 }
      });
  		 
  },
  update : function(req,res) {

    
  }
 }
