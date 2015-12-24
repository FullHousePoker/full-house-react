window.$ = window.jQuery = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({

  componentDidMount: function() {
    $.getJSON('http://jzs-macbook.local:8080/games')
     .done(data => {
       console.log(data);
     })
  },

  render: function() {
    return <div>hello poeple</div>;
  }
});

ReactDOM.render(<App />, document.getElementById('content'));