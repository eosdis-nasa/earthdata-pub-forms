import Vue from 'vue';
import Vuex from 'vuex';

// This is to use vuex for the state management
Vue.use(Vuex);

let formTitle;
if (window.location.href.match(/daacs/g)) {
  formTitle = 'DAAC Selection';
} else {
  formTitle = 'Earthdata Publication Forms';
}

// Created new store
// eslint-disable-next-line
export const store = new Vuex.Store({
  // State is the default obj and value
  state: {
    question_answers: [],
    global_params: { formTitle },
    token: ''
  },
  getters: {
    token: (state) => state.token
  },
  mutations: {
    // push question state to save the payload to the store state question_answers
    pushQuestionsState(state, payload) {
      state.question_answers.push({ ...payload });
    },
    pushGlobalParams(state, param) {
      // eslint-disable-next-line prefer-destructuring
      state.global_params[param[0]] = param[1];
    },
    // .emptyState() is needed
    emptyState() {
      this.replaceState({ question_answers: [], global_params: {} });
    },
    // set JSON web token
    setToken(state, token) {
      Vue.set(state, 'token', token);
    }
  },
  actions: {

  },
  modules: {
  }
});
