/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
define(['react','reflux','app/boardGraphics','app/BoardIntersection','app/Board'], function (React,Reflux, boardGraphics, BoardIntersection,boardStore ) {
  'use strict';

  var BoardView = React.createClass({
    mixins: [Reflux.connect(boardStore, 'boardstore')],
    getInitialState: function(){return {boardstore:{}};},
    componentDidMount: function () {
        var setState = this.setState;
        var router = Router({
          '/': setState.bind(this, {nowShowing: 'all'})
        });
        router.init();
    },
    render: function() {
        if(this.state.boardstore.board){
        var intersections = [];
        for (var i=0; i<6; i++) 
             for (var j = 0; j < 12; j++)
                intersections.push( ( 
                  <BoardIntersection
                    board= {this.state.boardstore }
                    color= {(this.state.boardstore.board[i][j])}
                    ring= {i+1}
                    key={boardStore.locationToNotation({ring:i+1,hour:j+1})}
                    hour= {j+1}
                    onPlay= {this.props.onPlay}
                  > </BoardIntersection>
                ) ); 
        
        return  <svg height="1600" version="1.1" width="1600" xmlns="http://www.w3.org/2000/svg"><g>{boardGraphics}</g><g>{intersections}</g></svg> ;
      }else{
        return <svg height="1600" version="1.1" width="1600" xmlns="http://www.w3.org/2000/svg"><g>{boardGraphics}</g></svg>
      }
    }
});
  return BoardView;
});
