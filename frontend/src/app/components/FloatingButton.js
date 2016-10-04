import React, {Component} from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { RoleAwareComponent } from 'react-router-role-authorization';

import auth from '../stores/AuthStore'


function fabStyle (index=1) {
  let bottom = ((index-1) * 60) + 20
  return {
    margin: 0,
    top: 'auto',
    right: 5,
    bottom: bottom,
    left: 'auto',
    position: 'fixed',
  }
};

export default class FloatingButton extends RoleAwareComponent {
  constructor(props) {
    super(props);

    // Authenticatoin
    this.allowedRoles = ['admin'];
    this.userRoles = auth.user.auth.roles.map(function(role){return role.name});
  }

  render() {
    const {index, href, children, onClick, backgroundColor} = this.props
    const jsx = (
      <div>
        <FloatingActionButton style={fabStyle(index)} backgroundColor={backgroundColor} onClick={onClick}  href={href}>
          {children}
        </FloatingActionButton>
      </div>
    );

    return this.rolesMatched() ? jsx : null;
  }
}
