import { observable } from "mobx";

class UiStore {
    @observable mainHeaderVisible = true
}

var store = window.uiStore = new UiStore;
export default store;
