import React from 'react';
import Reflux from 'reflux';
import BoardGraphics from './BoardGraphics';
import BoardIntersection from './BoardIntersection';
import Griddle from 'griddle-react'
import BoardActions from '../shared/BoardActions';
import { browserHistory,Link } from 'react-router'
import ReactDOM from 'react-dom'
import {Transport} from '../shared/Transport'
var OtherComponent = React.createClass({
  
  getDefaultProps: function(){
    return { "data": {} };
  },
  
  render: function(){
    var white=<div></div>
    var black=<div></div>
   
     white=( <div className='lobbyusername joinnow'> <a href={`/game/${this.props.data.id}/join/white`}> join </a>  </div>)
     black=( <div className='lobbyusername joinnow' > <a href={`/game/${this.props.data.id}/join/black`}> join </a>  </div>)

      if(this.props.data.white&&this.props.data.white.username)
      {
        white= <div className='lobbyusername'> {this.props.data.white.username}  </div>
      }
       if(this.props.data.black&&this.props.data.black.username)
      {
        black= <div className='lobbyusername'> {this.props.data.black.username}  </div>
      }
    
    return (<div className="custom-row-card">
      <img src='/images/board.svg' width={"100%"} height={"100%"} className='lobby_board' />
    <div className="name">
      <div className='nametag'>
        <div className=' white-lobby bigpiece'></div>
        {white}
         
          <div className='nametag'>
        <div className=' black-lobby bigpiece'></div> 
           {black}
        </div>
        </div>
    </div>
   
    </div>);
  }
});
  const LobbyView = React.createClass({
     getInitialState: function(){
      var initial = { "results": [],
          "currentPage": 0,
          "maxPages": this.props.count,
          "externalResultsPerPage": 40,
          "externalSortColumn":null,
          "externalSortAscending":true
      };

      return initial;
    },
     componentDidMount: function(){
      this.socket = new Transport();
      this.getExternalData(1);

    },
  getExternalData: function(page){
        if(page==1&&this.props.games){
          this.setState({
            results: this.props.games,
             currentPage: 0,
            maxPages: this.props.count
         });
        }else{
          var self=this;
          var url='/games/'+page
          if(this.props.user)
          {
            url+="/user/"+this.props.user.id
          }
          io.socket.get( url,function (data) {
            console.log(data)
                 self.setState({
            results: data,
             currentPage: page-1,
            maxPages: self.props.count
         });
            
           
        });  
          //game?limit=2&skip=18
        }
    },
  setPage: function(index){
       
       window.scrollTo(0,0);
        
      //This should interact with the data source to get the page at the given index
      index = index > this.state.maxPages ? this.state.maxPages : index < 1 ? 1 : index + 1;
      this.getExternalData(index);
    },
    setPageSize: function(size){
    },
    render: function() {
      var games=this.props.games.map( (game,index) => {
          return (<div key={index}>1</div> );
      });
      return (
       <Griddle  externalSetPage={this.setPage} useCustomRowComponent={true} useGriddleStyles={false}  customRowComponent={OtherComponent}
       useExternal={true} externalSetPage={this.setPage} enableSort={false} 
        
        externalSetPageSize={this.setPageSize} externalMaxPage={this.state.maxPages}
        externalChangeSort={function(){}} externalSetFilter={function(){}}
        externalCurrentPage={this.state.currentPage} results={this.state.results}  resultsPerPage={this.state.externalResultsPerPage}
        externalSortColumn={this.state.externalSortColumn}  externalSortAscending={this.state.externalSortAscending} />
      );
     }
});
  export default LobbyView;

