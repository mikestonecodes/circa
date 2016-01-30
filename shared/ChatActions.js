import Reflux from 'reflux';   

var ChatActions = Reflux.createActions([
  'retrieveHistory',
  'submitChatMessage',
  'clearUnread'
]);
export default ChatActions;