import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { observer } from 'mobx-react';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import Formsy from 'formsy-react';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
    FormsySelect, FormsyText, FormsyTime, FormsyToggle } from 'formsy-material-ui/lib';
import auth from "../stores/AuthStore";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import AuthorizedPage from "./AuthorizedPage";

import { Grid, Row, Col} from 'react-flexbox-grid';

import store from '../stores/CasesStore.js'
import uiStore from '../stores/UiStore.js'

const errorMessages = {
    wordsError: "Please only use letters",
    numericError: "Please provide a number",
    urlError: "Please provide a valid URL",
}

const styles = {

    imgStyle: {
      maxHeight: "80%",
      maxWidth: "100%",
    },
    imgContainer: {
      maxHeight: 250,
      overflow: "hidden"
    },
    noImgContainer: {
      height: 250,
      borderWidth: 2,
      borderColor: "#a2a2a2",
      borderStyle: "dashed"
    },
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
    exampleImageInput: {
      cursor: 'pointer',
      position: 'absolute',
      top: '0',
      bottom: '0',
      right: '0',
      left: '0',
      width: '100%',
      opacity: '0'
    }
}

@observer
class CaseEditorPage extends AuthorizedPage {

   constructor(props) {
      super(props);
      this.state = {
          canSubmit: false,
          city: "",
          image: null,
          imagePreviewUrl: null,
      }
      this.disableButton = this.disableButton.bind(this)
      this.enableButton = this.enableButton.bind(this)
      this.updateEditMode = this.updateEditMode.bind(this)
      this.submitForm = this.submitForm.bind(this)
      this.isEditingMode = false;

      this.model = "Case"
   }

   updateEditMode = () => {
    this.isEditingMode = !this.props.router.isActive("/cases/addcase");
   // or
   // this.isEditingMode = this.props.location.pathname.match(/^\/cases\/edit/) != null
    this.action = this.isEditingMode ? "update" : "create"
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

    componentWillUnmount = () => {
      // store.formCase = null;
    }

    //we need to fetch case before editing it
    fetchSingleCase = () => {
       store.getCase(this.props.params.caseId)
         .then(response => {
             if(this.check(response.data)){
               this.fetchLists();
               store.formCase = response.data;
             }
         });
    }
    //
    fetchLists =() => {
      store.getCategoryLists();
      store.getCitiesLists();
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

    store.formCase.title = data.title;
    store.formCase.summary = data.summary;
    store.formCase.story = data.story;
    store.formCase.category = data.category;
    store.formCase.city = data.city;
    store.formCase.section = data.section;
    store.formCase.moneyRequired = data.moneyRequired;

    let action = null
    if(this.isEditingMode)
        action = store.updateCase(this.props.params.caseId)
    else
        action = store.insertCase()
    action.then(data => {
        // Uploading case image
        if(this.state.image) {
          store.uploadCaseImage(data.id, this.state.image)
          .then( () => {
            this.props.router.push("cases/" + data.id)
          });
        }
        else {
          this.props.router.push("cases/" + data.id)
        }

    })
  }

  notifyFormError = (data) => {
    console.error('Form error:', data);
  }

  formChanged = (values) => {
    this.setState({city: values.city})
  }

  imageChanged = (e) => {
    console.log(e.target.files[0])
    let reader = new FileReader();
   let file = e.target.files[0];

   reader.onloadend = () => {
     this.setState({
       image: file,
       imagePreviewUrl: reader.result
     });
   }

   reader.readAsDataURL(file)
  }

  render = () => {
    const {paperStyle, switchStyle, submitStyle } = styles;
    const { wordsError, numericError, urlError } =    errorMessages;
    const { id, title, summary, story, category, city, section,
            moneyRaised, moneyRequired, daysRemaining, imageFd } = store.formCase || {}

    const categoriesItems = store.categories.map((c, i) => {
      return (
        <MenuItem key={i} value={c} primaryText={c} />
      )
    })

    const citiesItems = store.cities.map((c, i) => {
      return (
        <MenuItem key={i} value={c.city} primaryText={c.city} />
      )
    })

    const citySections = store.cities.find(c => c.city == this.state.city);

    const sectionsItems = !citySections ? [] : citySections.sections.map((s, i) => {
      return (
        <MenuItem key={i} value={s} primaryText={s} />
      )
    })

    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (
      <CardMedia
        overlay={<CardTitle subtitle={this.state.image.name} />}>
        <div style={styles.imgContainer}>
          <img style={styles.imgStyle} src={imagePreviewUrl} />
        </div>
      </CardMedia>);
    } else if (imageFd) {
      $imagePreview =
        <div style={styles.imgContainer}>
          <img style={styles.imgStyle} src={"../images/" + imageFd} />
        </div>
    }else {
      $imagePreview = <div style={styles.noImgContainer}></div>
    }

    return (
        <Grid>
          <Row around="xs">
            <Col xs={12} sm={8}>
              <Paper style={styles.paperStyle} zDepth={4}>
                  <h3>{this.isEditingMode ? "تعديل الحالة" : "اضافة حالة جديدة"}</h3>

                  <Row center="xs">
                    <Col xs={12}>
                      {$imagePreview}
                      <br/>
                        <RaisedButton
                        primary={true}
                        containerElement='label'
                        label={imageFd || imagePreviewUrl ? "تغيير الصورة" : 'اختر صورة الحالة'}>
                        <input type="file" onChange={this.imageChanged} name="image" style={styles.exampleImageInput}/>
                        </RaisedButton>
                      <br/>
                    </Col>
                  </Row>

                  <Formsy.Form
                    onValid={this.enableButton}
                    onInvalid={this.disableButton}
                    onValidSubmit={this.submitForm}
                    onInvalidSubmit={this.notifyFormError}
                    onChange={this.formChanged}
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
                      validations={{minLength:50, maxLength:120}}
                      validationError={wordsError}
                      hintText="اوصف الحالة باختصار"
                      floatingLabelText="وصف مختصر للحالة"
                      multiLine={true}
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
                    <FormsySelect
                      name="city"
                      value={city}
                      onClick={this.fetchLists}
                      required
                      hintText="ما هي المدينه؟"
                      floatingLabelText="المدينة"
                    >
                      {citiesItems}
                    </FormsySelect>

                    <FormsySelect
                      name="section"
                      value={section}
                      required
                      hintText="في اي حي؟"
                      floatingLabelText="الحي"
                    >
                      {sectionsItems}
                    </FormsySelect>

                    <FormsySelect
                      name="category"
                      required
                      onClick={this.fetchLists}
                      floatingLabelText="تصنيف الحالة"
                      value={category}
                    >
                      {categoriesItems}
                    </FormsySelect>

                    <br/>

                    <RaisedButton
                      style={submitStyle}
                      type="submit"
                      label="حفظ"
                      primary={true}
                      disabled={!this.state.canSubmit}
                    />
                  </Formsy.Form>
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
