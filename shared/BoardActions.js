import Reflux from 'reflux';   
var BoardActions = Reflux.createActions([
  'retrieveHistory',
  'placeStone',
  'retrieveMove',
  'pass'

]);
export default BoardActions;