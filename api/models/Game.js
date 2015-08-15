module.exports = {
  attributes: {
  	white:{
    	model:'user'
    } ,
  	black:{
    	model:'user'
    }, 
    history: {
      type:'string',
       defaultsTo : ''
    },

	moves:{
	    collection: 'Move',
	    via: 'game'
	}
  },
  beforeUpdate: function (values, cb) {
       sails.log(values);
      //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();

  }
};
