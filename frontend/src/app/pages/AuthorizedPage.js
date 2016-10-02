import React from 'react';
// import RouteHandler from './RouteHandler';
import { AuthorizedComponent } from 'react-router-role-authorization';
import auth from "../stores/AuthStore"


class AuthorizedPage extends AuthorizedComponent {

  constructor(props) {
    super(props);
    this.userRoles = ["public"]; // not registed user
    if(auth.user)
      this.userRoles = auth.user.auth.roles.map(function(role){return role.name})
    this.notAuthorizedPath = '/restricted';
  }

}

export default AuthorizedPage;
