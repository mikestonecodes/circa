import Reflux from 'reflux';
import React from 'react';
import boardStore from '../shared/board';
import BoardActions from '../shared/BoardActions';
import BoardView from './BoardView';
import Layout from './Layout';
import MoveTimeline from './MoveTimeline';
    const gameView = React.createClass({
       mixins: [Reflux.connect(boardStore, 'boardstore')],
        getInitialState: function(){return {boardstore:{}};},
        componentWillMount: function () {
       // When this component is loaded, fetch initial data
       BoardActions.retrieveHistory(this.props.game,this.props.user);
    },
      render: function() {
          return (
            <Layout user={this.props.user}>
                  <BoardView  board={this.state.boardstore} />
                    <MoveTimeline  board={this.state.boardstore} />
           </Layout>
          )
      }
  });
  export default gameView;