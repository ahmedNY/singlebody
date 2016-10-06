import { observable } from "mobx";

import apiHelper from "../helpers/ApiHelper"

class DonationsStore {
  @observable donatedCases = []

  addDonation(model){
    return apiHelper.post("donations", model)
  }

  getCases() {
    return apiHelper.get("donations", true)
      .then( response => {
        this.donatedCases = response.data;
        console.log(this.donations);
        return response;
      })
  }

}

var store = new DonationsStore;

export default store;
