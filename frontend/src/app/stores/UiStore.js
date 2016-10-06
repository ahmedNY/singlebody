import { observable } from "mobx";

class UiStore {
    @observable mainHeaderVisible = true
    @observable sideMenuVisible = false
}

var store = window.uiStore = new UiStore;
export default store;
