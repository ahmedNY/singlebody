import React, { Component, PropTypes} from 'react';
import { observer } from 'mobx-react';
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

@observer
class FloatingButton extends RoleAwareComponent {
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
    }else {
      this.userRoles = []
    }

    const {index, href, children, onClick, backgroundColor} = this.props
    const jsx = (
      <div>
        <FloatingActionButton style={fabStyle(index)} backgroundColor={backgroundColor} onClick={onClick}  href={href}>
          {children}
        </FloatingActionButton>
      </div>
    );

    return (this.rolesMatched() && this.owned) ? jsx : null;
  }
}

FloatingButton.propTypes = {
  allowedRoles: PropTypes.array
}

export default FloatingButton;
