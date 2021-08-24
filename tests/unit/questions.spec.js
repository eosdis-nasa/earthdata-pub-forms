// Jest Testing Resources
// "Testing Vue.js Applications" at https://www.manning.com/books/testing-vue-js-applications
// "Unit Testing in Vue" at https://vuemastery.com
// "Vue Test Utils" at https://vue-test-utils.vuejs.org/
// "Vue.js" at https://vuejs.org/v2/guide/

// What to test -> You should test your component's public interface and side effects.

// Testing the public interface
// You want to test that, when passing specific props to your components, you get a specific output. For components, this output is the rendered markup.

// Unit tests are functions that call functions in your source code in isolation and assert that they behave correctly. A good test suite has 60% unit testing, 30% snapshot tests, 10% end-to-end tests
// This app will be 90% unit testing and 10% end-to-end testing (at least to start)
import { createLocalVue, mount } from '@vue/test-utils'
import App from "@/App.vue"
import VueRouter from 'vue-router'
import { BootstrapVue } from 'bootstrap-vue'
import { LayoutPlugin } from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import Header from '@/components/Header.vue'
import Daacs from '@/components/Daacs.vue'
import Questions from '@/components/Questions.vue'
import Help from '@/components/Help.vue'
import PageNotFound from '@/components/PageNotFound.vue'
import Vuex from 'vuex'
import VuexUndoRedo from 'vuex-undo-redo';
import mixin from "@/mixins/mixin.js";
import { config } from '@vue/test-utils';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';

config.showDeprecationWarnings = false

const localVue = createLocalVue();
localVue.use(VueRouter)
localVue.use(BootstrapVue);
localVue.use(Vuelidate)
localVue.use(Vuex)
localVue.use(VuexUndoRedo)
localVue.use(LayoutPlugin)
localVue.mixin(mixin)
library.add(fas)
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.component('font-awesome-layers', FontAwesomeLayers)
localVue.component('font-awesome-layers-text', FontAwesomeLayersText)

const routes = [  { path: '/interest/daacs/:group', name: 'Data Accession Request - Daacs', component: Daacs, alias: '/interest/daacs/selection' },
                  { path: '/interest/questions/:group', name: 'Data Accession Request - Questions', component: Questions },
                  { path: '/interest/questions/:group/:formId', name: 'Data Accession Request - Questions with FormId', component: Questions },
                  { path: '/interest/questions/:group/:formId/:requestId', name: 'Data Accession Request - Questions with formId and requestId', component: Questions },
                  { path: '/interest/help', name: 'Data Accession Request - Help', component: Help },
                  { path: '/questionnaire/questions', name: 'Data Publication Request - Questions', component: Questions },
                  { path: '/questionnaire/questions:formId', name: 'Data Publication Request - Questions with FormId', component: Questions },
                  { path: '/questionnaire/questions/:formId/:requestId', name: 'Data Publication Request - Questions with formId and requestId', component: Questions },
                  { path: '/questionnaire/help', name: 'Data Publication Request - Help', component: Help },
                  { path: '/404*', name: '404', component: PageNotFound }
                ]

const router = new VueRouter({ routes, mode: 'history', base: process.env.BASE_URL})
let store
let global_default_target = 'http://localhost:8081/interest/daacs/selection'

describe('creating test store', () => {
  store = new Vuex.Store({
    // State is the default obj and value
    state: {
      question_answers: [],
      global_params: {},
    },
    mutations: {
      // push question state to save the payload to the store state question_answers
      pushQuestionsState(state, payload){
        state.question_answers.push(Object.assign({}, payload))
      },
      pushGlobalParams(state, param){
        state.global_params[param[0]] = param[1]
      },
      // .emptyState() is needed by VuexUndoRedo
      emptyState() {
        this.replaceState({ question_answers: [] });
        this.replaceState({ global_params: [] });
      },
    },
    actions: {
  
    },
    getters: {
  
    },
    modules: {
      
    }
  })
})

const wrapper = mount(Daacs, { store, localVue, router })

