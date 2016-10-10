import { observable, computed, toJS } from "mobx";
import ApiHelper from "../helpers/ApiHelper";
import react from 'react';
import cookie from 'react-cookie';
import jwtDecode from 'jwt-decode';
import Promise from 'bluebird';

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
    return ApiHelper.post("auths/login", {
      email: username,
      password: password,
      type: "local",
    }, "application/x-www-form-urlencoded")
    .then( response => {
      console.log(response.data.token)
      this.saveToken(response.data.token);
      this.getCurrentUser();
      return response;
    });
  }

  loginWithFacebook = () => {
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
          }).catch((error)=>{
            auth.loginModel.visible = true
            reject(error)
          });

        }
      }, 100);
    })
  }

  logout() {
    return ApiHelper.get("auths/logout", true)
    .then( response => {
      this.authToken = null;
      this.user = null;
      cookie.remove("authToken");
      cookie.remove("user");
      console.log("loged out...");
      return response;
    });
  }

  test() {
    // ApiHelper.get("tests/open")
    return ApiHelper.get("tests/jwt", true)
  }

  getUserToken = () => {
    return ApiHelper.get("users/jwt", true).then(response => {
      this.saveToken(response.data.token)
      return response;
    })
  }

  saveToken(token){
    this.authToken = token;
    cookie.save('authToken', this.authToken);
  }

  getCurrentUser = () => {
    return ApiHelper.get("auths/permissions", true).then(response => {
      this.user = response.data
      cookie.save('user', response.data);
      return this.user;
    })
  }

  getUsersList = () => {
    console.warn("Fetching all users data")
    return ApiHelper.get("users", true)
    .then(response => {
      return response.data;
    })
  }
}

var store = window.store = new AuthStore;
window.cookie = cookie
window.jwtDecode = jwtDecode
window.toJS = toJS
export default store;
