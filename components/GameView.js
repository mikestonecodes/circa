import Reflux from 'reflux';
import React from 'react';
import boardStore from '../shared/board';
import BoardActions from '../shared/BoardActions';
import BoardView from './BoardView';
import Layout from './Layout';
import MoveTimeline from './MoveTimeline';
import ChatView from './ChatView';
import ReactZeroClipboard from 'react-zeroclipboard';
    const gameView = React.createClass({
       mixins: [Reflux.connect(boardStore, 'boardstore')],
        getInitialState: function(){return {boardstore:{},timer: 100};},
        componentWillMount: function () {
          // When this component is loaded, fetch initial data
          BoardActions.retrieveHistory(this.props.game,this.props.user,this.props.messages);
      },
     
      begin: function(){

         BoardActions.begin({timer:this.state.timer});
      },
      ChangeTimer: function(event) {
        this.setState({timer: event.target.value});
      },
      render: function() {
         var gameclass='starting';
         var timer = this.state.timer;
         var starting= <div className='popup'>
         <h2>New game</h2>
         <div>
            <ReactZeroClipboard 
                 getText={function(){ return location.href; }}
                 getHtml={function(){ return '<a href="' + location.href + '">Play Circa</a>'; }}>
                  <button  className='invitetoclip'  >Invite URL to clipboard</button>
              </ReactZeroClipboard>
            Timer:<input value={timer} onChange={this.ChangeTimer} name='timer' />
           <div className='popupbegin' onClick={this.begin}>Begin</div>
           </div>
         </div>
         if(!this.props.user||this.props.game.creator!=this.props.user.id)
         {
            starting=<div className='popup'>game starting</div>
         }
         if(this.state.boardstore.gameState!='starting'){
           gameclass='';
           starting= <div></div>;
         } 
          return (
            <Layout user={this.props.user}>
                    {starting}
                    <div id='game' className={gameclass}>
                      <aside id='leftside'>
                      <MoveTimeline user={this.props.user} board={this.state.boardstore} />
                     <ChatView board={this.state.boardstore} />
                      </aside>
                     <BoardView  board={this.state.boardstore} />
                     <div id='timer'>{this.state.boardstore.timer}</div>
                     </div>
           </Layout>
          )
      }
  });
  export default gameView;