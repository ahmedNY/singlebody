import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionSearch from 'material-ui/svg-icons/action/search';
import {withRouter}  from 'react-router';
import { observer } from "mobx-react";
import { Sticky } from 'react-sticky';
import { Grid, Row, Col} from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';

import auth from "../../stores/AuthStore";
import casesStore from "../../stores/CasesStore";
import uiStore from "../../stores/UiStore";
import TagInput from "../TagInput";


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

  searchTextChanged = (values) => {
    console.log(values);
  }

  render() {
    console.log(auth.userInfo);
    const isLogedIn = auth.isLogedIn;
    const loginMenu = (
      <div>
        {uiStore.showSearchIcon ? <IconButton onClick={this.toggleSearchInput.bind(this)}><ActionSearch color="white"/></IconButton> : null}
        
        <IconMenu
        iconButtonElement={ <IconButton><MoreVertIcon color="white"/></IconButton>  }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
        {!isLogedIn ? <MenuItem onClick={this.handleLogin.bind(this)} primaryText="تسجيل الدخول" /> : null}
        { isLogedIn ? <MenuItem href={"#/user/" + auth.user.id} primaryText={auth.user.name || auth.user.email} /> : null}
        { isLogedIn ? <MenuItem onClick={this.handleLogout.bind(this)} primaryText="تسجيل خروج" /> : null}
        </IconMenu>
      </div>);

    const jsx = (
      <div>
        <Sticky  style={{zIndex:20}}>
          <AppBar
            title={ <a href="#/" style={titleStyle}>كالجسد الواحد</a> }
            onLeftIconButtonTouchTap={this.toggleSideMenu} 
            iconElementRight={ loginMenu }
          />
        {uiStore.searchInputVisible ? (
          <Row around="xs" style={{backgroundColor:"#FFFFFF"}}>
          <Col xs={12} sm={6} md={3}>
          <TagInput
          onChange={casesStore.filterCases}
          hintText="ادخل كلمات البحث"
          fullWidth/>
          </Col>
          </Row>
        ) : null}
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
