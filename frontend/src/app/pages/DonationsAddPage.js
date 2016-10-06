// Core components
import React, { Component } from 'react';
import { withRouter } from 'react-router';

// UI components
import { FormsyRadio, FormsyRadioGroup, FormsyText } from 'formsy-material-ui/lib';
import { Row, Col } from 'react-flexbox-grid';
import { green500 } from 'material-ui/styles/colors';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionCancel from 'material-ui/svg-icons/navigation/cancel';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import NavBack from 'material-ui/svg-icons/image/navigate-next';

import { Sticky } from 'react-sticky';

// My components
import PaperComponent from '../components/PaperComponent';

// Stores
import store from '../stores/DonationsStore'
import uiStore from '../stores/UiStore'


const styles = {
    paperStyle: {
      padding: 20,
      marginTop: 20,
    },
    switchStyle: {
      marginBottom: 16,
    },
    submit: {
      marginTop: 32,
    },
    form: {
      width: "100%"
    },
    smallIcon: {
      width: 30,
      height: 30,
    },
    smallButton: {
      width: 60,
      height: 60,
      padding: 16,
    },
}

// payment types
const pTypes = {
  collector: "تسليم لاقرب متحصل",
  ePayment: "الدفع الاكتروني",
  phoneCreditTransfer: "تحويل الرصيد"
}

class DonationsAddPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
      otherValueDisable: true,
      paymentType: null
    }
  }

  componentWillMount() {
    uiStore.mainHeaderVisible = false;
  }

  componentWillUnmount() {
    uiStore.mainHeaderVisible = true;
  }

  enableButton = () => {
    this.setState({
      canSubmit: true,
    });
  }

  disableButton = () => {
    this.setState({
      canSubmit: false,
    });
  }

  notifyFormError = (error) => {
    console.log(error);
  }

  submitForm = (data) => {
    if(data.amount === "-1"){
      data.amount = data.otherAmount;
    }

    delete data.otherAmount;
    data.case = this.props.params.caseId;
    data.isPromise = data.paymentType !== "ePayment";

    store.addDonation(data).then( () => {
      // Go to donations page
      this.props.router.push("donations")
    })
  }

  goBack = () => {
    this.props.router.goBack();
  }

  formChange = (values) => {
    console.log(values);
    // Emable/Disable custom amount
    this.setState({ otherValueDisable: (values.amount > "0") })
    if(values.paymentType){
      this.setState({paymentType: values.paymentType})
    }
  }

  render() {

    return (
      <div>
      <Formsy.Form
      onValid={this.enableButton}
      onInvalid={this.disableButton}
      onValidSubmit={this.submitForm}
      onInvalidSubmit={this.notifyFormError}
      onChange={this.formChange}
      style={styles.form}
      >
          <Sticky style={{zIndex:20}}>
          <Toolbar>
            <ToolbarGroup firstChild={true}>
              <IconButton
                onClick={this.goBack}
                iconStyle={styles.smallIcon}
                style={styles.small}>
                  <NavBack />
              </IconButton>
              <ToolbarTitle text="اجراء تبرع"/>
            </ToolbarGroup>

            <ToolbarGroup lastChild={true}>
              <IconButton
                type="submit"
                iconStyle={styles.smallIcon}
                disabled={!this.state.canSubmit}
                style={styles.small}>
                  <ActionDone color={green500} />
              </IconButton>
            </ToolbarGroup>
          </Toolbar>
          </Sticky>
              <PaperComponent style={styles.paperStyle} zDepth={4}>
                    <div>
                      <h3> عايز تتبرع بيه كم؟</h3>
                      <Row bottom="xs">
                        <Col sm={3} xs={12}>
                          <FormsyRadioGroup name="amount" required>
                            <FormsyRadio
                              value="20"
                              label="20 SDG"
                              style={styles.switchStyle}
                              />
                            <FormsyRadio
                              value="50"
                              label="50 SDG"
                              style={styles.switchStyle}
                              />
                            <FormsyRadio
                              value="100"
                              label="100 SDG"
                              style={styles.switchStyle}
                              />
                            <FormsyRadio
                              value="-1"
                              label="مبلغ اخر"
                              style={styles.switchStyle}
                              />
                          </FormsyRadioGroup>
                        </Col>
                        <Col  sm={7} xs={12}>
                          <FormsyText
                            name="otherAmount"
                            value="250"
                            hintText="ادخل الملبغ"
                            floatingLabelText="مبلغ اخر"
                            disabled={this.state.otherValueDisable}
                            fullWidth={true}
                            />
                        </Col>
                      </Row>
                      <br/>
                      <br/>
                      <h3 > كيف حتدفع؟ </h3>

                      <FormsyRadioGroup name="paymentType" required>
                        <FormsyRadio
                          value="phoneCreditTransfer"
                          label={pTypes["phoneCreditTransfer"]}
                          style={styles.switchStyle}
                          />
                        <FormsyRadio
                          value="ePayment"
                          label={pTypes["ePayment"]}
                          style={styles.switchStyle}
                          />
                        <FormsyRadio
                          value="collector"
                          label={pTypes["collector"]}
                          style={styles.switchStyle}
                          />
                      </FormsyRadioGroup>


                      { this.state.paymentType === "ePayment" ?
                        <Col>

                        <RaisedButton
                          label="ادفع الان"
                          style={styles.submit}
                          fullWidth={true}
                          primary={true}
                          />

                      </Col>
                      : null}
                      { this.state.paymentType === "phoneCreditTransfer" ?
                        <Col>
                          <h4>
                            الرجاء تحويل رصيد للارقام الاتية<br/>
                            ام تي ان:   0999122992<br/>
                            سوداني: 0123999111<br/>
                            زين:  0912219788<br/>
                          </h4>
                        </Col>
                        : null}

                      { this.state.paymentType === "collector" ?
                        <h4>
                          يمكنك تسليم المبلغ لكل من:<br/>
                        الخرطوم:<br/>
                        ٠٩١٢٢١٤٣٣٣  علي موسي <br/>
                      ٠٩١٢٢١٤٣٣٣ خالد ابراهيم<br/>
                        <br/>
                        </h4>
                      : null}

                        <h4 style={{textAlign: "center"}}>كتر خيركم و بارك الله فيكم</h4>
                      </div>
                </PaperComponent>
          </Formsy.Form>
        </div>
      );
    }
  };


  // PropTypes
  DonationsAddPage.propTypes = {
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired
    }).isRequired
  };

  var decoratedComponent = withRouter(DonationsAddPage);
  export default decoratedComponent
