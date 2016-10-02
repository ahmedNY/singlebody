import axios from "axios"
import { observable , autorun } from "mobx"

// import CaseModel from "../models/CaseModel.js"
import ApiHelper from "../helpers/ApiHelper.js"

class CaseStore {

	constructor() {
		this.getCases = this.getCases.bind(this)
	}
	@observable filter = "case1"
	@observable cases = []
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

	@observable isLoading = false

	getCases () {
		this.isLoading = true
		ApiHelper.get("cases")
		  .then( response => {
		    this.cases.replace(response.data)
		    this.isLoading = false
		  })
		  .catch( error => {
		    this.isLoading = false
		  });
	}

	getCase (id) {
		this.isLoading = true
		return ApiHelper.get("cases/" + id)
		  .then( response => {
		    this.isLoading = false
		    return response
		  })
		  .catch( error => {
		    this.isLoading = false
		    return error
		  });
	}

	insertCase() {
		console.log("store: posting case ")
		this.isLoading = true
		return ApiHelper.post("cases", this.formCase)
		.then(response => {
			// default case
			this.formCase =  Object.assign({}, this.caseTemplate)
			this.isLoading = false
			return response.data
		}).catch( error => {
			this.isLoading = false
			return error
		})
	}

	updateCase(id) {
		console.log("store: updating case ")
		this.isLoading = true
		return ApiHelper.put("cases/" + id, this.formCase)
		.then(response => {
			// default case
			console.log(response.data);
			this.formCase =  Object.assign({}, this.caseTemplate)
			this.isLoading = false
			return response.data
		}).catch( error => {
			this.isLoading = false
			console.log(console.error());
			return error
		})
	}

	deleteCase(id) {
		console.log("store: deleting case ")
		this.isLoading = true
		return ApiHelper.del("cases/" + id, id)
		.then(response => {
			this.isLoading = false
			return response
		}).catch( error => {
			this.isLoading = false
			return error
		})
	}
}

var store = window.caseStore = new CaseStore


export default store
