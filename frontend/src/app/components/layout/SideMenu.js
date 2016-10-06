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
import ActionUrgent from 'material-ui/svg-icons/action/hourglass-empty';
import Avatar from 'material-ui/Avatar';

@observer
export default class SideMenu extends React.Component {

  constructor(props) {
    super(props);
  }

  close = () => {
    uiStore.sideMenuVisible = false;
  }
  render() {
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
        </Drawer>
      </div>
    );
  }
}