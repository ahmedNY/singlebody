import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import uiStore from "../../stores/UiStore";
import { observer } from 'mobx-react';
import header from "./header"
import AppBar from 'material-ui/AppBar';
import { cyan500 } from 'material-ui/styles/colors';

import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import SocialGroup from 'material-ui/svg-icons/social/group';
import ActionUrgent from 'material-ui/svg-icons/action/hourglass-empty';
import Avatar from 'material-ui/Avatar';
import AuthorizedComponent from "../AuthorizedComponent";

import auth from "../../stores/AuthStore";

@observer
export default class SideMenu extends React.Component {

  constructor(props) {
    super(props);
  }

  close = () => {
    uiStore.sideMenuVisible = false;
  }
  render() {
    let userGroupId;
    if(auth.user) {
      userGroupId = auth.user.group;
    }
    return (
      <div>
        <Drawer
          docked={false}
          // width={300}
          open= {uiStore.sideMenuVisible}
          onRequestChange={(open) => uiStore.sideMenuVisible = open}
        >
          <AppBar title="كالجسد الواحد"  onLeftIconButtonTouchTap={this.close}/>
          {/* <div style={{backgroundColor: cyan500, padding: 10}}>
            <Avatar size={100} src="img/face.jpg" />

            <p style={{color: "#FFFFFF"}}>
            Ahmed Nabil
            <br/>
            ahmed.n.yagoub@gmail.com</p>

          </div> */}
          <MenuItem onClick={this.close}
            leftIcon={<ActionUrgent />}
            href="#/">الحالات المستعجله</MenuItem>
          <MenuItem onClick={this.close}
            leftIcon={<ActionFavorite />}
            href="#/donations">تبرعاتك</MenuItem>

          <AuthorizedComponent allowedRoles={["admin"]}>
            <MenuItem onClick={this.close}
            leftIcon={<SocialGroup />}
            href="#/groups">االمجموعات</MenuItem>
          </AuthorizedComponent>

          <AuthorizedComponent allowedRoles={["groupAdmin"]}>
            <MenuItem onClick={this.close}
            leftIcon={<SocialGroup />}
            href={"#/groups/edit/" + userGroupId}>اعدادت المجموعة</MenuItem>
          </AuthorizedComponent>

        </Drawer>
      </div>
    );
  }
}
