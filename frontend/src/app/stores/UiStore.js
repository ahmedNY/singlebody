import { observable } from "mobx";

var enabled = true;

class UiStore {
    @observable mainHeaderVisible = true
    @observable sideMenuVisible = false
    @observable isLoading = false
    @observable showSearchIcon = false
    @observable searchInputVisible = false

    disableLoadingUi = () => {
      enabled = false;
    }

    enableLoadingUi = () => {
      enabled = true;
    }
    startLoading = () => {
      // TODO: add timeout
      if(enabled)
        this.isLoading = true;
    }

    endLoading = () => {
      this.isLoading = false
    }
}

var store = window.uiStore = new UiStore;
export default store;
