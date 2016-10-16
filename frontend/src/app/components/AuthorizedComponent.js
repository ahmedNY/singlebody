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
      console.log("datamodel not provided");
      return false;
    }

    let authorized = false;
    // get the model permissions
    const modelPermissions = toJS(auth.user.permissions).find( p => p.model === model);

    if(modelPermissions.role) {
      console.log("Checking role permission")
      // role permission
      let modelAction = modelPermissions.role.find( a => a === action);
      authorized = ((modelAction !== null) && (modelAction !== undefined));
      if(authorized) {
        console.log("permitted by role")
        return authorized;
      }
    }

    // group permission
    if(modelPermissions.group) {
      console.log("Checking group permission")
      let modelAction = modelPermissions.group
        .find( a => a === action);
      // custom authentication avilable
      if(modelAction) {
          // check the user has the access to object group
          authorized = auth.user.group === dataModel.group.id;
          if(authorized) {
            console.log(auth.user.email + " has group permission to " + action + " " + this.model)
            return authorized;
          }
      }
    }
    // owner permission
    if(modelPermissions.owner) {
      let modelAction = modelPermissions.owner.find( a => a === action);
      if(modelAction){
        authorized = auth.user.id === dataModel.owner;
        if(authorized) {
          console.log(auth.user.email + " has owner permission to " + action + " " + this.model)
          return authorized;
        }
      }
    }

    // user permission
    if(modelPermissions.user) {
      let modelAction = modelPermissions.user.find( a => a === action);
      if(modelAction){
        authorized = true;
        if(authorized) {
          console.log(auth.user.email + " has user permission to " + action + " " + this.model)
          return authorized;
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
