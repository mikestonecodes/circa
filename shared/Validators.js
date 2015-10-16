
  const validators= {
    slidable : function(sliding,move) {
          var slidable=false;
          for (var n=1; n<7; n++) {
            var movesAvaibletoSlide=[
                {ring:n,hour: ((sliding.hour+ sliding.ring+5  )%12 )+1  },
                {ring:6-(n-1),hour:  ((sliding.hour-1+ sliding.ring+5+n  )%12 )+1 },
               {ring:n,hour: ((sliding.hour-1)%12)+1 },
               {ring:6-(n-1),hour: (((sliding.hour-1)+(n-1))%12)+1 }
            ];
          
            movesAvaibletoSlide.forEach(function(location){ 
          
              if(location.hour==move.hour&&location.ring==move.ring)slidable=true;
            });
          }
          return slidable;
     },

     placeable: function(board,move) {
      return !(board.gameState=='sliding'|| board.gameState=='notyourturn' || board.gameState=='joining' ||
                ( board.sliding&& !this.slidable( board.sliding, move ) ) )    
     }
  }
  export default validators;