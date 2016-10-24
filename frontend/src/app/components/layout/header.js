import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import NavigationArrowForword from 'material-ui/svg-icons/navigation/arrow-forward';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionSearch from 'material-ui/svg-icons/action/search';
import {withRouter}  from 'react-router';
import auth from "../../stores/AuthStore";
import uiStore from "../../stores/UiStore";
import { observer } from "mobx-react";
import { Sticky } from 'react-sticky';
import { Grid, Row, Col} from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';

const titleStyle = {
  textDecoration: "none",
  color: "white"
}

// https://github.com/callemall/material-ui/issues/1594
const focusSearchInput = input => {
  if(input)
    input.focus();
};

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

  toggleSearchInput = () => {
    uiStore.searchInputVisible = !uiStore.searchInputVisible;
    // this.refs.nameInputField.focus()
  }

  render() {
    console.log(auth.userInfo);
    const isLogedIn = auth.isLogedIn;
    const jsx = (
      <div>
        <Sticky  style={{zIndex:20}}>
          <AppBar
          title={ !uiStore.searchInputVisible ? <a href="#/" style={titleStyle}>كالجسد الواحد</a> : null }
          iconElementLeft={
            uiStore.searchInputVisible ? 
            (<IconButton onClick={this.toggleSearchInput}><NavigationArrowForword /></IconButton>) 
            :
            (<IconButton onClick={this.toggleSideMenu}><NavigationMenu /></IconButton>)
          }
          iconElementRight={
            uiStore.searchInputVisible ? 
            (
              null
            ) :
            (
              <div>
                <IconButton onClick={this.toggleSearchInput.bind(this)}><ActionSearch color="white"/></IconButton>
                <IconMenu
                iconButtonElement={ <IconButton><MoreVertIcon color="white"/></IconButton>  }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                {!isLogedIn ? <MenuItem onClick={this.handleLogin.bind(this)} primaryText="تسجيل الدخول" /> : null}
                { isLogedIn ? <MenuItem href={"#/user/" + auth.user.id} primaryText={auth.user.name || auth.user.email} /> : null}
                { isLogedIn ? <MenuItem onClick={this.handleLogout.bind(this)} primaryText="تسجيل خروج" /> : null}
                </IconMenu>
              </div>
            )
          }
          >

           {uiStore.searchInputVisible ? 
                  <ActionSearch color="white" style={{marginTop: 22, marginRight: 20}}/>
              :null}
           {uiStore.searchInputVisible ? 
                  <TextField ref={focusSearchInput} style={{marginTop: 10}} hintText="ادخل اسم الحالة او نوعها او اسم المكان" fullWidth={true} inputStyle={{color:"white"}} hintStyle={{color: "rgba(255, 255, 255, .7)"}}/>
              :null}
          </AppBar>
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
