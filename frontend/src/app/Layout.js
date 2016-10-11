/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import { observer } from "mobx-react";
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from "./components/layout/header.js"
import LoginDialog from "./components/LoginDialog"

import { StickyContainer } from 'react-sticky';
import SideMenu from "./components/layout/SideMenu";
import CircularProgress from 'material-ui/CircularProgress';
import { Row, Col } from 'react-flexbox-grid';

import uiStore from './stores/UiStore'


const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
  isRtl: true
});

const style = {
  zIndex:10,
  position:"fixed",
  padding:0,
  margin:0,
  top:0,
  left:0,
  width: "100%",
  height: "100%",
  background:"#FFFFFF",
}

@observer
class Main extends Component {

  render() {
    const loading = (
      <div style={style}>
        <Row center="xs">
          <CircularProgress style={{paddingTop:100}} />
        </Row>
      </div>
    );
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <SideMenu/>

          <StickyContainer>

            {/* Main app header */}
            <Header/>

              {/* Show either loding component or childrens */}
              {this.props.children}
             { uiStore.isLoading ? loading : null }
             {/* Hidden Login dialog */}
            <LoginDialog/>

          </StickyContainer>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
