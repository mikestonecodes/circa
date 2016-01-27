'use strict';

import React from 'react';
import Reflux from 'reflux';
import BoardActions from '../shared/BoardActions';
import Validators from '../shared/Validators';


  const BoardIntersection = React.createClass({

      handleClick: function() {
        BoardActions.placeStone({ring:this.props.ring,hour:this.props.hour});
      },
      
      render: function() {
        var classes = "intersection ";
        //start with defualt small intersection
        var r= ( 200/24 );
        if (this.props.color != 0 ){ 
          //If the piece is placed make the radius bigger
          r = ( 200/16 );
          classes += this.props.color == 2 ? "black" : "white";
        }else if(this.props.board.gameState!='ending') {
          //Otherwise if you can't place an item don't display intersection
          classes += (this.props.board.turn== 1 ?"white" : "black")+" empty";
          if(!Validators.placeable( this.props.board, {ring:this.props.ring,hour:this.props.hour} ))  {
            r=0;
          }   
        }else {
           classes += 'emptyTerrority';
        }
        if(this.props.color==3)
        {
          r= ( 200/24 );
          classes = 'intersection white';
        }
        if(this.props.color==4)
        {
          r= ( 200/24 );
          classes = 'intersection black';
        }
        //Make big if sliding
        if(this.props.board.gameState!='notyourturn' &&
           this.props.board.sliding&&this.props.board.sliding.ring==this.props.ring && 
           this.props.board.sliding.hour==this.props.hour){
            r=( 200/8 ); 
        }
        
        var ringRadius = 200 * Math.sin(2*Math.PI*this.props.ring/24)/2;
        return (
            <circle 
                cx={ 200 + 2*ringRadius*Math.cos(2*Math.PI*(((this.props.hour+8)%12)+this.props.ring/2)/12) }
                cy={ 200 + 2*ringRadius*Math.sin(2*Math.PI*(((this.props.hour+8)%12)+this.props.ring/2)/12) }
                r={r}
                id={this.props.ring + " "  +this.props.hour }
                onClick={this.handleClick}
                className={classes}>
            </circle>
        );
      }
  });
  export default BoardIntersection;