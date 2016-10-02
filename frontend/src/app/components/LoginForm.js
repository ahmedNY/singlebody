import { observer } from "mobx-react";
import React from 'react';
import auth from "../stores/AuthStore";
import TextField from 'material-ui/TextField';


/**
 * The dialog width has been set to occupy the full width of browser through the `contentStyle` property.
 */
@observer
export default class LoginDialog extends React.Component {

  onChange(e){
    this.props.loginModel[e.target.id] = e.target.value
  }

  render() {

    return (
      <div>
        <h2>تسجيل الدخول</h2>
        <TextField
              id="username"
              floatingLabelText="البريد الالكنروني"
              floatingLabelFixed={true}
              fullWidth={true}
              onChange={this.onChange.bind(this)}
            /><br />
        <TextField
              id="password"
              type="password"
              floatingLabelText="كلمة المرور"
              floatingLabelFixed={true}
              fullWidth={true}
              onChange={this.onChange.bind(this)}
            />
      </div>
    );
  }
}