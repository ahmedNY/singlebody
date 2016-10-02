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

import { Grid, Row, Col} from 'react-flexbox-grid';

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
      this.login = this.login.bind(this)
   }


  login() {
    auth.login(auth.loginModel.username, auth.loginModel.password).then( () => {
      this.props.router.replace(this.props.location.state.nextPathname)

    });
  }

  notifyFormError(data) {
    console.error('Form error:', data);
  }



  render() {
    const {paperStyle, switchStyle, submitStyle } = styles;
    const { wordsError, numericError, urlError } =    errorMessages;

    return (
        <Grid>
          <Row center="xs">
            <Col xs={12} sm={4}>
              <Paper style={styles.paperStyle} zDepth={4}>
                  <LoginForm loginModel={auth.loginModel} />
                  <br/>
                  <Row end="xs">
                    <FlatButton
                      label="تسجيل الدخول"
                      primary={true}
                      onTouchTap={this.login}
                    />
                  </Row>
              </Paper>
            </Col>
          </Row>
        </Grid>
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