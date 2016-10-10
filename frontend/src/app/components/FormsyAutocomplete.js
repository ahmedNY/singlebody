
// https://github.com/mbrookes/formsy-material-ui/issues/45#issuecomment-200900553

import React, { PropTypes, Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import { HOC } from 'formsy-react';
import keycode from 'keycode';

class FormsyAutocomplete extends Component {

  constructor(props) {
    super(props);
    this.state = {
       value: this.props.defaultValue || this.props.value || '',
    }
  }


  componentWillMount = () => {
    this.props.setValue(this.props.defaultValue || this.props.value || '');
  }

  handleBlur = (event) => {
    this.props.setValue(event.currentTarget.value);
    if (this.props.onBlur) this.props.onBlur(event);
  }

  handleNewRequest = value => this.props.setValue(value);

  handleChange = (event) => {
    this.setState({
      value: event.currentTarget.value,
    });
    if (this.props.onChange) this.props.onChange(event);
  }

  handleKeyDown = (event) => {
    if (keycode(event) === 'enter') this.props.setValue(event.currentTarget.value);
    if (this.props.onKeyDown) this.props.onKeyDown(event, event.currentTarget.value);
  }

  render () {
    return (
      <AutoComplete
        filter={AutoComplete.caseInsensitiveFilter}
        dataSource={this.props.options}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onFocus={this.props.onFocus}
        onKeyDown={this.handleKeyDown}
        onNewRequest={this.handleNewRequest}
        floatingLabelText={this.props.floatingLabelText}
        fullWidth={this.props.fullWidth}
        searchText={this.props.searchText}
      />
    );
  }
}

FormsyAutocomplete.propTypes = {
  options: PropTypes.array,
  setValue: PropTypes.func.isRequired
};

export default HOC(FormsyAutocomplete);
