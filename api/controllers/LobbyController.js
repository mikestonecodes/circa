import routes from '../../components/routes' 

module.exports = {
  show : function(req, res) {
  			 Game.find({ limit: 40,sort: 'createdAt DESC' }).populate('white').populate('black').exec(function(err, games) {
          		if(games === undefined) return res.notFound();
                if(req.isSocket) {
                    Game.subscribe(req, req.params.id);
                 }else{
                   renderTo(routes, res.view, '/lobby/', {},{games:games,loggedInAs:req.user});
                 }
      });		 
  },
  getGames: function(req,res)
  {
    if(!req.isSocket) {
      //notfound
    }
     Game.find({ skip:req.params.page*40,limit: 40,sort: 'createdAt DESC' }).populate('white').populate('black').exec(function(err, games) {
          return res.json(games)
    });
  }
 }
