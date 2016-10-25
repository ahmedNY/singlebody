import React, { Component } from "react";
import { Link, withRouter } from "react-router";
import { observer } from "mobx-react";
import { Grid, Row, Col} from 'react-flexbox-grid';
import { grey100, red500, orange500 } from "material-ui/styles/colors"

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import PlaceIcon from 'material-ui/svg-icons/maps/place';
import LocalOfferIcon from 'material-ui/svg-icons/maps/local-offer';
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
//CHIP
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

import {Tabs, Tab} from 'material-ui/Tabs';
import CircularProgress from 'material-ui/CircularProgress';

import store from "../stores/CasesStore"
import FloatingButton from "../components/FloatingButton";
import ContentAddIcon from 'material-ui/svg-icons/content/add';

import auth from "../stores/AuthStore";
import config from "../config";

import AuthorizedComponent from "../components/AuthorizedComponent";



const paperStyle = {
  backgroundColor: grey100
};

const imgStyle = {
  width: "95%",
  display: "block"
};

const colStyle = {
  marginRight: "5%",
  marginLeft: "5%",
  marginBottom: "5%"
}

const btnStyle = {
  height: "35px"
}

const labelStyle = {
  fontSize: "24px",
  top: "6px"
}
const titleStyle = {
  margin: 0,
  padding: 20,
  paddingBottom: 0,
  textAlign: "center",
  fontWeight: "normal",
  fontSize: 30,
}

const subTitleStyle = {
  padding: 0,
  textAlign: "center",
  fontWeight: "normal",
  marginTop: 10
  // fontSize: 13,
}

const chipStyle = {
  margin: 4
}

const summaryStyle = {
  fontSize: 18,
  whiteSpace: "pre-wrap",
}
const gridStyle = {
  // marginLeft: 0
}

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: "bold",
  }
};

const backendUrl = config.backendUrl();

@observer
class CaseViewPage extends Component {

    constructor(props) {
      super(props)
      this.handleDeleteButton = this.handleDeleteButton.bind(this)
      this.model = "Case"
      this.action = "read"
    }

    componentDidMount () {
        // fetch data initially
      this.fetchSingleCase()
    }

    componentDidUpdate (prevProps) {
       // respond to parameter change in scenario 3
       let oldId = prevProps.params.caseId
       let newId = this.props.params.caseId
       if (newId !== oldId){
          this.fetchSingleCase()
       }
     }

     fetchSingleCase() {
      store.getCase(this.props.params.caseId)
        .then(response => {
          store.currentCase = response.data
        });
     }

     handleDeleteButton() {
      if (confirm('Are you sure you want to delete this case?')) {
        store.deleteCase(this.props.params.caseId)
          .then( () => {
            this.props.router.push("/")
          })
      }
     }


  render() {

    const { id, title, summary, city, section, moneyRaised, moneyRequired,
        daysRemaining, donorsCount, story, group, category, imageUrl } = store.currentCase
    const moneyRaisedPer = Math.round( (moneyRaised / moneyRequired) * 100 );
    const isLoading = store.isLoading

    return(
        <div>
          <div>
            <Paper style={paperStyle} zDepth={1}>
              <h1 style={titleStyle}>{title}</h1>
              <h3 style={subTitleStyle}>{group ? group.name : ""}</h3>
              <Row>

                <Col xs={12} sm={8}>
                  <div style={colStyle}>
                    <img style={imgStyle} src={backendUrl + imageUrl}/>
                    <br/>
                    <Row>
                    <Col xs={7} sm={5} md={4} lg={3}>
                      <Chip
                        style={chipStyle}
                      >
                        <Avatar color="#444" icon={<PlaceIcon />} />
                        {city + ", " + section}
                      </Chip>
                    </Col>
                    <Col xs={5} sm={5} md={4} lg={3}>
                      <Chip
                        style={chipStyle}
                      >
                        <Avatar color="#444" icon={<LocalOfferIcon />} />
                        {category}
                      </Chip>
                    </Col>
                    </Row>

                    <p style={summaryStyle}>{summary}</p>
                  </div>
                </Col>

                <Col xs={12} sm={4}>
                  <div style={colStyle}>
                    <Row>
                      <Col xs={2} sm={12}>
                        <h1><b>{donorsCount}</b></h1>
                        <div className="small">متبرع</div>
                      </Col>
                      <Col xs={6} sm={12}>
                        <h1><b>{moneyRaised} </b> SDG </h1>
                        <div className="small">تم جمعها من اصل {moneyRequired} SDG </div>
                      </Col>
                      <Col xs={3} sm={12}>
                        <h1><b>{daysRemaining}</b></h1>
                        <div className="small">يوم متبقي</div>
                      </Col>
                    </Row>
                    <br/>
                     <RaisedButton href={ "#/donations/add/" + id } label="تبرع الآن" primary={true} style={btnStyle} fullWidth={true} labelStyle={labelStyle}/>
                    <br/>
                  </div>
                </Col>

              </Row>
            </Paper>
            <Tabs contentContainerStyle={colStyle}>
               <Tab label="القصة" >
                 <div>
                   <p style={summaryStyle}> {story}</p>
                 </div>
               </Tab>
               <Tab label="المستجدات" >
                 <div>
                   <h3 style={{textAlign: "center"}}>
                     عذراً ، لا توجد اي مستجدات حالياً
                   </h3>
                 </div>
               </Tab>
               <Tab
                 label="التعليقات"
                 data-route="/home"
               >
                 <div>
                   <h3 style={{textAlign: "center"}}>
                     عذراً ، لا يوجد اي تعليق
                   </h3>
                 </div>
               </Tab>
               <Tab
                 label="الاحصاءات"
                 data-route="/home"
               >
                 <div>
                   <h3 style={{textAlign: "center"}}>
                     عذراً ، الاحصاءات ليست متوفرة حالياً
                   </h3>
                 </div>
               </Tab>
             </Tabs>
          </div>


        <div>
          <AuthorizedComponent allowedRoles={["groupAdmin"]}>
            <FloatingButton index={1} href={"#/cases/addcase"}>
              <ContentAddIcon/>
            </FloatingButton>
          </AuthorizedComponent>

          <AuthorizedComponent allowedRoles={["groupAdmin"]} action="update" model={this.model} dataModel={store.currentCase}>
            <FloatingButton index={2} href={"#/cases/edit/" + id} backgroundColor={orange500}>
              <ModeEditIcon/>
            </FloatingButton>
          </AuthorizedComponent>

          <AuthorizedComponent allowedRoles={["groupAdmin"]} action="delete" model={this.model} dataModel={store.currentCase}>
            <FloatingButton index={3} onClick={this.handleDeleteButton.bind(this)} backgroundColor={red500}>
              <DeleteIcon/>
            </FloatingButton>
          </AuthorizedComponent>
        </div>

        </div>
      );
  }
}

// PropTypes
CaseViewPage.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

var decoratedComponent = withRouter(CaseViewPage);
export default decoratedComponent
