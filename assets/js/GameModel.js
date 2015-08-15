/**
 * @jsx React.DOM
 */
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

define([''], function () {
  'use strict';

  // Generic "model" object. You can use whatever
  // framework you want. For this application it
  // may not even be worth separating this logic
  // out, but we do this to demonstrate one way to
  // separate out parts of your application.
  var GameModel = function (url, socket) {
    this.url = url;
    this.socket = socket;
    this.onChanges = [];
    this.black='undefined';
    this.white='undefined';
  };

  GameModel.prototype.userJoined = function(userid) {
    this.black = userid;
    this.inform();
  };
  
  GameModel.prototype.whiteJoined = function(userid) {
  this.white = userid;
  this.inform();
};

  GameModel.prototype.subscribe = function (onChange) {
    this.onChanges.push(onChange);
  };

  GameModel.prototype.inform = function () {
    this.onChanges.forEach(function (cb) { cb(); });
  };

  GameModel.prototype.addMove = function (title) {
    
    this.socket.post(this.url, title, function whenServerResponds(data) {
  
      console.log('Message posted :: ', data);
    }.bind(this));

  };

  return GameModel;

});
