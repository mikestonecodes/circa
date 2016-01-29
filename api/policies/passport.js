var http = require('http');
var methods = ['login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated'];

module.exports = function (req, res, next) {
  // Initialize Passport
  if (req.isSocket) {
    passport.authenticate('bearer', { session: false });
  }
  passport.initialize()(req, res, function () {
    // Use the built-in sessions
    passport.session()(req, res, function () {
      // Make the user available throughout the frontend
      
      // Make the request's passport methods available for socket
      if (req.isSocket) {
      
        for (var i = 0; i < methods.length; i++) {
          req[methods[i]] = http.IncomingMessage.prototype[methods[i]].bind(req);
        }
      	if(!req.user){

      		
	      	console.log(req.session.passport.user);
      	}
      }
      res.locals.user = req.user;
      next();
    });
  });
};