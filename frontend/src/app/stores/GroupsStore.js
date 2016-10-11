import { observable } from "mobx";
import ApiHelper from "../helpers/ApiHelper"

class GroupsStore {
  @observable groups = [];
  @observable currentGroup = {};

  getGroups() {
    return ApiHelper.get("groups", true)
    .then(response => {
      this.groups = response.data;
      return response.data;
    });
  }

  getOneGroup(id){
    return ApiHelper.get("groups/" + id, true )
    .then(response => {
      this.currentGroup = response.data;
      return response.data;
    })
  }

  addGroup(model) {
    return ApiHelper.post("groups", model);
  }

  updateGroup(id, model) {
    return ApiHelper.put("groups/" + id, model)
  }

  removeGroup(id){
    return ApiHelper.del("groups/" + id);
  }

  uploadGroupImage(id, image) {
		let data = new FormData();
		data.append("image", image);

		var config = {
			 onUploadProgress: function(progressEvent) {
				 var percentCompleted = progressEvent.loaded / progressEvent.total;
			 }
		 };
		return ApiHelper.upload("groups/uploadImage/" + id, data, config)
		.then(response => {
			return response.data
		})
	}

}

let store = new GroupsStore;

export default store;