/*** SANITY TESTS ***/
describe('Sanity and system checks', () => {
  // Quick sanity test -> if passes test system is set up correctly
  test('sanity test -> does a return so just makes sure jest and the system is responding before going further.', () => {
    return
  })
  // With this first simple test, I am making sure that my component does not crash completely with empty data.
  test('should renders a vue instance', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  });  
})
describe('location.href is accessible in this environment', () => {
  const { location } = window;
  beforeAll(() => {
      delete window.location;
      window.location = {
          href: '',
      };
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(), // Deprecated
          removeListener: jest.fn(), // Deprecated
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }))
      });
  });

  afterAll(() => {
      window.location = location;
      wrapper.destroy();
  });

  test('should handle assignments to location.href correctly', () => {
      window.location.href = global_default_target;
      expect(window.location.href).toBe(global_default_target);
  });
});
describe("App", () => {
  const { location } = window;
  beforeAll(() => {
      delete window.location;
      window.location = {
          href: '',
      };
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(), // Deprecated
          removeListener: jest.fn(), // Deprecated
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }))
      });
      localStorage.setItem('auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFiMTBhMDlkLWQzNDItNGVlZS1hOWViLWM5OWFjZDJkZGUxNyIsIm5hbWUiOiJFYXJ0aGRhdGEgUHViIFN5c3RlbSIsImVtYWlsIjoibm9fZW1haWwiLCJyZWdpc3RlcmVkIjoiMjAyMS0wMy0xNlQxNzowNDo1My4xMjRaIiwibGFzdF9sb2dpbiI6IjIwMjEtMDMtMTZUMTc6MDc6NDAuMjYxWiIsInVzZXJfZ3JvdXBzIjpbeyJpZCI6IjRkYWE2YjIyLWYwMTUtNGNlMi04ZGFjLThiMzUxMDAwNGZjYSIsImxvbmdfbmFtZSI6IlJvb3QgR3JvdXAiLCJzaG9ydF9uYW1lIjoicm9vdF9ncm91cCIsImRlc2NyaXB0aW9uIjoiRnVsbCBzeXN0ZW0gYWNjZXNzIGZvciBhZG1pbmlzdHJhdG9ycy4ifV0sInVzZXJfcm9sZXMiOlt7ImlkIjoiNzU2MDVhYzktYmY2NS00ZGVjLTg0NTgtOTNlMDE4ZGNjYTk3IiwibG9uZ19uYW1lIjoiRWFydGhkYXRhIFB1YiBBZG1pbmlzdHJhdG9yIiwic2hvcnRfbmFtZSI6ImFkbWluIiwiZGVzY3JpcHRpb24iOiJBbiBFYXJ0aGRhdGEgUHViIGFkbWluIGNhbiBzZWUgYW5kIGVkaXQgbW9zdCBhc3BlY3RzIG9mIEVhcnRoZGF0YSBQdWIuIn1dLCJwZXJtaXNzaW9ucyI6W10sInN1YnNjcmlwdGlvbnMiOnsiZm9ybSI6W10sImFjdGlvbiI6W10sInNlcnZpY2UiOltdLCJ3b3JrZmxvdyI6W10sInN1Ym1pc3Npb24iOltdfSwicmVmcmVzaF90b2tlbiI6bnVsbCwic3ViIjoiMWIxMGEwOWQtZDM0Mi00ZWVlLWE5ZWItYzk5YWNkMmRkZTE3Iiwic2NvcGUiOiJvcGVuaWQiLCJhdXRoX3RpbWUiOjE2MTU5MTQ0NjAwMDAsImlzcyI6IkVhcnRoZGF0YSBQdWIgRGV2IiwiZXhwIjoxNjE1OTE2MjYwMDAwLCJpYXQiOjE2MTU5MTQ0NjAwMDB9.QRM8fZOEEN-6nYQHSaD9n9Qn2TEZ8IEdGBA3eAONTxE')
  });

  afterAll(() => {
      window.location = location;
      wrapper.destroy();
  });
  
  test("tests the daac selection route", async () => {
    // This test will warn 'missing param for named route "Data Accession Request - Daacs": Expected "group" to be defined
    // This test is verifying that when the group is undefined, the user is routed to the 'Choose your DAAC' page to make group selection
    const router = new VueRouter({ routes })
    const wrapper = mount(App, { 
      localVue,
      router
    })
    await wrapper.vm.$nextTick()
    expect(location.href).toBe('http://localhost/interest/daacs/selection');
    expect(wrapper.text().includes('Choose your DAAC:')).toBe(true)
  })
})

