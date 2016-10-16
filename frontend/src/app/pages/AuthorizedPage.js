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
    let authorized = false;

    // get the model permissions
    const modelPermissions = toJS(auth.user.permissions).find( p => p.model === this.model);

    if(!modelPermissions) {
      return false;
    }

    if(modelPermissions.role) {
      console.log("Checking role permission")
      // role permission
      let modelAction = modelPermissions.role.find( action => action === this.action);
      authorized = ((modelAction !== null) && (modelAction !== undefined));
      if(authorized) {
        console.log("permitted by role");
        return authorized;
      }
    }

    // group permission
    if(modelPermissions.group) {
      console.log("Checking group permission")
      let modelAction = modelPermissions.group.find( action => action === this.action);
      // custom authentication avilable
      if(modelAction) {
        if(this.authByGroup) {
          authorized = this.authByGroup(auth.user.group)
        }
        else {
          // check the user has the access to object group
          authorized = auth.user.group === dataModel.group.id;
        }
      }
      if(authorized) {
        console.log(auth.user.email + " has group permission to " + this.action + " " + this.model)
        return authorized;
      }
    }

    // owner permission
    if(modelPermissions.owner) {
      let modelAction = modelPermissions.owner.find( action => action === this.action);
      if(modelAction){
        authorized = auth.user.id === dataModel.owner;
        if(authorized) {
          console.log(auth.user.email + " has owner permission to " + this.action + " " + this.model)
          return authorized;
        }
      }
    }

    // user permission
    if(modelPermissions.user) {
      let modelAction = modelPermissions.user.find( action => action === this.action);
      if(modelAction){
        authorized = true;
        if(authorized) {
          console.log(auth.user.email + " has user permission to " + this.action + " " + this.model)
          return authorized;
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
