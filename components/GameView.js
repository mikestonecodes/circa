import Reflux from 'reflux';
import React from 'react';
import boardStore from '../shared/board';
import BoardActions from '../shared/BoardActions';
import BoardView from './BoardView';
import Layout from './Layout';
import MoveTimeline from './MoveTimeline';
import ChatView from './ChatView';
    const gameView = React.createClass({
       mixins: [Reflux.connect(boardStore, 'boardstore')],
        getInitialState: function(){return {boardstore:{}};},
        componentWillMount: function () {
       // When this component is loaded, fetch initial data
       BoardActions.retrieveHistory(this.props.game,this.props.user,this.props.messages);
    },
      render: function() {
          return (
            <Layout user={this.props.user}>
                 
                    <aside id='leftside'>
                    <MoveTimeline  board={this.state.boardstore} />
                    <ChatView board={this.state.boardstore} />
                    </aside>
                     <BoardView  board={this.state.boardstore} />
                     <div id='timer'>{this.state.boardstore.timer}</div>
           </Layout>
          )
      }
  });
  export default gameView;