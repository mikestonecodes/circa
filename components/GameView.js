import Reflux from 'reflux';
import React from 'react';
import boardStore from '../shared/board';
import Actions from '../shared/Actions';
import BoardView from './BoardView';
import MoveTimeline from './MoveTimeline';
    const gameView = React.createClass({
       mixins: [Reflux.connect(boardStore, 'boardstore')],
        getInitialState: function(){return {boardstore:{}};},
        componentWillMount: function () {
       // When this component is loaded, fetch initial data
       Actions.retrieveHistory(this.props.game);
    },
      render: function() {
          return (
              <div>
                  <BoardView  board={this.state.boardstore} />
                    <MoveTimeline  board={this.state.boardstore} />
              </div>
          )
      }
  });
  export default gameView;