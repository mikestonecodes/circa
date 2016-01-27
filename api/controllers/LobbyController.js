import routes from '../../components/routes' 

module.exports = {
  show : function(req, res) {
  			 Game.find({ limit: 40,sort: 'createdAt DESC',ispublic:true }).populate('white').populate('black').exec(function(err, games) {
          Game.count().exec(function(err,count) {
          		if(games === undefined) return res.notFound();
                if(req.isSocket) {
                    Game.subscribe(req, req.params.id);
                 }else{
                   renderTo(routes, res.view, '/lobby/', {},{count:Math.floor(count/40),games:games,loggedInAs:req.user});
                 }
               
                }); 
      });		 
  },
  getGames: function(req,res)
  {
    if(!req.isSocket) {
      //notfound
    }
    var queryp={ skip:req.params.page*40,limit: 40,ispublic:true,sort: 'createdAt DESC' };
    if(req.params.user)
    {
      queryp["or"]=[{black : req.params.user},{white:req.params.user}];
    }
     Game.find(queryp).populate('white').populate('black').exec(function(err, games) {
          return res.json(games)
    });
  }
 }
