import board from '../../shared/board';
var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    username  : { type: 'string', unique: true },
    email     : { type: 'email',  unique: true },
    passports : { collection: 'Passport', via: 'user' },
    isbot     : {type: 'boolean'},
    rank      : {type: 'number'},
    botclass  : {type: 'string'}
},
  getWins:function(userid,cb)
  {
     Game.count({winner:userid,state:"final"}).exec(function(err, wincount) {
      cb  (wincount)
     });
  },
  getLosses:function(userid,cb)
  {
     Game.count({winner: {'!':userid},state:"final"}).exec(function(err, losscount) {
      cb  (losscount)
     });
  }
  
};

module.exports = User;