/*** HEADER TESTS ***/
describe('Header', () => {
  // Clear out instance storage
  beforeEach(() => {
    // values stored in tests will also be available in other tests unless you run
    localStorage.clear();
    // you could also reset all mocks, but this could impact your other mocks
    jest.resetAllMocks();
    // or individually reset a mock used
    localStorage.setItem.mockClear();
    localStorage.setItem('auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFiMTBhMDlkLWQzNDItNGVlZS1hOWViLWM5OWFjZDJkZGUxNyIsIm5hbWUiOiJFYXJ0aGRhdGEgUHViIFN5c3RlbSIsImVtYWlsIjoibm9fZW1haWwiLCJyZWdpc3RlcmVkIjoiMjAyMS0wMy0xNlQxNzowNDo1My4xMjRaIiwibGFzdF9sb2dpbiI6IjIwMjEtMDMtMTZUMTc6MDc6NDAuMjYxWiIsInVzZXJfZ3JvdXBzIjpbeyJpZCI6IjRkYWE2YjIyLWYwMTUtNGNlMi04ZGFjLThiMzUxMDAwNGZjYSIsImxvbmdfbmFtZSI6IlJvb3QgR3JvdXAiLCJzaG9ydF9uYW1lIjoicm9vdF9ncm91cCIsImRlc2NyaXB0aW9uIjoiRnVsbCBzeXN0ZW0gYWNjZXNzIGZvciBhZG1pbmlzdHJhdG9ycy4ifV0sInVzZXJfcm9sZXMiOlt7ImlkIjoiNzU2MDVhYzktYmY2NS00ZGVjLTg0NTgtOTNlMDE4ZGNjYTk3IiwibG9uZ19uYW1lIjoiRWFydGhkYXRhIFB1YiBBZG1pbmlzdHJhdG9yIiwic2hvcnRfbmFtZSI6ImFkbWluIiwiZGVzY3JpcHRpb24iOiJBbiBFYXJ0aGRhdGEgUHViIGFkbWluIGNhbiBzZWUgYW5kIGVkaXQgbW9zdCBhc3BlY3RzIG9mIEVhcnRoZGF0YSBQdWIuIn1dLCJwZXJtaXNzaW9ucyI6W10sInN1YnNjcmlwdGlvbnMiOnsiZm9ybSI6W10sImFjdGlvbiI6W10sInNlcnZpY2UiOltdLCJ3b3JrZmxvdyI6W10sInN1Ym1pc3Npb24iOltdfSwicmVmcmVzaF90b2tlbiI6bnVsbCwic3ViIjoiMWIxMGEwOWQtZDM0Mi00ZWVlLWE5ZWItYzk5YWNkMmRkZTE3Iiwic2NvcGUiOiJvcGVuaWQiLCJhdXRoX3RpbWUiOjE2MTU5MTQ0NjAwMDAsImlzcyI6IkVhcnRoZGF0YSBQdWIgRGV2IiwiZXhwIjoxNjE1OTE2MjYwMDAwLCJpYXQiOjE2MTU5MTQ0NjAwMDB9.QRM8fZOEEN-6nYQHSaD9n9Qn2TEZ8IEdGBA3eAONTxE')
  });
  const { location } = window;
  beforeAll(() => {
      delete window.location;
      window.location = {
          href: '',
      };
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(), // Deprecated
          removeListener: jest.fn(), // Deprecated
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }))
      });
  });
  afterAll(() => {
      window.location = location;
      wrapper.destroy();
  });

  // UNIT TESTS
  test('showDaacs turns false, it should hide the DAACS link', async () => {
    // Default wrapper
    const wrapper = mount(Header, { 
      store, 
      localVue, 
      router
    })
    wrapper.setData({
      showDaacs: false
    });
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).not.toContain('daacs_nav_link')
  }),

  test('showDaacs turns true, it should show the DAACS link', async () => {
    // Default wrapper
    const wrapper = mount(Header, { 
      store, 
      localVue, 
      router
    })
    wrapper.setData({
      showDaacs: true
    });
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toContain('daacs_nav_link')
  }),

  test('daac is blank, should remove the href in questions not allowing a user to click.', async () => {
    const wrapper = mount(Header, { 
      store, 
      localVue, 
      router
    })
    wrapper.setData({
      showDaacs: true,
      daac: ''
    });
    await wrapper.vm.$nextTick()
    expect(wrapper.html().includes('id="questions_nav_link" href="#">Questions')).toBe(true);
  }),

  test('on form title change, should update the header title.', async () => {
    const wrapper = mount(Header, {  store,  localVue, router, propsData: {
      formTitle: 'Some Form Page'
    }})
    await wrapper.vm.$nextTick()
    expect(wrapper.text().includes('Some Form Page')).toBe(true);
  })

  // Clicking the links forces re-route to other components

});

