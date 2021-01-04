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
import Home from '@/components/Home.vue'
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

const routes = [  { path: '/', name: 'Home', component: Home },
                  { path: '/interest/daacs/:group', name: 'Data Publication Request - Daacs', component: Daacs, alias: '/interest/daacs/selection' },
                  { path: '/interest/questions/:group', name: 'Data Publication Request - Questions', component: Questions },
                  { path: '/interest/questions/:group/:formId', name: 'Data Publication Request - Questions with FormId', component: Questions },
                  { path: '/interest/questions/:group/:formId/:submissionId', name: 'Data Publication Request - Questions with formId and submissionId', component: Questions },
                  { path: '/interest/help', name: 'Data Publication Request - Help', component: Help },
                  { path: '/questionnaire/questions', name: 'Data Product Information - Questions', component: Questions },
                  { path: '/questionnaire/questions:formId', name: 'Data Product Information - Questions with FormId', component: Questions },
                  { path: '/questionnaire/questions/:formId/:submissionId', name: 'Data Product Information - Questions with formId and submissionId', component: Questions },
                  { path: '/questionnaire/help', name: 'Data Product Information - Help', component: Help },
                  { path: '/404*', name: '404', component: PageNotFound }
                ]

const router = new VueRouter({ routes, mode: 'history' })
let actions
let store
let global_default_target = 'http://localhost:8080/daacs/selection'

describe('creating test store', () => {
    store = new Vuex.Store({ 
      actions,
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
  });

  afterAll(() => {
      window.location = location;
      wrapper.destroy();
  });
  test("tests the daac selection route", async () => {
    const router = new VueRouter({ routes })
    const wrapper = mount(App, { 
      localVue,
      router
    })
    const relative_path = "/interest/daacs/selection"
    router.push(relative_path)
    await wrapper.vm.$nextTick()
    expect(window.location.href).toBe(relative_path);
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
    expect(wrapper.html().includes('id="questions_nav_link" href="#">Questions</a>')).toBe(true);
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
  });
  // UNIT TESTS
  // This should be written better when the api call has been inserted because it will change the test entirely.
  test('on going to the route /interest/questions/ornl_daac, it will go to the questions page then load the questions data"', async () => {
    const fetchQuestions = jest.fn()
    jest.spyOn(localStorage, 'setItem');
    window.localStorage.__proto__.setItem = jest.fn();
    const wrapper = mount(Questions, {localVue, methods: { fetchQuestions }})
    const relative_path = "/interest/questions/ornl_daac"
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
// Redo the form and to its previous state.
redoToPreviousState()
// Undos the form and reverts it to its previous state.
undoToPreviousState()
// Re-applies the data entry values from values from the store for on undo and redo
reApplyValues()
// Exit form to home page
exitForm()
// Resets form and local storage to empty entries
cancelForm(evt)
// Cancel and exit form
okToCancel(place_to_redirect)
// Save as draft and exit form
draftFile(from)
// Used to save file
saveFile(from)
// Used to submit the form data if valid
submitForm(from)
// Sends data to the API
sendDataToApi(bvModal)
// Prevents submit to apply validation; @arg The event
enterSubmitForm(evt)
// Validation of input data returns error and if dirty
status(validation)
// Fetchs the questions data
fetchQuestions()
// Hides errors banner
dismiss(id)
// Handle html5 invalidity on form
handleInvalid(evt)
// Gets input attributes or undefined
getAttribute(attr, input)
// Gets characters remaining from textarea
charactersRemaining(value, maxlength)
// Gets contacts and builds options for checkbox
setContacts (values)
// Copies over contact information from the 'same as' checkbox for contact
setContact(id_to, contact)
// Shows and Hides based of json show_if
showIf(config)
// Gets custom bbox validation errors; returns blank if valid
getBboxError(fld, direction)
// Validates required question inputs; returns true if valid
validateQuestionInputsRequired(inputs)
*/
/*** MIXIN METHODS: ***/
/*
// Converts sentence string to title case
titleCase(str)
// Re-evaluates the route and changes it if applicable
resetRoute()
// get Path via parameters, form title (json), then route path 
getPath()
// get Path via parameters, form title, then property 
setShowDaacs()
// Set Daacs daac via parameters or windows storage 
setDaacs()
// Set active nav element
setActiveNav(activeElement, navs = ['daacs', 'help', 'questions'], activeClass = 'router-link-exact-active router-link-active')
// Get active nav element according to class of nav elements
getActiveNavViaClass(navs = ['daacs', 'help', 'questions'], activeClass = 'router-link-exact-active.router-link-active')
// Set active nav element according to location.href value
setActiveNavViaLocation(navs = ['daacs', 'help', 'questions'])
// Set / Resets active location.href value without updating state
setActiveLocationWithoutReload(lctn = location.href, shortName)
*/