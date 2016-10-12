import { observable, computed, toJS } from "mobx";
import ApiHelper from "../helpers/ApiHelper";
import react from 'react';
import cookie from 'react-cookie';
import jwtDecode from 'jwt-decode';
import Promise from 'bluebird';
import uiStore from './UiStore'

class AuthStore {

  @observable authToken = cookie.load("authToken")
  @observable user = cookie.load("user")
  @observable loginModel = {
    visible : false,
    username: "",
    password: "",
    type: "local"
  }

  @computed get isLogedIn() {
    return (this.user !== null) && (this.user !== undefined)
  }

  openLoginDialog() {
    this.loginModel.visible = true;
  }

  login(username, password) {
    uiStore.isLoading = true;
    return ApiHelper.post("auths/login", {
      email: username,
      password: password,
      type: "local",
    }, "application/x-www-form-urlencoded")
    .then( response => {
      console.log(response.data.token)
      this.saveToken(response.data.token);
      this.getCurrentUser();
      uiStore.isLoading = false;
      return response;
    });
  }

  loginWithFacebook = () => {
    uiStore.isLoading = true;
    return new Promise((resolve, reject) => {
      console.log("login with facebook")
      this.loginModel.visible = false;
      let auth = this
      var win = window.open(ApiHelper.prepUrl("auths/login?type=facebook"),'popUpWindow','centerscreen=true');
      var intervalID = setInterval(function(){
        if (win.closed) {
          clearInterval(intervalID);
          auth.getUserToken().then(() => {
            resolve(auth.getCurrentUser());
            uiStore.isLoading = false;
          }).catch((error)=>{
            auth.loginModel.visible = true
            uiStore.isLoading = false;
            reject(error)
          });

        }
      }, 100);
    })
  }

  logout() {
    uiStore.isLoading = true;
    return ApiHelper.get("auths/logout", true)
    .then( response => {
      this.authToken = null;
      this.user = null;
      cookie.remove("authToken");
      cookie.remove("user");
      console.log("loged out...");
      uiStore.isLoading = false;
      return response;
    });
  }

  test() {
    // ApiHelper.get("tests/open")
    return ApiHelper.get("tests/jwt", true)
  }

  getUserToken = () => {
    uiStore.isLoading = true;
    return ApiHelper.get("users/jwt", true).then(response => {
      this.saveToken(response.data.token)
      uiStore.isLoading = false;
      return response;
    })
  }

  saveToken(token){
    this.authToken = token;
    cookie.save('authToken', this.authToken);
  }

  getCurrentUser = () => {
    uiStore.isLoading = true;
    return ApiHelper.get("auths/permissions", true).then(response => {
      this.user = response.data
      cookie.save('user', response.data);
      uiStore.isLoading = false;
      return this.user;
    })
  }
}

var store = window.store = new AuthStore;
window.cookie = cookie
window.jwtDecode = jwtDecode
window.toJS = toJS
export default store;
