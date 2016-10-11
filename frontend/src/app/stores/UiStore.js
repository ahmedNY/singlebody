import { observable } from "mobx";

class UiStore {
    @observable mainHeaderVisible = true
    @observable sideMenuVisible = false
    @observable isLoading = false
}

var store = window.uiStore = new UiStore;
export default store;
