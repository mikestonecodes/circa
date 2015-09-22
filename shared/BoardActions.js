import Reflux from 'reflux';   
var BoardActions = Reflux.createActions([
  'retrieveHistory',
  'placeStone',
  'retrieveMove',
  'pass',
  'joinGame',
  'submitChatMessage'

]);
export default BoardActions;