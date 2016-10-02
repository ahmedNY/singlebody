import React, { Component } from 'react';
import store from '../stores/CasesStore.js'
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
    FormsySelect, FormsyText, FormsyTime, FormsyToggle } from 'formsy-material-ui/lib';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col} from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

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

// payment types
const pTypes = {
  collector: "تسليم لاقرب متحصل",
  ePayment: "الدفع الاكتروني",
  phoneCreditTransfer: "تحويل الرصيد"
}

export default class DonatePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
      otherValueDisable: true,
      paymentType: null
    }
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
    data.caseId = this.props.params.caseId
    console.log(data)
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

    const {finished, stepIndex} = this.state;

    return (
      <div>
        <Grid>
          <Row center="xs">
            <Col xs={12} sm={6} md={5}>
              <Paper style={styles.paperStyle} zDepth={4}>
                <Row start="xs">
                  <Formsy.Form
                    onValid={this.enableButton}
                    onInvalid={this.disableButton}
                    onValidSubmit={this.submitForm}
                    onInvalidSubmit={this.notifyFormError}
                    onChange={this.formChange}
                    style={styles.form}
                  >
                    <div>
                      <h3> عايز تتبرع بيه كم؟</h3>
                      <Row bottom="xs">
                        <Col sm={5} xs={12}>
                          <FormsyRadioGroup name="amount" defaultSelected="100">
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

                      <FormsyRadioGroup name="paymentType">
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
                        <RaisedButton
                          type="submit"
                          label="حفظ"
                          disabled={!this.state.canSubmit}
                          style={styles.submit}
                          fullWidth={true}
                          primary={true}
                          />

                        <h3>جزاك الله خيراً</h3>
                      </div>
                    </Formsy.Form>
                  </Row>
                </Paper>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    }
  };
