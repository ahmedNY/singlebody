import { observer } from "mobx-react";
import React from 'react';
import auth from "../stores/AuthStore";
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


/**
 * The dialog width has been set to occupy the full width of browser through the `contentStyle` property.
 */
@observer
export default class LoginDialog extends React.Component {

  onChange(e){
    this.props.loginModel[e.target.id] = e.target.value
  }

  toggleMode = () => {
    this.props.loginModel.isRegister = !this.props.loginModel.isRegister;
    this.props.loginModel.isValidForm = false;
    this.props.loginModel.password = null;
    this.props.loginModel.confimPassword = null;
  }

  validateForm = () => {
    this.props.loginModel.isValidForm = true;
    const {username, password, confirmPassword , isRegister} = this.props.loginModel;
    if(isRegister) {
      if(password !== confirmPassword) {
        this.props.loginModel.notMatchedPasswordMessage = "كلمة المرور ليست مطابقة !"
        this.props.loginModel.isValidForm = false;
      }else {
        this.props.loginModel.notMatchedPasswordMessage = null;
      }
    }

    if(username === null || password === null || username === "" || password === "") {
      this.props.loginModel.isValidForm = false;
    }
  }
  passwordChanged = (e) => {
    this.onChange(e);
    this.validateForm();
  }
  render() {
    const {isRegister, password, confirmPassword,
      notMatchedPasswordMessage, isValidForm} = this.props.loginModel;
    return (
      <div>
        {this.props.loginModel.isRegister === false ?
          <h2>تسجيل الدخول</h2> :
          <h2>عمل اشتراك جديد</h2> }
        <TextField
              id="username"
              floatingLabelText="البريد الالكنروني"
              floatingLabelFixed={true}
              fullWidth={true}
              onChange={this.onChange.bind(this)}
              onBlur={this.validateForm}
            /><br />
        <TextField
              id="password"
              type="password"
              floatingLabelText="كلمة المرور"
              floatingLabelFixed={true}
              fullWidth={true}
              onChange={this.passwordChanged}
            />
        {!isRegister ? null :
          <TextField
                id="confirmPassword"
                type="password"
                floatingLabelText="تاكيد كلمة المرور"
                floatingLabelFixed={true}
                fullWidth={true}
                onChange={this.passwordChanged.bind(this)}
                errorText={notMatchedPasswordMessage}
                />
          }
          <RaisedButton
            label={isRegister ? "انا عندي اشتراك" : "انت ما مشترك !!"}
            primary={!isRegister}
            onClick={this.toggleMode.bind(this)}/>
      </div>
    );
  }
}
