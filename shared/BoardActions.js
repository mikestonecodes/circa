import Reflux from 'reflux';   
var BoardActions = Reflux.createActions([
  'retrieveHistory',
  'placeStone',
  'retrieveMove',
  'pass',
  'joinGame',
  'submitChatMessage',
  'begin',
  'end',
  'acceptScore'
]);
export default BoardActions;