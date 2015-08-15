requirejs.config({
    paths: {
      'react': '/bower_components/react/react-with-addons',
       'reflux': '/bower_components/reflux/dist/reflux',
      'jquery': '/bower_components/jquery/dist/jquery',
      'app': '/js'
    },
});

require(['react','app/GameView','app/Board','app/Actions'], 
  function (React, GameView, Board,boardActions) {

  boardActions.retrieveHistory(document.getElementById('gamecontainer').getAttribute('gameid'));
  React.render(
  <GameView />,
  document.getElementById('gamecontainer')
);

}); 