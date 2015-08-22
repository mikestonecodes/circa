'use strict';

import React from 'react';
import Reflux from 'reflux';
import {Seq,List} from 'immutable';
import BoardActions from '../shared/BoardActions';
     
    const MoveTimeline = React.createClass({
        filterMoves:function(color)
        {
            if(!this.props.board.history||this.props.board.history.count()<1)return '';
            var moves=this.props.board.history;

            var firstmovecolor=moves.get(0).color;
            var currentcolor=this.props.board.current_color;
            var turnoffset=Seq([[2,2],[2,1],[1,1],[1,2]]).findIndex( e=> e.toString()===[firstmovecolor,currentcolor].toString())+1;    
            var paired=moves.toSeq().skip(turnoffset).filter(move => move.color==color).groupBy( (n,i) => Math.floor(i/2));
            if(moves.count()<5)return;
            return paired.map(function(pairedmoves,index){
                if(pairedmoves.count()==2){
                
                return (
                    <div className={'move ' + (pairedmoves.get(0).color==1?"left":"right")+'move'} key={'move'+pairedmoves.get(0).color+index}>
                        <div className='place '  > {pairedmoves.get(1).place} </div>
                        <div className='tofrom' >{pairedmoves.get(0).from}{pairedmoves.get(0).place!='pass'?'-'+pairedmoves.get(0).place:''}</div> 
                    </div>
                ); 
              }
         }).toArray();
      },
      handleClick: function(event)
      {
        if(event.target.innerHTML=='PASS'){
          BoardActions.pass();
        }
      },
      renderCurrentMove: function(color)
      {
           
            var moves=this.props.board.history;
         
            var place='';
            var tofrom='';
            var firstmove=moves?moves.get(0):undefined;
            if(firstmove&&color==firstmove.color){
               
               if(firstmove.from)
                {
                  tofrom=firstmove.from+"-"+firstmove.place;
                  place=moves.get(1).place;
                   if(firstmove.color==1){
                   place=tofrom='';
                }
               }else {
                place=firstmove.place;
                tofrom="PASS";
              }

            }
            else if(firstmove&&color!=firstmove.color) {
             
                if(color==2&&!firstmove.from)
                {
                  place=moves.get(2).place;  
                  if(moves.get(3)){
                    tofrom=moves.get(3).from+"-"+moves.get(3).place;
                  }
                }
                 if(firstmove.from&&moves.count()>2)
                {
                   place="PASS";

                }
              
            }else if(firstmove&&moves.count()>2&&color==2){
              place="PASS"
            }
            if(tofrom=='pass-pass')
            {
              tofrom='pass';
            }
            return (  
              <div className={'move ' + (color==1?"left":"right")+'move'}>
                <div className={'curent' + (color==1?"white":"black")+'place place '+ (place=='PASS'?'pass':'')} onClick={this.handleClick}> {place}</div>
                <div className={'curent' + (color==1?"white":"black")+'tofrom tofrom '+ (tofrom=='PASS'?'pass':'')} onClick={this.handleClick}> {tofrom} </div>   
              </div>
            );
      },
      join : function(color){

      },
      render: function() {
        var white_user='';
        var black_user='';
          return (
              <div id='timeline'>
            <div className='whitecol'> 
                <div className='whitescore score'>{this.props.board.whitescore}</div>
                <div className='username'> {white_user}   </div>
                {this.renderCurrentMove(1)}
                <div className='bigpiece whitedisplay'></div>
                <div className='previousmovesleft'> {this.filterMoves(1)}</div>

            </div>
            <div className='blackcol'> 

                    <div className='blackscore score'>{this.props.board.blackscore}</div>
                    <div className='username'>{black_user} </div>
                    {this.renderCurrentMove(2)}
              <div className='bigpiece blackdisplay'> </div>
               <div className='previousmovesright'>{this.filterMoves(2)}</div>
            </div>
        </div>
          )
      }
  });
      export default MoveTimeline;
