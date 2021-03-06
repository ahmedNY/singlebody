// Core
import React from "react";
import { withRouter } from 'react-router';
import { observer } from 'mobx-react';

// UI
import { Row, Col } from 'react-flexbox-grid';
import { Sticky } from 'react-sticky';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import Formsy from 'formsy-react';
import { FormsySelect, FormsyText } from 'formsy-material-ui/lib';
import { green500, grey500 } from 'material-ui/styles/colors';
import ActionDone from 'material-ui/svg-icons/action/done';

//Chip input
import Chip from 'material-ui/Chip';
import ChipInput from 'material-ui-chip-input'
import {blue300} from "material-ui/styles/colors"

// Project
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

@observer
class GroupsAddPage extends AuthorizedPage {

  constructor(props){
    super(props);

    this.state = {
      canSubmit : false,
    }

  }
  componentWillMount() {
    uiStore.mainHeaderVisible = false
  }
  componentDidMount() {
    store.getMinifiedRegisteredUsersList().then((_users) => {
      store.group.users = _users;
    })
  }

  componentWillUnmount() {
    uiStore.mainHeaderVisible = true
    store.reset();
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
    // let id = data.admin.value
    // data.admin = id;
    var adminIds = [];
    var usersList = store.group.users;
    console.log(data)
    var adminNames = store.group.adminNames;
    for (var i = 0; i < adminNames.length; i++) {
      var adminName = adminNames[i];
      var filteredList = usersList.filter((value) => value.name === adminName)
      if(filteredList.length === 1) {
        adminIds.push(filteredList[0].id)
      } else {
        console.log("Oops!", adminName)
        console.log(filteredList)
        console.log("usersList", usersList)
      }
    }
    data.admins = adminIds;
    console.log(data);

    store.addGroup(data).then(group => {
      this.props.router.push("groups");
    });

  }

  notifyFormError = (data) => {
    console.error('Form error:', data);
  }

  handleChange = (chips) => {
    store.group.adminNames = chips;
  }

  render() {
    const users = store.group.users.map( u => {
      return u.name
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
            <Col xs={12}>
              <FormsyText
                name="about"
                floatingLabelText="نبذة عن المجموعة"
                hintText="تحدث عن المجموعه يايجاز"
                multiLine={true}
                fullWidth={true}
              />
            </Col>

            <Col xs={12}>
            <ChipInput
              dataSource={users}
              onChange={this.handleChange}
              floatingLabelText="اختر مدراء المجموعة"
              fullWidth
              openOnFocus
              chipRenderer={({ value, isFocused, isDisabled, handleClick, handleRequestDelete }, key) => (
                <Chip
                  key={key}
                  style={{ margin: '8px 8px 0 0', float: 'left', pointerEvents: isDisabled ? 'none' : undefined }}
                  backgroundColor={isFocused ? blue300 : null}
                  onTouchTap={handleClick}
                >
                  {value}
                </Chip>
              )}/>

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