/*** DAAC SELECTION TESTS ***/
describe('Daacs selection', () => {
  // Default wrapper
  const wrapper = mount(Daacs, {  store, localVue, router })
  // Clear out instance storage
  beforeEach(() => {
    // values stored in tests will also be available in other tests unless you run
    localStorage.clear();
    // you could also reset all mocks, but this could impact your other mocks
    jest.resetAllMocks();
    // or individually reset a mock used
    localStorage.setItem.mockClear();
    localStorage.setItem('auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFiMTBhMDlkLWQzNDItNGVlZS1hOWViLWM5OWFjZDJkZGUxNyIsIm5hbWUiOiJFYXJ0aGRhdGEgUHViIFN5c3RlbSIsImVtYWlsIjoibm9fZW1haWwiLCJyZWdpc3RlcmVkIjoiMjAyMS0wMy0xNlQxNzowNDo1My4xMjRaIiwibGFzdF9sb2dpbiI6IjIwMjEtMDMtMTZUMTc6MDc6NDAuMjYxWiIsInVzZXJfZ3JvdXBzIjpbeyJpZCI6IjRkYWE2YjIyLWYwMTUtNGNlMi04ZGFjLThiMzUxMDAwNGZjYSIsImxvbmdfbmFtZSI6IlJvb3QgR3JvdXAiLCJzaG9ydF9uYW1lIjoicm9vdF9ncm91cCIsImRlc2NyaXB0aW9uIjoiRnVsbCBzeXN0ZW0gYWNjZXNzIGZvciBhZG1pbmlzdHJhdG9ycy4ifV0sInVzZXJfcm9sZXMiOlt7ImlkIjoiNzU2MDVhYzktYmY2NS00ZGVjLTg0NTgtOTNlMDE4ZGNjYTk3IiwibG9uZ19uYW1lIjoiRWFydGhkYXRhIFB1YiBBZG1pbmlzdHJhdG9yIiwic2hvcnRfbmFtZSI6ImFkbWluIiwiZGVzY3JpcHRpb24iOiJBbiBFYXJ0aGRhdGEgUHViIGFkbWluIGNhbiBzZWUgYW5kIGVkaXQgbW9zdCBhc3BlY3RzIG9mIEVhcnRoZGF0YSBQdWIuIn1dLCJwZXJtaXNzaW9ucyI6W10sInN1YnNjcmlwdGlvbnMiOnsiZm9ybSI6W10sImFjdGlvbiI6W10sInNlcnZpY2UiOltdLCJ3b3JrZmxvdyI6W10sInN1Ym1pc3Npb24iOltdfSwicmVmcmVzaF90b2tlbiI6bnVsbCwic3ViIjoiMWIxMGEwOWQtZDM0Mi00ZWVlLWE5ZWItYzk5YWNkMmRkZTE3Iiwic2NvcGUiOiJvcGVuaWQiLCJhdXRoX3RpbWUiOjE2MTU5MTQ0NjAwMDAsImlzcyI6IkVhcnRoZGF0YSBQdWIgRGV2IiwiZXhwIjoxNjE1OTE2MjYwMDAwLCJpYXQiOjE2MTU5MTQ0NjAwMDB9.QRM8fZOEEN-6nYQHSaD9n9Qn2TEZ8IEdGBA3eAONTxE')
  });
  const { location } = window;
  beforeAll(() => {
      delete window.location;
      window.location = {
          href: '',
      };
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(), // Deprecated
          removeListener: jest.fn(), // Deprecated
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }))
      });
  });

  afterAll(() => {
      window.location = location;
      wrapper.destroy();
  });
  // UNIT TESTS
	
  // END-TO-END TESTS
  // You can directly manipulate the state of the component using the setData or setProps method on the wrapper:
  test('description and selection text should be blank, then should render "You have selected: Oak Ridge National Laboratory (ORNL) Distributed Active Archive Center (DAAC)"', async () => {
    expect(wrapper.text()).not.toMatch(/You have selected:/g)
    wrapper.setData({
      selected: 'Oak Ridge National Laboratory (ORNL) Distributed Active Archive Center (DAAC)'
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text().includes('Oak Ridge National Laboratory (ORNL) Distributed Active Archive Center (DAAC)')).toBe(true)
  })
  
});

