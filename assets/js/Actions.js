define(['reflux'], 
  function (Reflux) {
    'use strict';     
    var boardActions = Reflux.createActions([
      'retrieveHistory',
      'placeStone',
      'retrieveMove'

    ]);
    return boardActions;
});