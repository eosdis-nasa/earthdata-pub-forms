import Vue from 'vue'
import Vuex from 'vuex'
import VuexUndoRedo from 'vuex-undo-redo';

// This is to use vuex for the state management
Vue.use(Vuex)

// Optionally install vuex-undo-redo plugin
Vue.use(VuexUndoRedo);

// Created new store
export const store = new Vuex.Store({
  // State is the default obj and value
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
