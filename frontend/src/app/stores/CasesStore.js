import { observable , autorun, toJS } from "mobx"

// import CaseModel from "../models/CaseModel.js"
import ApiHelper from "../helpers/ApiHelper.js"
import uiStore from "./UiStore.js"

class CaseStore {

	constructor() {
		this.getCases = this.getCases.bind(this)
		this.currentPage = 2;
		this.keyWords = [];
	}
	@observable filter = "case1"
	@observable cases = []
	@observable unfilteredCases = []
	@observable categories = []
	@observable cities = []
	@observable isLoadingMore = false;
	@observable noMoreCases = true;

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
		return ApiHelper.get("cases?page=1&limit=10")
		  .then( response => {
		    this.cases.replace(response.data);
		    this.noMoreCases = false;
			return response.data;
		  })
	}

	getMoreCases () {
		if(this.noMoreCases && this.isLoadingMore) return;
		uiStore.disableLoadingUi();
		this.isLoadingMore = true;
		// set page to 1 if we had keywords
		var url = "cases?page=" +  this.currentPage++ + "&limit=10";
		if(this.keyWords.length > 0) {
			url = "cases?page=" + 1 + "&limit=10&keyWords=" + this.keyWords.join();
		}
		return ApiHelper.get(url)
		  .then( response => {
		  	var moreCases = this.cases.concat(response.data);
		    this.cases.replace(moreCases)
			this.isLoadingMore = false;
			uiStore.enableLoadingUi();
			if(response.data.length <= 1) {
				this.noMoreCases = true;
			}
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
	filterCases = (keyWords) => {
		this.keyWords = keyWords;
		if(keyWords.length <= 0) {
			this.cases.replace(this.unfilteredCases);
			return;
		}
		if(this.unfilteredCases.length === 0){
			this.unfilteredCases = toJS(this.cases).slice(0);
		}
		const filteredCases = this.unfilteredCases.slice(0).filter( c => {
			let valid = false;
			const properties = ["story", "title", "summary", "city", "section", "category", "groupName"];
			for (var i = 0; i < keyWords.length; i++) {
				let keyWord = keyWords[i];
				for (var j = 0; j < properties.length; j++) {
					const prop = properties[j];
					if(c[prop].indexOf(keyWord) >= 0)
						valid = true;
				}
			}
			return valid;
		});
		this.cases.replace(filteredCases);
	}

	reset() {
		uiStore.searchInputVisible = false;
		this.keyWords = 0;
	}
}

var store = window.caseStore = new CaseStore


export default store
