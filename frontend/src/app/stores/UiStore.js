import { observable } from "mobx";

class UiStore {
    @observable mainHeaderVisible = true
    @observable sideMenuVisible = false
    @observable isLoading = false

    startLoading = () => {
      // TODO: add timeout
      this.isLoading = true;
    }

    endLoading = () => {
      this.isLoading = false
    }
}

var store = window.uiStore = new UiStore;
export default store;
