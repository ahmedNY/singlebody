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

import { StickyContainer } from 'react-sticky';
import SideMenu from "./components/layout/SideMenu";

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
          <SideMenu/>
          <StickyContainer>
            <Header/>
            {this.props.children}
            <LoginDialog/>
          </StickyContainer>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
