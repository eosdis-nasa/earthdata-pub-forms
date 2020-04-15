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
    question_answers: []
  },
  mutations: {
    // push question state to save the payload to the store state question_answers
    pushQuestionsState(state, payload){
      state.question_answers.push(Object.assign({}, payload))
    },
    // .emptyState() is needed by VuexUndoRedo
    emptyState() {
      this.replaceState({ question_answers: [] });
    },
  },
  actions: {

  },
  getters: {

  },
  modules: {
  }
})
