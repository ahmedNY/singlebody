import React, { Component} from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';


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

class FloatingButton extends Component {

  render() {
    const {index, href, children, onClick, backgroundColor} = this.props
    return (
      <div>
        <FloatingActionButton style={fabStyle(index)} backgroundColor={backgroundColor} onClick={onClick}  href={href}>
          {children}
        </FloatingActionButton>
      </div>
    );
  }
}
export default FloatingButton;
