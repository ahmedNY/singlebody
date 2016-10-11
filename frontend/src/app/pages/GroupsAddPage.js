// Core
import React from "react";
import { withRouter } from 'react-router';

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
import AuthorizedPage from "./AuthorizedPage";

const styles = {
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


class GroupsAddPage extends AuthorizedPage {

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
      this.props.router.push("groups");
    });
  }

  notifyFormError = (data) => {
    console.error('Form error:', data);
  }

  render() {
    const usersOptions = this.state.users.map( u => {
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

// PropTypes
GroupsAddPage.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

var decoratedComponent = withRouter(GroupsAddPage);
export default decoratedComponent
