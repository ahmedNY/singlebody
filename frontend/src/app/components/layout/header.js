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

  toggleSideMenu = () => {
    uiStore.sideMenuVisible = true;
    console.log('Opnening sidne mdoe')
  }

  render() {
    console.log(auth.userInfo);
    const isLogedIn = auth.isLogedIn;
    const jsx = (
      <div>
        <Sticky  style={{zIndex:20}}>
          <AppBar
          onLeftIconButtonTouchTap={this.toggleSideMenu}
          title={ <a href="#/" style={titleStyle}>كالجسد الواحد</a> }
          iconElementRight={
            <IconMenu
            iconButtonElement={
              <IconButton><MoreVertIcon /></IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
            {!isLogedIn ? <MenuItem onClick={this.handleLogin.bind(this)} primaryText="تسجيل الدخول" /> : null}
            { isLogedIn ? <MenuItem href={"#/user/" + auth.user.id} primaryText={auth.user.name || auth.user.email} /> : null}
            { isLogedIn ? <MenuItem onClick={this.handleLogout.bind(this)} primaryText="تسجيل خروج" /> : null}
            </IconMenu>
          }
          />
        </Sticky>
      </div>
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
