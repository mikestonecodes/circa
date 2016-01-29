import routes from '../../components/routes' 

module.exports = {
  show : function(req, res) {
      if(req.user){
  			 Passport.findOne({ user:req.user.id }).exec(function(err, passport) {
          Game.count().exec(function(err,count) {
          		if(passport === undefined) return res.notFound();            
                   renderTo(routes, res.view, '/botapi/', {},{token:passport.accessToken,user:req.user,loggedInAs:req.user});
                  
                }); 
      });		 
      }else{
        renderTo(routes, res.view, '/botapi/', {},{token:"Login to see token",user:req.user,loggedInAs:req.user});
      }
  }
}
