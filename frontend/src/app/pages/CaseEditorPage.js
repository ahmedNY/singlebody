import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { observer } from 'mobx-react';
import Formsy from 'formsy-react';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
    FormsySelect, FormsyText, FormsyTime, FormsyToggle } from 'formsy-material-ui/lib';
import auth from "../stores/AuthStore";

import AuthorizedPage from "./AuthorizedPage";

import { Grid, Row, Col} from 'react-flexbox-grid';

import store from '../stores/CasesStore.js'

const errorMessages = {
    wordsError: "Please only use letters",
    numericError: "Please provide a number",
    urlError: "Please provide a valid URL",
}

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
    submitStyle: {
      marginTop: 32,
    },
}

@observer
class CaseEditorPage extends AuthorizedPage {

   constructor(props) {
      super(props);
      this.state = {
          canSubmit: false,
      }
      this.disableButton = this.disableButton.bind(this)
      this.enableButton = this.enableButton.bind(this)
      this.updateEditMode = this.updateEditMode.bind(this)
      this.submitForm = this.submitForm.bind(this)
      this.isEditingMode = false;
   }

   updateEditMode = () => {
    this.isEditingMode = !this.props.router.isActive("/cases/addcase");
   // or
   // this.isEditingMode = this.props.location.pathname.match(/^\/cases\/edit/) != null
      console.log("isEditingMode:" + this.state.isEditingMode)
    this.render()

   }


   componentDidMount = () => {
     // set edit mode
     this.updateEditMode();
     if(this.isEditingMode){
         // fetch data initially
         this.fetchSingleCase()
     }
   }

   componentDidUpdate = (prevProps) => {

       if(this.isEditingMode){
          // respond to parameter change in scenario 3
           let oldId = prevProps.params.caseId
           let newId = this.props.params.caseId
           if (newId !== oldId){
               this.fetchSingleCase()
           }
       }

    }

    //we need to fetch case before editing it
    fetchSingleCase = () => {
       store.getCase(this.props.params.caseId)
           .then(response => {
               store.formCase = response.data
           });
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

  submitForm = (data) => {
    // alert(JSON.stringify(data, null, 4));

    store.formCase.title = data.title;
    store.formCase.summary = data.summary;
    store.formCase.story = data.story;
    store.formCase.category = data.category;
    store.formCase.city = data.city;
    store.formCase.section = data.section;
    store.formCase.moneyRequired = data.moneyRequired;
    store.formCase.groupName = data.groupName;
    store.formCase.image = data.image;

    let action = null
    if(this.isEditingMode)
        action = store.updateCase(this.props.params.caseId)
    else
        action = store.insertCase()

    action.then(data => {
        console.log("we are changeing route")
        console.log(data)
        this.props.router.push("cases/" + data.id)
    })
  }

  notifyFormError = (data) => {
    console.error('Form error:', data);
  }



  render = () => {
    const {paperStyle, switchStyle, submitStyle } = styles;
    const { wordsError, numericError, urlError } =    errorMessages;
    const { id, title, summary, story, category, city, section,
            moneyRaised, moneyRequired, daysRemaining, groupName, image } = store.formCase

    return (
        <Grid>
          <Row center="xs">
            <Col xs={12} sm={8}>
              <Paper style={styles.paperStyle} zDepth={4}>
                  <h3>{this.isEditingMode ? "تعديل الحالة" : "اضافة حالة جديدة"}</h3>
                <Row start="xs">

                  <Formsy.Form
                    onValid={this.enableButton}
                    onInvalid={this.disableButton}
                    onValidSubmit={this.submitForm}
                    onInvalidSubmit={this.notifyFormError}
                  >
                    <FormsyText
                      name="title"
                      validations={{minLength:5, maxLength:25}}
                      validationError={wordsError}
                      required
                      value = {title}
                      hintText="اوصف الحالة في كلمات"
                      floatingLabelText="عنوان الحالة"
                    />
                    <FormsyText
                      name="summary"
                      value={summary}
                      required
                      validations={{minLength:50, maxLength:255}}
                      validationError={wordsError}
                      hintText="اوصف الحالة باختصار"
                      floatingLabelText="وصف مختصر للحالة"
                      multiLine={true}
                      rows={2}
                      fullWidth={true}
                    />
                    <FormsyText
                      name="story"
                      value={story}
                      validations={"minLength:50"}
                      validationError={wordsError}
                      required
                      hintText="اوصف الحالة بالتفصيل"
                      floatingLabelText="تفاصيل الحالة"
                      multiLine={true}
                      rows={4}
                      fullWidth={true}
                    />
                    <FormsyText
                      name="moneyRequired"
                      value={moneyRequired}
                      validations={"isNumeric"}
                      validationError={numericError}
                      hintText="كم هو البلغ المطلوب؟"
                      floatingLabelText="المبلغ المطلوب"
                    />
                    <br/>
                    <FormsyText
                      name="city"
                      value={city}
                      validations={"minLength:3"}
                      validationError={wordsError}
                      required
                      hintText="ما هي المدينه؟"
                      floatingLabelText="المدينة"
                    />
                    <FormsyText
                      name="section"
                      value={section}
                      validations={"minLength:3"}
                      validationError={wordsError}
                      required
                      hintText="في اي حي؟"
                      floatingLabelText="الحي"
                    />
                    <FormsyText
                      name="groupName"
                      value={groupName}
                      validations={"minLength:3"}
                      validationError={wordsError}
                      required
                      floatingLabelText="ابمجموعة"
                    />
                    <FormsySelect
                      name="category"
                      required
                      floatingLabelText="تصنيف الحالة"
                      value={category}
                    >
                      <MenuItem value={'عمليات'} primaryText="عمليات" />
                      <MenuItem value={'ادوية'} primaryText="ادوية" />
                      <MenuItem value={'مشروع بناء'} primaryText="مشروع بناء" />
                    </FormsySelect>

                    <br/>

                    <FormsyText
                      name="image"
                      value={image}
                      validations={"minLength:3"}
                      validationError={wordsError}
                      required
                      floatingLabelText="الصورة"
                    />
                    <br/>
                    <RaisedButton
                      style={submitStyle}
                      type="submit"
                      label="حفظ"
                      disabled={!this.state.canSubmit}
                    />
                  </Formsy.Form>
                </Row>
              </Paper>
            </Col>
          </Row>
        </Grid>
    );
  }
};

// PropTypes
CaseEditorPage.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

var decoratedComponent = withRouter(CaseEditorPage);
export default decoratedComponent
