// Core
import React from "react";
import { withRouter } from 'react-router';
import { observer} from "mobx-react";

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

// Project
import FormsyAutocomplete from "../components/FormsyAutocomplete";
import PaperComponent from "../components/PaperComponent";
import uiStore from '../stores/UiStore';
import auth from '../stores/AuthStore';
import store from '../stores/GroupsStore';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import config from "../config";
import AuthorizedPage from "./AuthorizedPage";

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
      // maxWidth: 100,
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
      users: [],
      image: null,
      imagePreviewUrl: null
    }

  }
  componentWillMount() {
    uiStore.mainHeaderVisible = false
  }

  componentDidMount() {
    store.getOneGroup(this.props.params.groupId).then(group => {
      if(this.validate(group)) {
        auth.getUsersList().then((_users) => {
          this.setState({users: _users})
        })
      }
    });
  }

  validate = (model) => {
    let authorized = false;
    console.log("model.admin.id:" + model.admin.id)
    console.log("auth.user.id  : " + auth.user.id)
    authorized = model.admin.id === auth.user.id;
    if(!authorized) {
      this.context.router.push(this.notAuthorizedPath);
    }
    return authorized;
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
     this.setState({
       image: file,
       imagePreviewUrl: reader.result
     });
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
    if(typeof data.admin === "object"){
      let id = data.admin.value
      data.admin = id;
    }
    // console.log(data);
    store.updateGroup(this.props.params.groupId, data)
    .then((group) => {
      console.log("Group added succesfully :)")
      if(this.state.image){
        store.uploadGroupImage(group.data.id, this.state.image)
        console.log("image uploaded succesfully :)")
        this.props.router.push("groups");
      }
      this.props.router.push("groups");
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

    const usersOptions = this.state.users.map( u => {
      return {text: u.name, value: u.id}
    });

    let {imagePreviewUrl} = this.state;
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
            <Col sm={12} xs={12}>
              <FormsyText
                name="about"
                value={about}
                floatingLabelText="نبذة عن المجموعة"
                hintText="تحدث عن المجموعه يايجاز"
                multiLine={true}
                fullWidth={true}
              />
            </Col>
            <Col sm={12} xs={12}>
              <FormsyAutocomplete
                name="admin"
                value={admin ? admin.id : -1}
                floatingLabelText="مدير المجموعة"
                required
                options={usersOptions}
                searchText={adminName}
              />
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
