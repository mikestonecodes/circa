'use strict';
import React from 'react';
import Reflux from 'reflux';
import BoardGraphics from './BoardGraphics';
import BoardIntersection from './BoardIntersection';


  const BoardView = React.createClass({
   
   
    render: function() {
        if(this.props.board.board){
        var intersections = [];
        for (var i=0; i<6; i++) 
             for (var j = 0; j < 12; j++)
                intersections.push( ( 
                  <BoardIntersection
                    board= {this.props.board }
                    color= {(this.props.board.board[i][j])}
                    ring= {i+1}
                    key={"ring"+(i+1)+"hour"+(j+1)}
                    hour= {j+1}
                  > </BoardIntersection>
                ) ); 
        
        return  <svg height="400" version="1.1" width="400" xmlns="http://www.w3.org/2000/svg" className='board'><g>{BoardGraphics}</g><g>{intersections}</g></svg> ;
      }else{
        return <svg height="400" version="1.1" width="400" xmlns="http://www.w3.org/2000/svg"  className='board'><g>{BoardGraphics}</g></svg>
      }
    }
});
  export default BoardView;

