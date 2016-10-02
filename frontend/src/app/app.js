import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Router from "./Router"

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()
// console.log(ReactDom);

ReactDom.render( <Router/> , document.getElementById('app'))
