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
  timer:{
      type:'int',
       defaultsTo :100
  },  
	moves:{
	    collection: 'Move',
	    via: 'game'
	},
  messages:{
      collection: 'chatMessage',
      via: 'game'
  },
  captures:{
     type:'string',
       defaultsTo : ''
  }

  }
};
