'use strict';

  // Generic "model" object. You can use whatever
  // framework you want. For this application it
  // may not even be worth separating this logic
  // out, but we do this to demonstrate one way to
  // separate out parts of your application.
  const gameModel = function (url, socket) {
    this.url = url;
    this.socket = socket;
    this.onChanges = [];
    this.black='undefined';
    this.white='undefined';
  };

  gameModel.prototype.userJoined = function(userid) {
    this.black = userid;
    this.inform();
  };
  
  gameModel.prototype.whiteJoined = function(userid) {
  this.white = userid;
  this.inform();
};

  gameModel.prototype.subscribe = function (onChange) {
    this.onChanges.push(onChange);
  };

  gameModel.prototype.inform = function () {
    this.onChanges.forEach(function (cb) { cb(); });
  };

  gameModel.prototype.addMove = function (title) {
    
    this.socket.post(this.url, title, function whenServerResponds(data) {
  
      console.log('Message posted :: ', data);
    }.bind(this));

  };

  export default gameModel;

