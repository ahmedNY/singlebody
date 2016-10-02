import React, { Component } from 'react';

import { Grid, Row, Col} from 'react-flexbox-grid';

const RestrictedPage = props => (
  <Grid>
    <Row center="xs">
      <Col xs={12}>
        <h1 style={{fontSize:120}}>👻</h1>
        <h3>اقطع وشك</h3>
      </Col>
    </Row>
  </Grid>
);

export default RestrictedPage;
