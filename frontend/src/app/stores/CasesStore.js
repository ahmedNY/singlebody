import { observable , autorun } from "mobx"

// import CaseModel from "../models/CaseModel.js"
import ApiHelper from "../helpers/ApiHelper.js"

class CaseStore {

	constructor() {
		this.getCases = this.getCases.bind(this)
	}
	@observable filter = "case1"
	@observable cases = []
	@observable categories = []
	@observable cities = []
	caseTemplate =  {
	  "title": "حالة فريدة",
	  "summary": "ترميم كامل لعنبر الأطفال في مستشفي البلك ترميم كامل لعنبر الأطفال في مستشفي البلك ",
	  "story": "ترميم كامل لعنبر الأطفال في مستشفي البلك  ترميم كامل لعنبر الأطفال في مستشفي البلك ترميم كامل لعنبر الأطفال في مستشفي البلك ترميم كامل لعنبر الأطفال في مستشفي البلك",
	  "city": "امدرمان",
	  "section": "الحارة الرابعة",
	  "moneyRaised": 29000,
	  "moneyRequired": 30000,
	  "daysRemaining": 5,
	  "donorsCount": 68,
	  "category": "مشروع بناء",
	  "groupName": "شارع الحوادث",
	  "image": "belk-hospital.jpg"
	}

	@observable currentCase =  Object.assign({}, this.caseTemplate)

	@observable formCase = Object.assign({}, this.caseTemplate)

	getCases () {
		return ApiHelper.get("cases")
		  .then( response => {
		    this.cases.replace(response.data)
				return response.data;
		  })
	}

	getCase (id) {
		return ApiHelper.get("cases/" + id)
		  .then( response => {
		    return response
		  })
		  .catch( error => {
		    return error
		  });
	}

	insertCase() {
		console.log("store: posting case ")
		return ApiHelper.post("cases", this.formCase)
		.then(response => {
			// default case
			this.formCase =  Object.assign({}, this.caseTemplate)
			return response.data
		}).catch( error => {
			return error
		})
	}

	uploadCaseImage(id, image) {
		let data = new FormData();
		data.append("image", image);

		var config = {
			 onUploadProgress: function(progressEvent) {
				 var percentCompleted = progressEvent.loaded / progressEvent.total;
			 }
		 };
		return ApiHelper.upload("cases/uploadImage/" + id, data, config)
		.then(response => {
			return response.data
		})
	}

	updateCase(id) {
		console.log("store: updating case ")
		return ApiHelper.put("cases/" + id, this.formCase)
		.then(response => {
			// default case
			console.log(response.data);
			this.formCase =  Object.assign({}, this.caseTemplate)
			return response.data
		}).catch( error => {
			console.log(console.error());
			return error
		})
	}

	deleteCase(id) {
		console.log("store: deleting case ")
		return ApiHelper.del("cases/" + id, id)
		.then(response => {
			return response
		}).catch( error => {
			return error
		})
	}

	getCategoryLists() {
		if(this.categories.length == 0){
			return ApiHelper.get("lists/categories")
			.then((response)=>{
				this.categories = response.data
				return response.data;
			})
		}
	}

	getCitiesLists() {
		if(this.cities.length == 0){
			return ApiHelper.get("lists/cities")
			.then((response)=>{
				this.cities = response.data
				return response.data;
			})
		}
	}
}

var store = window.caseStore = new CaseStore


export default store
