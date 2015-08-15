module.exports = {

  attributes: {
    place: 'string',
    color: 'string',
    from: 'string',
    game:{
    	model:'Game'
    }  
  },
  afterCreate: function (values, cb) {
  		Game.findOne(values.game).exec(function (err, game) {
  			if (err) return cb(err);
      		if (!game) return cb(new Error('Game not found.'));
      		if (!values.place||!values.color) return cb(new Error('data not found.'));
          if(values.from)game.history+="#";
      		game.history+=values.place+(values.color==1?"!":"@");
      		if(values.from)game.history+=values.from+"$";
      		game.save(cb);
  		});
  }

};