/*** QUESTIONS TESTS ***/
describe('Questions', () => {
  const { location } = window;
  beforeAll(() => {
      delete window.location;
      window.location = {
          href: '',
      };
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(), // Deprecated
          removeListener: jest.fn(), // Deprecated
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }))
      });
  });

  afterAll(() => {
      window.location = location;
      wrapper.destroy();
  });

  // Clear out instance storage
  beforeEach(() => {
    // values stored in tests will also be available in other tests unless you run
    localStorage.clear();
    // you could also reset all mocks, but this could impact your other mocks
    jest.resetAllMocks();
    // or individually reset a mock used
    localStorage.setItem.mockClear();
    localStorage.setItem('auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFiMTBhMDlkLWQzNDItNGVlZS1hOWViLWM5OWFjZDJkZGUxNyIsIm5hbWUiOiJFYXJ0aGRhdGEgUHViIFN5c3RlbSIsImVtYWlsIjoibm9fZW1haWwiLCJyZWdpc3RlcmVkIjoiMjAyMS0wMy0xNlQxNzowNDo1My4xMjRaIiwibGFzdF9sb2dpbiI6IjIwMjEtMDMtMTZUMTc6MDc6NDAuMjYxWiIsInVzZXJfZ3JvdXBzIjpbeyJpZCI6IjRkYWE2YjIyLWYwMTUtNGNlMi04ZGFjLThiMzUxMDAwNGZjYSIsImxvbmdfbmFtZSI6IlJvb3QgR3JvdXAiLCJzaG9ydF9uYW1lIjoicm9vdF9ncm91cCIsImRlc2NyaXB0aW9uIjoiRnVsbCBzeXN0ZW0gYWNjZXNzIGZvciBhZG1pbmlzdHJhdG9ycy4ifV0sInVzZXJfcm9sZXMiOlt7ImlkIjoiNzU2MDVhYzktYmY2NS00ZGVjLTg0NTgtOTNlMDE4ZGNjYTk3IiwibG9uZ19uYW1lIjoiRWFydGhkYXRhIFB1YiBBZG1pbmlzdHJhdG9yIiwic2hvcnRfbmFtZSI6ImFkbWluIiwiZGVzY3JpcHRpb24iOiJBbiBFYXJ0aGRhdGEgUHViIGFkbWluIGNhbiBzZWUgYW5kIGVkaXQgbW9zdCBhc3BlY3RzIG9mIEVhcnRoZGF0YSBQdWIuIn1dLCJwZXJtaXNzaW9ucyI6W10sInN1YnNjcmlwdGlvbnMiOnsiZm9ybSI6W10sImFjdGlvbiI6W10sInNlcnZpY2UiOltdLCJ3b3JrZmxvdyI6W10sInN1Ym1pc3Npb24iOltdfSwicmVmcmVzaF90b2tlbiI6bnVsbCwic3ViIjoiMWIxMGEwOWQtZDM0Mi00ZWVlLWE5ZWItYzk5YWNkMmRkZTE3Iiwic2NvcGUiOiJvcGVuaWQiLCJhdXRoX3RpbWUiOjE2MTU5MTQ0NjAwMDAsImlzcyI6IkVhcnRoZGF0YSBQdWIgRGV2IiwiZXhwIjoxNjE1OTE2MjYwMDAwLCJpYXQiOjE2MTU5MTQ0NjAwMDB9.QRM8fZOEEN-6nYQHSaD9n9Qn2TEZ8IEdGBA3eAONTxE')
  });
  // UNIT TESTS
  // This should be written better when the api call has been inserted because it will change the test entirely.
  test('on going to the route /interest/questions/15df4fda-ed0d-417f-9124-558fb5e5b561, it will go to the questions page then load the questions data"', async () => {
    const fetchQuestions = jest.fn()
    jest.spyOn(localStorage, 'setItem');
    window.localStorage.__proto__.setItem = jest.fn();
    const wrapper = mount(Questions, {localVue, methods: { fetchQuestions }})
    const relative_path = "/interest/questions/15df4fda-ed0d-417f-9124-558fb5e5b561"
    router.push(relative_path)
    await wrapper.vm.$nextTick()
    expect(fetchQuestions).toHaveBeenCalledTimes(1)
    
  })
	// END-TO-END TESTS
  // 
});

