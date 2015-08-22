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
          var r= ( 200/24 );
          if (this.props.color != 0 ){ 
            r = ( 200/16 );
            classes += this.props.color == 2 ? "black" : "white";
          }else {
            classes += (this.props.board.current_color== 1 ?"white" : "black")+" empty";
        
            if(this.props.board.gameState=='sliding'|| 
                ( this.props.board.sliding&&
                  !Validators.slidable(
                    this.props.board.sliding,
                    {ring:this.props.ring,hour:this.props.hour} 
              ) ) ) {
              r=0;
            }
          
          }    
       
          if(this.props.board.sliding&&this.props.board.sliding.ring==this.props.ring && this.props.board.sliding.hour==this.props.hour)r=( 200/8 ); 
          var ringRadius = 200 * Math.sin(2*Math.PI*this.props.ring/24)/2;
           if(this.props.color== 4) classes += "white";
           if(this.props.color== 3) classes += "black";
            if(this.props.color== 4||this.props.color== 3)var r= ( 200/24 );
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