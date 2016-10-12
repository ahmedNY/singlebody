// Core
import React from "react";
import { withRouter } from 'react-router';
import { observer} from "mobx-react";
import mobx from "mobx";

// UI
import { Row, Col } from 'react-flexbox-grid';
import { Sticky } from 'react-sticky';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Formsy from 'formsy-react';
import { FormsySelect, FormsyText } from 'formsy-material-ui/lib';
import { green500, grey500 } from 'material-ui/styles/colors';
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionCancel from 'material-ui/svg-icons/action/delete';
import ContentClear from 'material-ui/svg-icons/content/clear';
import Avatar from 'material-ui/Avatar';

//Chip input
import Chip from 'material-ui/Chip';
import ChipInput from 'material-ui-chip-input'
import { blue300 } from "material-ui/styles/colors"

// Project

import PaperComponent from "../components/PaperComponent";
import uiStore from '../stores/UiStore';
import auth from '../stores/AuthStore';
import store from '../stores/GroupsStore';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import config from "../config";
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
    delIcon: {
      width: 10,
      height: 10,
    },
    delButton: {
      width: 10,
      height: 10,
    },
    imgForm: {
      cursor: 'pointer',
      position: 'absolute',
      top: '0',
      bottom: '0',
      right: '0',
      left: '0',
      width: '100%',
      opacity: '0'
    },
    imgStyle: {
      width: "95%",
      display: "block",
      maxHeight: 100,
    },
}

const backendUrl = config.backendUrl();

const errorMessages = {
    wordsError: "Please only use letters",
    numericError: "Please provide a number",
    urlError: "Please provide a valid URL",
}


@observer
class GroupsEditPage extends AuthorizedPage {

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
    store.getOneGroup(this.props.params.groupId).then(group => {
      if(this.validate(group)) {
        store.group.admins = group.admins.map(a => a.email)
        store.getMinifiedRegisteredUsersList(group.id).then((_users) => {
          store.group.users = _users;
        })
      }
    });
  }

// TODO : fix validate
  validate = (model) => {
    let authorized = false;
    console.log(model);
    for (var i = 0; i < model.admins.length; i++) {
      var admin = model.admins[i];
      if(admin.id === auth.user.id) {
        authorized = true;
      }
    }

    if(false) {
      this.context.router.push(this.notAuthorizedPath);
    }
    return true;
  }

  componentWillUnmount() {
    uiStore.mainHeaderVisible = true
    store.currentGroup = null;
  }

  imageChanged = (e) => {
    console.log(e.target.files[0])
    let reader = new FileReader();
    let file = e.target.files[0];

   reader.onloadend = () => {
     store.group.image = file;
     store.group.imagePreviewUrl = reader.result;
   }

   reader.readAsDataURL(file)
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
    var adminIds = [];
    var usersList = store.group.users;
    console.log(data)
    var adminNames = store.group.admins;
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
    var groupId = this.props.params.groupId
    store.updateGroup(groupId, data).then( () => {
      if(store.group.image) {
        // upload image
        store.uploadGroupImage(groupId, store.group.image).then(() => {
          this.props.router.push("groups");
        })
      }else {
        this.props.router.push("groups");
      }
    });

  }

  notifyFormError = (data) => {
    console.error('Form error:', data);
  }

  removeGroup = () => {
    if (confirm('هل حقا تريد حذف المجموعة؟')) {
      store.removeGroup(this.props.params.groupId).then(()=>{
        this.props.router.push("groups")();
      })
    }
  }

  handleAddChip = (chip) => {
    store.group.admins.push(chip);
  }

  handleDeleteChip = (admin) => {
    store.group.admins.remove(admin);
  }


  render() {

    let name, about, admin , imageUrl= "";
    if(store.currentGroup){
      name = store.currentGroup.name;
      about = store.currentGroup.about;
      admin = store.currentGroup.admin;
      imageUrl = store.currentGroup.imageUrl;
    }

    let adminName = "";
    if(admin) {
      if(admin.name){
        adminName = admin.name;
      }else (
        adminName = admin.email
      )
    }

    const usersOptions = store.group.users.map( u => {
      return u.name
    });

    let {imagePreviewUrl} = store.group;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (
      <CardMedia>
          <img style={styles.imgStyle} src={imagePreviewUrl} />
      </CardMedia>);
    } else
    if (imageUrl) {
      $imagePreview = (
      <CardMedia>
          <img style={styles.imgStyle} src={backendUrl + imageUrl} />
      </CardMedia>);
    }

    const toolbar = (
      <Sticky style={{zIndex:20}}>
      <Toolbar>

        <ToolbarGroup firstChild={true}>
          <IconButton
            onClick={this.removeGroup}
            iconStyle={styles.smallIcon}
            style={styles.small}>
              <ActionCancel color={grey500}/>
          </IconButton>
        </ToolbarGroup>

        <ToolbarGroup firstChild={false}>
          <ToolbarTitle text="تعديل مجموعة"/>
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
                value={name}
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
                value={about}
                floatingLabelText="نبذة عن المجموعة"
                hintText="تحدث عن المجموعه يايجاز"
                multiLine={true}
                fullWidth={true}
              />
            </Col>
            <Col xs={12}>
            <ChipInput
              dataSource={usersOptions}
              onChange={this.handleChange}
              onRequestAdd={(chip) => this.handleAddChip(chip)}
              onRequestDelete={(chip) => this.handleDeleteChip(chip)}
              value={ mobx.toJS(store.group.admins) }
              floatingLabelText="اختر مدراء المجموعة"
              fullWidth
              // openOnFocus
              chipRenderer={({ value, isFocused, isDisabled, handleClick, handleRequestDelete }, key) => (
                <div key={key}>
                <Chip
                  style={{paddingRight: 15 ,margin: '8px 8px 0 0', float: 'left', pointerEvents: isDisabled ? 'none' : undefined }}
                  backgroundColor={isFocused ? blue300 : null}
                  onTouchTap={handleClick}
                  // onRequestDelete={handleRequestDelete}
                >
                  {value}
                </Chip>

                <Avatar
                  onClick={handleRequestDelete}
                  size={20}
                  backgroundColor={grey500}
                  style={{ cursor: "pointer", margin: '15px -25px 0 0', float: 'left', pointerEvents: isDisabled ? 'none' : undefined }}
                  icon={<ContentClear/>}/>
                </div>
              )}/>
            </Col>

            <Col xs={12}>
              <Row middle="xs">
                <Col xs={7} sm={3}>
                  <br/>
                  <RaisedButton
                    containerElement='label'
                    label='اختر شعار المجموعة'>
                      <input type="file" onChange={this.imageChanged} name="image" style={styles.imgForm}/>
                  </RaisedButton>
                </Col>
                <Col xs={5} sm={3}>
                  <br/>
                  {$imagePreview}
                </Col>
              </Row>
            </Col>

            </Row>
          </Col>

        </PaperComponent>
      </Formsy.Form>
    );
  }
}

// PropTypes
GroupsEditPage.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

var decoratedComponent = withRouter(GroupsEditPage);
export default decoratedComponent
