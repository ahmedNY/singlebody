
import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import ContentClear from 'material-ui/svg-icons/content/clear';
import { grey500, blue300 } from 'material-ui/styles/colors';
import ChipInput from 'material-ui-chip-input'

export default class TagInput extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <ChipInput
        {...this.props}
        // openOnFocus
        chipRenderer={({ value, isFocused, isDisabled, handleClick, handleRequestDelete }, key) => (
          <div key={key}>
          <Chip
            style={{paddingRight: 15 ,margin: '8px 0px 0 5px', float: 'left', pointerEvents: isDisabled ? 'none' : undefined }}
            backgroundColor={isFocused ? blue300 : null}
            onTouchTap={handleClick}
            // onRequestDelete={handleRequestDelete}
          >
            {value}
          </Chip>

          <Avatar
            onClick={handleRequestDelete}
            size={20}
            backgroundColor={grey500}
            style={{ cursor: "pointer", margin: '15px -30px 0 0', float: 'left', pointerEvents: isDisabled ? 'none' : undefined }}
            icon={<ContentClear/>}/>
          </div>
        )}/>
    );
  }
}
