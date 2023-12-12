import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from 'vuex'
import App from "../src/App";
import mixin from "@/mixins/mixin.js"
import VueRouter from 'vue-router'

// https://stackoverflow.com/questions/59954101/jest-error-when-setting-or-assigning-window-location
Object.defineProperty(window, 'location', {
  writable: true,
  value: { assign: jest.fn() }
});


describe("App.test.js", () => {
  const localVue = createLocalVue()
  let store
  let router

    beforeEach(() => {
      localVue.use(Vuex)
      localVue.use(VueRouter)

      store = new Vuex.Store({})
      router = new VueRouter()
    })

    test('displays redirect modal', () => {
        const wrapper = shallowMount(App, { 
            store, 
            localVue,
            router,
            mixins: [mixin] 
        })
        expect(wrapper.find('.modal-body')).toBe(true);
      })
});