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

export default class PaperComponent extends Component {
  render(){
    return(
      <Grid>
        <Row around="xs">
          <Col xs={12} sm={10} md={8}>
              <Paper style={paperStyle} zDepth={4}>
              {this.props.children}
              </Paper>
          </Col>
        </Row>
      </Grid>
    );
  }
}
