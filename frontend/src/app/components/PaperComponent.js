import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { Grid, Row, Col} from 'react-flexbox-grid';

const paperStyle = {
  // width: "80%",
  // margin: 'auto',
  padding: 20,
  marginTop: 20,
  // maxWidth: "900px"
}

const sizes = {
  medium: {
    xs: 11,
    sm: 10,
    md: 8
  },
  small: {
    xs: 10,
    sm: 7,
    md: 5
  }
}

export default class PaperComponent extends Component {
  render(){
    const {size = "medium"} = this.props;
    return(
      <Grid>
        <Row around="xs">
          <Col xs={sizes[size].xs} sm={sizes[size].sm} md={sizes[size].md}>
              <Paper style={paperStyle} zDepth={4}>
              {this.props.children}
              </Paper>
          </Col>
        </Row>
      </Grid>
    );
  }
}
