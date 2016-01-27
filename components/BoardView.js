'use strict';
import React from 'react';
import Reflux from 'reflux';
import BoardGraphics from './BoardGraphics';
import BoardIntersection from './BoardIntersection';


  const BoardView = React.createClass({
   
   
    render: function() {
        if(this.props.board.board){
        var intersections = [];
        var circles=[];
        for (var n=12; n>=0; n--) {
            var color = n%2?"black":"white",
            height=800,width=800,
            chakraRadius=width/4;
<<<<<<< Updated upstream
            circles.push( (<circle key={"circle"+n} fill="rgba(0,0,0,0)" stroke={color} strokeWidth="1" cx={0.5*(height / 2.0 + chakraRadius*Math.sin(2*Math.PI*n/12))} cy={0.5*(height / 2 + chakraRadius*Math.cos(2*Math.PI*n/12))} r="100"/>)); 
=======
            circles.push( (<circle fill="rgba(0,0,0,0)" key={"circle"+n}stroke={color} cx={0.5*(height / 2.0 + chakraRadius*Math.sin(2*Math.PI*n/12))} cy={0.5*(height / 2 + chakraRadius*Math.cos(2*Math.PI*n/12))} r="100"/>)); 
>>>>>>> Stashed changes
        };
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
        
        return  <svg  version="1.1" width="50%" xmlns="http://www.w3.org/2000/svg" className='board'  viewBox="0 0 400 400" >{BoardGraphics}<g>{circles}</g><g>{intersections}</g></svg> ;
      }else{
        return <svg  version="1.1" width="50%"  xmlns="http://www.w3.org/2000/svg"  className='board' viewBox="0 0 400 400">{BoardGraphics}<g>{circles}</g></svg>
      }
    }
});
  export default BoardView;

