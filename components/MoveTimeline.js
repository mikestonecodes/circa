'use strict';

import React from 'react';
import Reflux from 'reflux';
import {Seq,List} from 'immutable';

     
    const MoveTimeline = React.createClass({
        filterMoves:function(color)
        {
            if(!this.props.board.history||this.props.board.history.count()<1)return '';
            var moves=this.props.board.history;

            var firstmovecolor=moves.get(0).color;
            var currentcolor=this.props.board.current_color;
            var turnoffset=Seq([[2,2],[2,1],[1,1],[1,2]]).findIndex( e=> e.toString()===[firstmovecolor,currentcolor].toString())+1;
            console.log(turnoffset);
            var paired=moves.toSeq().skip(turnoffset).filter(move => move.color==color).groupBy( (n,i) => Math.floor(i/2));
            if(moves.count()<5)return;
            return paired.map(function(pairedmoves,index){
                if(pairedmoves.count()==2){
                
                return (
                    <div className={'move ' + (pairedmoves.get(0).color==1?"left":"right")+'move'} key={'move'+pairedmoves.get(0).color+index}>
                        <div className='place '  > {pairedmoves.get(1).place} </div>
                        <div className='tofrom' >{pairedmoves.get(0).from}-{pairedmoves.get(0).place}</div> 
                    </div>
                ); 
              }
         });
      },
      renderCurrentMove: function(color)
      {
            if(!this.props.board.history||this.props.board.history.count()<1)return '';
            var place='';
            var tofrom='';
            return ( 
              <div className={'move ' + (color==1?"left":"right")+'move'}>
                <div className={'curent' + (color==1?"white":"black")+'place place'}> {place}</div>
                <div className={'curent' + (color==1?"white":"black")+'tofrom tofrom'}> {tofrom} </div>   
              </div>
            );
      },
      render: function() {
          return (
              <div id='timeline'>
            <div className='whitecol'> 
                <div className='whitescore score'>0</div>
                <div className='username'>user 1</div>
                {this.renderCurrentMove(1)}
                <div className='bigpiece whitedisplay'></div>
                <div className='previousmovesleft'> {this.filterMoves(1)}</div>

            </div>
            <div className='blackcol'> 

                    <div className='blackscore score'>0</div>
                    <div className='username'>user 2</div>
                    {this.renderCurrentMove(2)}
              <div className='bigpiece blackdisplay'> </div>
               <div className='previousmovesright'>{this.filterMoves(2)}</div>
            </div>
        </div>
          )
      }
  });
      export default MoveTimeline;
