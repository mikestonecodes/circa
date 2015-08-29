import Reflux from 'reflux';   
var BoardActions = Reflux.createActions([
  'retrieveHistory',
  'placeStone',
  'retrieveMove',
  'pass',
  'joinGame'

]);
export default BoardActions;