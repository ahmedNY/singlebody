import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {withRouter}  from 'react-router';
import auth from "../../stores/AuthStore";
import uiStore from "../../stores/UiStore";
import { observer } from "mobx-react";
import { Sticky } from 'react-sticky';

const titleStyle = {
  textDecoration: "none",
  color: "white"
}

@observer
class Header extends Component {
  handleLogout = (e) => {
    auth.logout();
    this.props.router.push("/");
  }

  handleLogin = () => {
    auth.openLoginDialog()
  }

  testAuth = () => {
    auth.test()
  }



  render() {
    console.log(auth.userInfo);
    const isLogedIn = auth.isLogedIn;
    const jsx = (
      <Sticky  style={{zIndex:20}}>
        <AppBar
        title={ <a href="#/" style={titleStyle}>كالجسد الواحد</a> }
        iconElementRight={
          <IconMenu
          iconButtonElement={
            <IconButton><MoreVertIcon /></IconButton>
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
          <MenuItem primaryText="انعاش" />
          <MenuItem primaryText="مساعده" />
          <MenuItem onClick={this.testAuth.bind(this)}primaryText="test" />
          {!isLogedIn ? <MenuItem onClick={this.handleLogin.bind(this)} primaryText="تسجيل الدخول" /> : null}
          { isLogedIn ? <MenuItem onClick={this.handleLogout.bind(this)} primaryText="تسجيل خروج" /> : null}
          </IconMenu>
        }
        />
      </Sticky>
    )

    return uiStore.mainHeaderVisible ? jsx : null;
  }
}



// PropTypes
Header.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

var decoratedComponent = withRouter(Header);
export default decoratedComponent
