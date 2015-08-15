define(['react','reflux','app/boardGraphics','app/Board','app/Actions','app/Validators'], function (React,Reflux, boardGraphics,Board, Actions,Validators) {
  'use strict';
  var BoardIntersection = React.createClass({

      handleClick: function() {
        Actions.placeStone({ring:this.props.ring,hour:this.props.hour});
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
  return BoardIntersection;
});