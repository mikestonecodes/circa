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
  }
};
