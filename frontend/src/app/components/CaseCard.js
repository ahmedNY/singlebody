
import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';
import LocationIcon from 'material-ui/svg-icons/communication/location-on';


const {Row, Col} = require('react-flexbox-grid');

const cardStyle = {
    marginTop: 15
}

const titleStyle = {
  textDecoration: "none"
}

const summaryStyle = {
  height: 30,
}

const imageStyle = {
  maxHeight: "100%",
  maxWidth: "100%",
  marginTop: -20,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
}

const imgContainer = {
  maxHeight: 200,
  overflow: "hidden"
}

export default class CaseCard extends Component {
  render() {

    const { id, title, summary, city, section,
      moneyRaised, moneyRequired, daysRemaining, group , imageFd} = this.props.caseModel

    let moneyRaisedPer = 0;
    // fix some random error!
    if(moneyRaised > 0){
      moneyRaisedPer = Math.round( (moneyRaised / moneyRequired) * 100 )
    }


    return(
        <Card style={cardStyle}>
          <a href={"#/cases/" + id}>
            <CardMedia mediaStyle={imgContainer}>
              {/* <div style={imgContainer}> */}
                <img src={"../images/" + imageFd} style={imageStyle}/>
              {/* </div> */}
            </CardMedia>
          </a>
          <a style={titleStyle} href={"#/cases/" + id}>
            <CardTitle title={title} subtitle={group ? group.name : ""} />
          </a>
          <CardText style={summaryStyle}>
            {summary}
          </CardText>
          <CardText>
            <div style={{marginBottom:7}}>
              <LocationIcon style={{marginBottom: -7}}/> {city + ", " + section}
            </div>
            <LinearProgress mode="determinate" value={moneyRaisedPer} />
            <br/>
            <Row>
              <Col xs={4} sm={3}>
                <b>{moneyRaisedPer}%<br/></b>
                موعود بالدفع
              </Col>
              <Col xs={4} sm={3}>
                <b>{moneyRaised}</b><br/>
                تم تحصيله
              </Col>
              <Col xs={4} sm={3}>
                <b>{daysRemaining}<br/></b>
                ايام متبقية
              </Col>
            </Row>
          </CardText>
        </Card>
      );
  }
}
