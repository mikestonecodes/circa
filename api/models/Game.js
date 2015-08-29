module.exports = {
  attributes: {
  	white:{
    	model:'user',
         defaultsTo : {}
    } ,
  	black:{
    	model:'user',
         defaultsTo : {}
    }, 
    history: {
      type:'string',
       defaultsTo : ''
    },

	moves:{
	    collection: 'Move',
	    via: 'game'
	},

  captures:{
     type:'string',
       defaultsTo : ''
  }

  }
};
