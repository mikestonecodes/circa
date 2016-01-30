'use strict';
import React from 'react';
import Reflux from 'reflux';
import TimerStore from '../shared/TimerStore';

  const TimerView = React.createClass({
    mixins: [Reflux.connect(TimerStore, 'timerstore')],
    getInitialState: function(){ return { timerstore:{},} },
    render: function() {
      return <div id='timer'>{this.state.timerstore.timer}</div>
    }
});
  export default TimerView;

