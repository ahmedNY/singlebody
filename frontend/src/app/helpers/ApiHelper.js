import axios from "axios";
import auth from "../stores/AuthStore";
import uiStore from "../stores/UiStore";

import config from "../config";

class ApiHelper {
  constructor() {
    this.url = config.backendUrl();
    this.prepUrl = this.prepUrl.bind(this)
    this.get = this.get.bind(this)
    this.post = this.post.bind(this)
  }

  prepUrl(route){
    return this.url + "/" + route
  }

  makeRequestConfig(withJwt=false){
    let headers = {
      ["Content-Type"]: "application/json"
    };

    if(auth){
        headers["access_token"] = auth.authToken;
      }else {
        console.log("Access token is missing!")
      }

    return {
      withCredentials: true,
      headers
    }
  }

  get(route, jwt=false) {
    uiStore.startLoading();
    return axios.get(this.prepUrl(route), this.makeRequestConfig(jwt))
          .then( response => {
            console.log(response.data)
            uiStore.endLoading()
            return response
          })
          .catch( error => {
            console.log(error)
            uiStore.endLoading()
             throw error;
          })
  }

  post(route, data) {
    uiStore.startLoading();
    return axios.post(this.prepUrl(route), data, this.makeRequestConfig(true))
          .then( response => {
            console.log("POST::" + response.data)
            uiStore.endLoading();
            return response
          })
          .catch( error => {
            console.log("ERROR POST: " + error)
            uiStore.endLoading();
            throw error
          })
  }

  upload(route, data, config) {
    uiStore.startLoading();
    return axios.post(this.prepUrl(route), data, config)
          .then( response => {
            console.log("POST::" + JSON.stringify(response.data))
            uiStore.endLoading();
            return response
          })
          .catch( error => {
            console.log("ERROR POST: " + error)
            uiStore.endLoading();
            throw error
          })
  }

  put(route, data) {
    uiStore.startLoading();
    return axios.put(this.prepUrl(route), data , this.makeRequestConfig(true) )
          .then( response => {
            console.log("PUT::" + response.data)
            uiStore.endLoading();
            return response
          })
          .catch( error => {
            console.log("ERROR PUT: " + error)
            uiStore.endLoading();
            throw error
          })
  }

  del(route, id) {
    uiStore.startLoading();
    return axios.delete(this.prepUrl(route), this.makeRequestConfig())
          .then( response => {
            console.log("DELETE::" + response.data)
            uiStore.endLoading();
            return response
          })
          .catch( error => {
            console.log("ERROR PUT: " + error)
            uiStore.endLoading();
            throw error
          })
  }

}

var api = new ApiHelper

export default api
