import React from 'react';
// import RouteHandler from './RouteHandler';
import { AuthorizedComponent } from 'react-router-role-authorization';
import auth from "../stores/AuthStore"
import {observer} from "mobx-react";
import {toJS} from "mobx";

let checked = false;

@observer
class AuthorizedPage extends AuthorizedComponent {

  constructor(props) {
    super(props);
    this.model = null;
    this.userRoles = ["public"]; // not registed user
    if(auth.user)
      this.userRoles = auth.user.roles;
    this.notAuthorizedPath = '/restricted';
  }

  denyAccess = () => {
    this.context.router.push(this.notAuthorizedPath);
  }

  check = (dataModel) => {
    console.log("ACTION :", this.action)
    console.log("MODEL :", this.model)

    let authorized = false;
    // get the model permissions
    const modelPermissions = toJS(auth.user.permissions).find( p => p.model === this.model);

    if(!modelPermissions) {
      return false;
    }

    if(modelPermissions.role) {
      // role permission
      for (let i = 0; i < modelPermissions.role.length; i++) {
        const allowedActions = modelPermissions.role[i];
        if(allowedActions.indexOf(this.action) > -1) {
          authorized = true;
          console.log(auth.user.email + " has role permission to " + this.action + " " + this.model)
        }
      }
    }
    // group permission
    if(modelPermissions.group) {
      console.log("Checking group permission")
      for (let i = 0; i < modelPermissions.group.length; i++) {
        const allowedActions = modelPermissions.group[i];
        if(allowedActions.indexOf(this.action) > -1) {
          if(this.authByGroup){
            authorized = this.authByGroup(auth.user.group)
          }else{
            // check the user has the access to object group
            authorized = auth.user.group === dataModel.group.id;
          }
          console.log(auth.user.email + " has group permission to " + this.action + " " + this.model)
        }
      }
    }
    // owner permission
    if(modelPermissions.owner) {
      for (let i = 0; i < modelPermissions.owner.length; i++) {
        const allowedActions = modelPermissions.owner[i];
        if(allowedActions.indexOf(this.action) > -1) {
          // check the user is an owner of object
          authorized = auth.user.id === dataModel.owner;
          console.log(auth.user.email + " has owner permission to " + this.action + " " + this.model)
        }
      }
    }
    // user permission
    if(modelPermissions.user) {
      for (let i = 0; i < modelPermissions.user.length; i++) {
        const allowedActions = modelPermissions.user[i];
        if(allowedActions.indexOf(this.action) > -1) {
          // check the user has the access to object group
          authorized = true;
          console.log(auth.user.email + " has user permission to " + this.action + " " + this.model)
        }
      }
    }

    if(!authorized) {
      this.denyAccess()
    }

    return authorized;
  }

}

export default AuthorizedPage;
