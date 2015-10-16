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
    creator:{
      model:'user',
      defaultsTo : {}
    },
    state:{
      type:'string',
      defaultsTo:'starting'
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
