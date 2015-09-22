module.exports = {
  attributes: { 
    message: {
      type:'string',
       defaultsTo : ''
    },
    user:{
      model:'User'
    },
    game:{
      model:'Game'
    }  
  }
};
