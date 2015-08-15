define(['react','app/BoardView','app/Board'], 
  function (React,  BoardView, Board) {
     'use strict';

    var ContainerView = React.createClass({
      getInitialState: function() {
          return {'board': this.props.board};
      },
      onBoardUpdate: function() {
          this.setState({"board": this.props.board});
      },
      render: function() {
          return (
              <div>
                  <BoardView board={this.state.board} 
                      onPlay={this.onBoardUpdate} />
              </div>
          )
      }
  });
      return ContainerView;
      });