/*** HELP TESTS ***/
// This should be written better when the api call has been inserted because it should change the test.
describe('Help', () => {
  const { location } = window;

  beforeAll(() => {
      delete window.location;
      window.location = {
          href: '',
      };
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(), // Deprecated
          removeListener: jest.fn(), // Deprecated
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }))
      });
  });

  afterAll(() => {
      window.location = location;
      wrapper.destroy();
  });

  beforeEach(() => {
    // values stored in tests will also be available in other tests unless you run
    localStorage.clear();
    // you could also reset all mocks, but this could impact your other mocks
    jest.resetAllMocks();
    // or individually reset a mock used
    localStorage.setItem.mockClear();
    localStorage.setItem('auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFiMTBhMDlkLWQzNDItNGVlZS1hOWViLWM5OWFjZDJkZGUxNyIsIm5hbWUiOiJFYXJ0aGRhdGEgUHViIFN5c3RlbSIsImVtYWlsIjoibm9fZW1haWwiLCJyZWdpc3RlcmVkIjoiMjAyMS0wMy0xNlQxNzowNDo1My4xMjRaIiwibGFzdF9sb2dpbiI6IjIwMjEtMDMtMTZUMTc6MDc6NDAuMjYxWiIsInVzZXJfZ3JvdXBzIjpbeyJpZCI6IjRkYWE2YjIyLWYwMTUtNGNlMi04ZGFjLThiMzUxMDAwNGZjYSIsImxvbmdfbmFtZSI6IlJvb3QgR3JvdXAiLCJzaG9ydF9uYW1lIjoicm9vdF9ncm91cCIsImRlc2NyaXB0aW9uIjoiRnVsbCBzeXN0ZW0gYWNjZXNzIGZvciBhZG1pbmlzdHJhdG9ycy4ifV0sInVzZXJfcm9sZXMiOlt7ImlkIjoiNzU2MDVhYzktYmY2NS00ZGVjLTg0NTgtOTNlMDE4ZGNjYTk3IiwibG9uZ19uYW1lIjoiRWFydGhkYXRhIFB1YiBBZG1pbmlzdHJhdG9yIiwic2hvcnRfbmFtZSI6ImFkbWluIiwiZGVzY3JpcHRpb24iOiJBbiBFYXJ0aGRhdGEgUHViIGFkbWluIGNhbiBzZWUgYW5kIGVkaXQgbW9zdCBhc3BlY3RzIG9mIEVhcnRoZGF0YSBQdWIuIn1dLCJwZXJtaXNzaW9ucyI6W10sInN1YnNjcmlwdGlvbnMiOnsiZm9ybSI6W10sImFjdGlvbiI6W10sInNlcnZpY2UiOltdLCJ3b3JrZmxvdyI6W10sInN1Ym1pc3Npb24iOltdfSwicmVmcmVzaF90b2tlbiI6bnVsbCwic3ViIjoiMWIxMGEwOWQtZDM0Mi00ZWVlLWE5ZWItYzk5YWNkMmRkZTE3Iiwic2NvcGUiOiJvcGVuaWQiLCJhdXRoX3RpbWUiOjE2MTU5MTQ0NjAwMDAsImlzcyI6IkVhcnRoZGF0YSBQdWIgRGV2IiwiZXhwIjoxNjE1OTE2MjYwMDAwLCJpYXQiOjE2MTU5MTQ0NjAwMDB9.QRM8fZOEEN-6nYQHSaD9n9Qn2TEZ8IEdGBA3eAONTxE')
  });
  
  // UNIT TESTS
  test('on going to the route help, it will go to the help page and render help data', async () => {
    const fetchHelp = jest.fn()
    const wrapper = mount(Help, {localVue, methods: { fetchHelp }})
    const relative_path = "/help"
    router.push(relative_path)
    await wrapper.vm.$nextTick()
    expect(fetchHelp).toHaveBeenCalledTimes(1)
  })
	
  // END-TO-END TESTS
 
});

afterAll(() => {
  window.location = location;
  wrapper.destroy();
});

/*** METHODS:***/
/*

*/
/*** MIXIN METHODS: ***/
/*

*/