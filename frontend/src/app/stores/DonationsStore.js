import { observable } from "mobx";

import apiHelper from "../helpers/ApiHelper"

class DonationsStore {
  @observable donatedCases = []
  @observable selectedDontaion = {}

  addDonation(model){
    return apiHelper.post("donations", model)
  }

  updateDonation(id, model){
    return apiHelper.put("donations/" + id, model)
  }

  getDonations() {
    return apiHelper.get("donations", true)
      .then( response => {
        this.donatedCases = response.data;
        return response;
      })
  }

  getOneDonation(id) {
    return apiHelper.get("donations/" + id, true)
      .then( response => {
        return response.data;
      })
  }

  removeDonation(id) {
    return apiHelper.del("donations/" + id);
  }

}

var store = window.dstore = new DonationsStore;

export default store;
