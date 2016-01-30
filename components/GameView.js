import Reflux from 'reflux';
import React from 'react';
import boardStore from '../shared/board';
import BoardActions from '../shared/BoardActions';
import ChatActions from '../shared/ChatActions'
import TimerActions from '../shared/TimerActions'
import TimerView from './TimerView'
import BoardView from './BoardView';
import Layout from './Layout';
import MoveTimeline from './MoveTimeline';
import ChatView from './ChatView';
import ReactZeroClipboard from 'react-zeroclipboard';
import { browserHistory } from 'react-router'
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import Checkbox from 'react-checkbox'
    const GameView = React.createClass({
       mixins: [Reflux.connect(boardStore, 'boardstore')],
       
        getInitialState: function(){return {boardstore:{},timer: 100,show:false,hastimer:true,ispublic:true,ranked:true};},
        componentWillMount: function () {
          // When this component is loaded, fetch initial data
          BoardActions.retrieveHistory(this.props.game,this.props.loggedInAs);
          ChatActions.retrieveHistory(this.props.game,this.props.messages);
          TimerActions.retrieveHistory(this.props.game);
          if(this.state.boardstore&&this.props.loggedInAs){
            if(this.state.boardstore.blackUser==undefined||tthis.state.boardstore.blackUser.username==undefined){
              if(this.props.params.joincolor=='black'){
                BoardActions.joinGame('black');
                browserHistory.push("/game/"+this.props.game.id) 
              }
            }
            if(this.state.boardstore.whiteUser==undefined||this.state.boardstore.whiteUser.username==undefined){
              if(this.props.params.joincolor=='white'){
                BoardActions.joinGame('white');
                browserHistory.push("/game/"+this.props.game.id) 
              }
            }
          }

      },
     
     
      begin: function(){
          this.setState({ show: false})
          console.log("YO");
          var timer=this.state.timer
          if(!this.state.hastimer)timer=-1;
         BoardActions.begin({timer:timer,ispublic:this.state.ispublic,ranked:this.state.ranked});
      },
      ChangehasTimer: function(value) {
        this.setState({hastimer: value});
      },
      ChangeisPublic: function(value) {
        this.setState({ispublic: value});
      },
        ChangeRanked: function(value) {
        this.setState({ranked: value});
      },
      ChangeTimer: function(event) {
        this.setState({timer: event.target.value});
      },
      render: function() {
       
         var gameclass='starting';
         var timer = this.state.timer;
        
         var show=true;
         var self=this;
         var modal=(<Modal
          show={show}
          onHide={this.begin}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title"><h2>New Game</h2></Modal.Title>
          </Modal.Header>
          <Modal.Body>
          Timer:<input value={timer} onChange={this.ChangeTimer} name='timer' /> <br/>
          Has Timer: <Checkbox checked={this.state.hastimer} onChange={this.ChangehasTimer} /> <br/>
          Public: <Checkbox checked={this.state.ispublic} onChange={this.ChangeisPublic} /> <br/>
           Ranked: <Checkbox checked={this.state.ranked} onChange={this.ChangeRanked} /> <br/>
          </Modal.Body>
          <Modal.Footer>
          <ReactZeroClipboard 
                 getText={function(){ return location.href; }}
                 getHtml={function(){ return '<a href="' + location.href + '">Play Circa</a>'; }}>
                  <Button   >Invite URL to clipboard</Button>
              </ReactZeroClipboard>
            <Button onClick={self.begin}>Begin</Button>
          </Modal.Footer>
        </Modal>)

      var starting;
         if(!this.props.loggedInAs||this.props.game.creator!=this.props.loggedInAs.id)
         {
            starting=<div>"game starting..."</div>
            show=true;
         }
         
         if(this.state.boardstore.gameState!='starting'){
            gameclass='';
            show=false;
            modal=<div></div>
            
         } 
          return (
            <div>
                  {modal}
                    <div id='game' className={gameclass}>
                     <BoardView  board={this.state.boardstore} />
                      <aside id='leftside'>
                      <MoveTimeline loggedInAs={this.props.loggedInAs} board={this.state.boardstore} />

                    
                      </aside>
                       <ChatView board={this.state.boardstore} />
                     <TimerView />
                    </div>
          </div>
          
          )
      }
  });
  export default GameView;