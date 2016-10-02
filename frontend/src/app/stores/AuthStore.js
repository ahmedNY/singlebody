import { observable, computed } from "mobx";
import ApiHelper from "../helpers/ApiHelper";
import react from 'react';
import cookie from 'react-cookie';
import jwtDecode from 'jwt-decode';

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
    return ApiHelper.post("connect/token", {
      username: username,
      password: password,
      grant_type: "password",
      resource: "http://localhost:58292/",
      scope: "offline_access profile email roles"
    }, "application/x-www-form-urlencoded")
    .then( response => {
      this.auth = response.data.token_type + " " + response.data.access_token
      this.authToken = response.data.access_token
      cookie.save('auth', this.auth);
      cookie.save('authToken', response.data.access_token);
      return response;
    });
  }

  loginWithFacebook = () => {
    console.log("login with facebook")
    let auth = this
    var win = window.open("http://localhost:1337/auths/login?type=facebook",'popUpWindow','centerscreen=true');
    var intervalID = setInterval(function(){
      if (win.closed) {
        clearInterval(intervalID);
        auth.getUserToken().then(() => {
          auth.getCurrentUser();
        });

      }
    }, 100);

  }

  logout() {
    this.authToken = null;
    this.user = null;
    cookie.remove("authToken");
    cookie.remove("user");
    console.log("loged out...");
  }

  test() {
    // ApiHelper.get("tests/open")
    return ApiHelper.get("tests/jwt", true)
  }

  getUserToken = () => {
    return ApiHelper.get("users/jwt", true).then(response => {
      this.authToken = response.data.token;
      cookie.save('authToken', this.authToken);
      return response;
    })
  }

  getCurrentUser = () => {
    return ApiHelper.get("auths/permissions", true).then(response => {
      this.user = response.data
      cookie.save('user', this.user);
      return this.user;
    })
  }
}

var store = window.store = new AuthStore;
window.cookie = cookie
window.jwtDecode = jwtDecode
export default store;
