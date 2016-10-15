import React, { Component, PropTypes} from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';

import { RoleAwareComponent } from 'react-router-role-authorization';

import auth from '../stores/AuthStore'

@observer
class AuthorizedComponent extends RoleAwareComponent {
  constructor(props) {
    super(props);

    // Authenticatoin
    this.allowedRoles = this.props.allowedRoles;
    this.userRoles = [];
  }

  check() {
    const { action, model, dataModel } = this.props;
    console.log("ACTION :", action)
    console.log("MODEL :", model)

    if(!action && !model) {
      console.log("Roles based authenticatoin");
      return true;
    }
    if(!dataModel.id) {
      return false;
    }
    let authorized = false;
    // get the model permissions
    const modelPermissions = toJS(auth.user.permissions).find( p => p.model === model);

    if(modelPermissions.role) {
      // role permission
      for (let i = 0; i < modelPermissions.role.length; i++) {
        const allowedActions = modelPermissions.role[i];
        if(allowedActions.indexOf(action) > -1) {
          authorized = true;
          console.log(auth.user.email + " has role permission to " + action + " " + model)
        }
      }
    }

    // group permission
    if(modelPermissions.group) {
      console.log("Checking group permission")
      for (let i = 0; i < modelPermissions.group.length; i++) {
        const allowedActions = modelPermissions.group[i];
        if(allowedActions.indexOf(action) > -1) {
          // check the user has the access to object group
          authorized = auth.user.group === dataModel.group.id;
          console.log("auth.user.group", auth.user.group)
          console.log("dataModel.group", dataModel.group.id)
          console.log(auth.user.email + " has group permission to " + action + " " + model)
        }
      }
    }
    // owner permission
    if(modelPermissions.owner) {
      for (let i = 0; i < modelPermissions.owner.length; i++) {
        const allowedActions = modelPermissions.owner[i];
        if(allowedActions.indexOf(action) > -1) {
          // check the user is an owner of object
          authorized = auth.user.id === dataModel.owner;
          console.log(auth.user.email + " has owner permission to " + action + " " + model)
        }
      }
    }
    // user permission
    if(modelPermissions.user) {
      for (let i = 0; i < modelPermissions.user.length; i++) {
        const allowedActions = modelPermissions.user[i];
        if(allowedActions.indexOf(action) > -1) {
          // check the user has the access to object group
          authorized = true;
          console.log(auth.user.email + " has user permission to " + action + " " + model)
        }
      }
    }

    return authorized;
  }

  render() {
    if(auth.user){
      this.userRoles = auth.user.roles;
    } else {
      this.userRoles = []
    }
    return (this.rolesMatched() && this.check()) ? this.props.children : null;
  }
}

//TODO: removed
AuthorizedComponent.propTypes = {
  allowedRoles: PropTypes.array
}

export default AuthorizedComponent;
