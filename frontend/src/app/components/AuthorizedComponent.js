import React, { Component, PropTypes} from 'react';
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
    this.owned = true;
  }

  render() {
    if(auth.user){
      this.userRoles = auth.user.roles;
      if(this.props.owner !== undefined){
        this.owned = this.props.owner == auth.user.id;
      }
    } else {
      this.userRoles = []
    }

    return (this.rolesMatched() && this.owned) ? this.props.children : null;
  }
}

AuthorizedComponent.propTypes = {
  allowedRoles: PropTypes.array
}

export default AuthorizedComponent;
