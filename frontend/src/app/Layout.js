/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';

import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from "./components/layout/header.js"
import LoginDialog from "./components/LoginDialog"

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
  isRtl: true
});

class Main extends Component {

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
            <Header/>
            {this.props.children}
            <LoginDialog/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
