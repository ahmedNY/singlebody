import { observer } from "mobx-react";
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import auth from "../stores/AuthStore";
import LoginForm from "./LoginForm";

const customContentStyle = {
  width: '100%',
  maxWidth: 400,
  height: 300,
  minHeight: 300,
};

/**
 * The dialog width has been set to occupy the full width of browser through the `contentStyle` property.
 */
@observer
export default class LoginDialog extends React.Component {
  state = {
    open: false,
  };

  handleClose = () => {
    auth.loginModel.visible = false
  };

  loginRegister = () => {
    auth.loginRegister(auth.loginModel.username, auth.loginModel.password).then(()=>{
      auth.loginModel.visible = false;
      auth.loginModel.isRegister = false;
    });
  }

  loginWithFacebook = () =>{
    auth.loginWithFacebook();
  }

  render() {
    const { isRegister } = auth.loginModel;
    const actions = [
      <FlatButton
        label={isRegister ? "اشترك" :"تسجيل الدخول"}
        primary={true}
        onTouchTap={this.loginRegister}
      />,
      <FlatButton
        label={isRegister ? "اشتراك بالفيسبوك" : "تسجيل الدخول بالفيسبوك"}
        primary={true}
        onTouchTap={this.loginWithFacebook}
      />
    ];

    return (
      <div>
        <Dialog
          actions={actions}
          modal={true}
          contentStyle={customContentStyle}
          open={auth.loginModel.visible && !auth.isLogedIn}
          modal={false}
          onRequestClose={this.handleClose}
          autoDetectWindowHeight={false}
          // autoScrollBodyContent={true}
        >
          <LoginForm loginModel={auth.loginModel}/>
        </Dialog>
      </div>
    );
  }
}
