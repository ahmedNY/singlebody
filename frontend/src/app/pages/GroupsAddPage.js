// Core
import React from "react";
// UI
import { Row, Col } from 'react-flexbox-grid';
import { Sticky } from 'react-sticky';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Formsy from 'formsy-react';
import { FormsySelect, FormsyText } from 'formsy-material-ui/lib';
import { green500, grey500 } from 'material-ui/styles/colors';
import ActionDone from 'material-ui/svg-icons/action/done';


// Project
import FormsyAutocomplete from "../components/FormsyAutocomplete";
import PaperComponent from "../components/PaperComponent";
import uiStore from '../stores/UiStore';
import auth from '../stores/AuthStore';
import store from '../stores/GroupsStore';

const styles = {
    // paperStyle: {
    //   padding: 20,
    //   marginTop: 20,
    // },
    // switchStyle: {
    //   marginBottom: 16,
    // },
    // submit: {
    //   marginTop: 32,
    // },
    // form: {
    //   width: "100%"
    // },
    smallIcon: {
      width: 30,
      height: 30,
    },
    smallButton: {
      width: 60,
      height: 60,
    },
}

const errorMessages = {
    wordsError: "Please only use letters",
    numericError: "Please provide a number",
    urlError: "Please provide a valid URL",
}


export default class GroupsAddPage extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      canSubmit : false,
      users: []
    }

  }
  componentWillMount() {
    uiStore.mainHeaderVisible = false
  }
  componentDidMount() {
    auth.getUsersList().then((_users) => {
      this.setState({users: _users})
    })
  }

  componentWillUnmount() {
    uiStore.mainHeaderVisible = true
  }

  enableButton = () => {
    this.setState({
      canSubmit: true,
    });
  }

  disableButton = () => {
    this.setState({
      canSubmit: false,
    });
  }

  submitForm = (data) => {
    let id = data.admin.value
    data.admin = id;
    console.log(data);
    store.addGroup(data).then(group => {
      console.log("Group added succesfully :)")
    });
  }

  notifyFormError = (data) => {
    console.error('Form error:', data);
  }

  formChanged = (values) => {
  }


  render() {
    const usersOptions = this.state.users.map( u => {
      console.log(u.id)
      return {text: u.name, value: u.id}
    })
    const toolbar = (
      <Sticky style={{zIndex:20}}>
      <Toolbar>
        <ToolbarGroup firstChild={false}>
          <ToolbarTitle text="اضافة مجموعة"/>
        </ToolbarGroup>

        <ToolbarGroup lastChild={true}>
          <IconButton
            type="submit"
            iconStyle={styles.smallIcon}
            disabled={!this.state.canSubmit}
            style={styles.small}>
              <ActionDone color={green500} />
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
      </Sticky>
    );

    return (
      <Formsy.Form
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        onValidSubmit={this.submitForm}
        onInvalidSubmit={this.notifyFormError}
        onChange={this.formChange}
        style={styles.form}
      >
        {toolbar}
        <PaperComponent>
          <Col>
            <Row>
            <Col sm={6} xs={12}>
              <FormsyText
                name="name"
                floatingLabelText="اسم المجموعة"
                hintText="أدخل اسم المجموعة"
                validations={{minLength:5, maxLength:25}}
                validationError={errorMessages.wordsError}
                required
              />
            </Col>
            <Col sm={12} xs={12}>
              <FormsyText
                name="about"
                floatingLabelText="نبذة عن المجموعة"
                hintText="تحدث عن المجموعه يايجاز"
                validations={{minLength:5, maxLength:255}}
                validationError={errorMessages.wordsError}
                required
                multiLine={true}
                fullWidth={true}
              />
            </Col>
            <Col sm={6} xs={12}>
              <FormsyAutocomplete
                name="admin"
                floatingLabelText="مدير المجموعة"
                required
                options={usersOptions}
              />
            </Col>
            </Row>
          </Col>

        </PaperComponent>
      </Formsy.Form>
    );
  }
}
