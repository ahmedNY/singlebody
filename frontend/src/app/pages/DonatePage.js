import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
    FormsySelect, FormsyText, FormsyTime, FormsyToggle } from 'formsy-material-ui/lib';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { Grid, Row, Col} from 'react-flexbox-grid';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';

import { Sticky } from 'react-sticky';

import store from '../stores/DonationsStore'
import uiStore from '../stores/UiStore'

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

const styles = {
    paperStyle: {
      // width: "80%",
      // margin: 'auto',
      padding: 20,
      marginTop: 20,
      // maxWidth: "900px"
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
    stepper : {
      maxWidth: 380,
      maxHeight: 400,
      margin: 'auto'
    }
}

const ibStyles = {
  smallIcon: {
    width: 30,
    height: 30,
  },
  mediumIcon: {
    width: 48,
    height: 48,
  },
  largeIcon: {
    width: 60,
    height: 60,
  },
  small: {
    width: 60,
    height: 60,
    padding: 16,
  },
  medium: {
    width: 96,
    height: 96,
    padding: 24,
  },
  large: {
    width: 120,
    height: 120,
    padding: 30,
  },
};

// payment types
const pTypes = {
  collector: "تسليم لاقرب متحصل",
  ePayment: "الدفع الاكتروني",
  phoneCreditTransfer: "تحويل الرصيد"
}

class DonatePage extends Component {

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
    // console.log(data)
    if(data.amount === "-1"){
      data.amount = data.otherAmount;
    }
    delete data.otherAmount;
    data.case = this.props.params.caseId
    data.isPromise = data.paymentType !== "ePayment"
    console.log(data)

    store.addDonation(data).then( () => {
      // Go to donations page
      this.props.router.push("donations")
    })
  }

  formChange = (values) => {
    // console.log(values);
    // Emable/Disable custom amount
    if(values.amount < 0){ //-1
      this.setState({ otherValueDisable: (values.amount === "1-") })
    }
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
        <Grid>
        {this.state.canSubmit ?
          <Sticky style={{zIndex:20}}>
          <Toolbar>
          <ToolbarGroup firstChild={true}>
            <IconButton
            type="submit"
            iconStyle={ibStyles.smallIcon}
            style={ibStyles.small}>
              <ActionDone color={blue500} />
            </IconButton>
          <ToolbarTitle text="حفظ"/>
          </ToolbarGroup>
          </Toolbar>
          </Sticky>
          : null
        }
          <Row center="xs">
            <Col xs={12} sm={6} md={5}>
              <Paper style={styles.paperStyle} zDepth={4}>
                <Row start="xs">
                    <div>
                      <h3> عايز تتبرع بيه كم؟</h3>
                      <Row bottom="xs">
                        <Col sm={5} xs={12}>
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

                        <FormsyText
                          name="ePayment_cardNo"
                          hintText="رقم من 14 خانة"
                          floatingLabelText="رقم الكرت"
                          fullWidth={true}
                          />

                        <Row>
                        <Col>
                            <FormsyText
                            name="ePayment_expMonth"
                            hintText="الشهر"
                            floatingLabelText="  صلاحية الكرت - الشهر"
                            fullWidth={true}
                            />
                        </Col>

                          <Col>
                            <FormsyText
                            name="ePayment_expYear"
                            hintText="السنة"
                            floatingLabelText=" صلاحية الكرت - السنة"
                            fullWidth={true}
                            />
                        </Col>
                      </Row>


                        <FormsyText
                          name="ePayment_pin"
                          floatingLabelText="الرقم السري"
                          fullWidth={true}
                          type="password"
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
                        {/* <RaisedButton
                          type="submit"
                          label="اوعدكم باني سوف ادفع"
                          disabled={!this.state.canSubmit}
                          style={styles.submit}
                          fullWidth={true}
                          primary={true}
                          /> */}

                        {/* <h3>كتر خيركم و بارك الله فيكم</h3> */}
                      </div>
                  </Row>
                </Paper>
              </Col>
            </Row>
          </Grid>
          </Formsy.Form>
        </div>
      );
    }
  };


  // PropTypes
  DonatePage.propTypes = {
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired
    }).isRequired
  };

  var decoratedComponent = withRouter(DonatePage);
  export default decoratedComponent
