import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { observer } from 'mobx-react';
import Formsy from 'formsy-react';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
    FormsySelect, FormsyText, FormsyTime, FormsyToggle } from 'formsy-material-ui/lib';
import { Row } from 'react-flexbox-grid';
import PaperComponent from '../components/PaperComponent';


import store from '../stores/CasesStore.js'
import auth from "../stores/AuthStore";

import LoginForm from "../components/LoginForm";


const errorMessages = {
    wordsError: "Please only use letters",
    numericError: "Please provide a number",
    urlError: "Please provide a valid URL",
}

const styles = {
    paperStyle: {
      // width: "100%",
      // margin: 'auto',
      padding: 20,
      marginTop: 20,
      // maxWidth: "400px"
    },
    switchStyle: {
      marginBottom: 16,
    },
    submitStyle: {
      marginTop: 32,
    },
}

@observer
class LoginPage extends Component {

   constructor(props) {
      super(props);
      this.state = {
          canSubmit: false,
      }
   }


  loginRegister = () => {
    auth.loginRegister(auth.loginModel.username, auth.loginModel.password).then( () => {
      this.props.router.replace(this.props.location.state.nextPathname)

    });
  }

  notifyFormError(data) {
    console.error('Form error:', data);
  }

  loginWithFacebook = () =>{
    auth.loginWithFacebook().then(() => {
      this.props.router.replace(this.props.location.state.nextPathname)
    });
  }

  render() {
    const {paperStyle, switchStyle, submitStyle } = styles;
    const { isRegister, notMatchedPasswordMessage, isValidForm} = auth.loginModel;

    return (
              <PaperComponent size="small">
                  <LoginForm loginModel={auth.loginModel} />
                  <br/>
                  <Row end="xs">
                    <FlatButton
                      label={isRegister ? "اشترك" :"تسجيل الدخول"}
                      primary={true}
                      onTouchTap={this.loginRegister}
                      disabled={!isValidForm}
                    />
                    <FlatButton
                      label={isRegister ? "اشتراك بالفيسبوك" : "تسجيل الدخول بالفيسبوك"}
                      primary={true}
                      onTouchTap={this.loginWithFacebook}
                    />
                  </Row>
              </PaperComponent>
    );
  }
};

// PropTypes
LoginPage.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

var decoratedComponent = withRouter(LoginPage);
export default decoratedComponent
