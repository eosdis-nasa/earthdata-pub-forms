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
import { createLocalVue, shallowMount, mount } from '@vue/test-utils'
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
import Vuex, { mapActions } from 'vuex'
import VuexUndoRedo from 'vuex-undo-redo';

const localVue = createLocalVue();
localVue.use(VueRouter)
localVue.use(BootstrapVue);
localVue.use(Vuelidate)
localVue.use(Vuex)
localVue.use(VuexUndoRedo)
localVue.use(LayoutPlugin)

const routes = [  { path: '/', name: 'Home', component: Home },
                  { path: '/daacs/:default', name: 'Daacs', component: Daacs, alias: '/daacs/selection' },
                  { path: '/questions/:default', name: 'Questions', component: Questions },
                  { path: '/help/:default', name: 'Help', component: Help },
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
    const relative_path = "/daacs/selection"
    router.push(relative_path)
    await wrapper.vm.$nextTick()
    expect(window.location.href).toBe(relative_path);
    expect(wrapper.text().includes('Choose your DAAC:')).toBe(true)
  })
  /*,
  describe('builds store to test state action and html5 response', () => {
    /*
    let actions
    let store
  
    beforeEach(() => {
      actions = {
        actionClick: jest.fn(),
        actionInput: jest.fn()
      }
      store = new Vuex.Store({
        router: routes,
        actions
      })
    })

    it('dispatches "actionInput" when input event email value is "something@example.com"', () => {
      const wrapper = mount(App, { store, localVue })
      const input = wrapper.find('email')
      input.element.value = 'something@example.com'
      input.trigger('email')
      expect(actions.actionInput).toHaveBeenCalled()
    })
  
    it('does not dispatch "actionInput" when event value is not correct', () => {
      const wrapper = shallowMount(Questions, { store, localVue })
      const input = wrapper.find('email')
      input.element.value = 'not correct'
      input.trigger('email')
      expect(actions.actionInput).not.toHaveBeenCalled()
    })
  
    it('calls store action "actionClick" when button is clicked', () => {
      const wrapper = shallowMount(Questions, { store, localVue })
      wrapper.find('undo_button').trigger('click')
      expect(actions.actionClick).toHaveBeenCalled()
    })
  })*/
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
      router,
      data(){
        return {
          showDaacs: false,
          daac:'selection'
        }
      } 
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).not.toContain('daacs_nav_link')
  }),

  test('showDaacs turns true, it should show the DAACS link', async () => {
    // Default wrapper
    const wrapper = mount(Header, { 
      store, 
      localVue, 
      router,
      data(){
        return {
          showDaacs: true,
          daac:'selection'
        }
      } 
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toContain('daacs_nav_link')
  }),

  test('daac is blank, should remove the href in questions not allowing a user to click.', async () => {
    const wrapper = mount(Header, { 
      store, 
      localVue, 
      router,
      data(){
        return {
          showDaacs: true,
          daac:''
        }
      } 
    })
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
    expect(wrapper.text()).toContain('You have selected: Oak Ridge National Laboratory (ORNL) Distributed Active Archive Center (DAAC)')
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
  test('on going to the route questions/ornl_daac, it will go to the questions page then load the questions data"', async () => {
    const fetchQuestions = jest.fn()
    jest.spyOn(localStorage, 'setItem');
    window.localStorage.__proto__.setItem = jest.fn();
    const wrapper = mount(Questions, {localVue, methods: { fetchQuestions }})
    const relative_path = "/questions/ornl_daac"
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

afterEach(() => {
  wrapper.destroy();
});
/*
/*** COMPONENT MARKUP / EVALUATION ***/
/*Header and component navigation:
	props/data:
		showDaacs
		daac
		formTitle
		functions:
			showdaacs:
				if !showdaacs, opens questions with default = the daac
			on created:
				get parameters sent in and sets this.showDaacs and localStorage
				else get daac from localStorage if its set and sets this.showdaacs
				else set localStorage to default of data prop
			on clicking nav after selection:
				from daacs:
					daacs - nothing
					questions - loads questions defaulting to the selected daac
					help - loads all help
				from questions:
					daacs - loads questions defaulting to the selected daac
					questions - nothing
					help - loads all help
				from help:
					daacs - loads questions defaulting to the selected daac
					questions - loads questions defaulting to the selected daac
					help - nothing
				refreshes the header
				sets the class of the header active object
			on clicking nav NO selection:
				from /:
					routes to /daacs/selection
					refreshes the header
					sets the class of the header active object
					sets showDaacs in localStorage
					
					clicking:
						daacs - nothing
						questions - should alert to select a daac first
						help - loads all help
				from /daacs:
					routes to /daacs/selection ('/')
				from /questions:
					routes to /daacs/selection ('/')

Daacs:
	props/data:
		selected,
		loaded
		daacs
		unique functions:
			fetchsDaacs
			GetCurrentDaacAndUpdate:
				On load, looks for this.selected, param default or localStorage for autoselection then clicks daac radio object (executes the setSelectedValues)
			setSelectedValues:
				Receives the selected daac data ({ 'short_name':short_name, 'long_name': long_name, 'url':url, 'description':description }), 
				then sets the current daac objects (setCurrentDaacObjects). 
				Then if there's a new daac selected, reruns with the new daac short name, 
				updates the address bar, 
				updates the header and saves
			getDaac(daac)
				Gets this.daacs specific daac data and returns the daacs { 'short_name':short_name, 'long_name': long_name, 'url':url, 'description':description }
			setCurrentDaacObjects:
				Receives getDaac data or if none, looks it up (getDaac), then sets the text, url, description, this.selected and this.data (returns short_name). Sets active link in header.
			save:
				if something was selected, saves to localStorage and updates the header
			submit:
				if seomthing was selected, pushes through the router to Questions with the default as the selected or reroutes to daacs

Questions:
	props/data:
		values
		questions
		dirty (only file uses this)
		formTitle:
		saveTimeout:0
		daac
		resetLabel
		saveLabel
		undoLabel
		redoLabel
		submitLabel
		enterSubmit
		readonly
		showResetButton
	validations:
		sets the daac if in localStorage
		gathers required inputs and stores them in localStorage for later evaluation -> returns this object
	mounted:
		on load, gets daac from local storage and if showDaacs is false refreshes header in form. sets this.daac
		runs questions function (fetchQuestions)
		sets active nav link
		update the address bar without reload (or state capture) to reflect the daac
		update header
	functions:
		reApplyValues
			resets values from undo redo
		fetchQuestions
			sets this.formTitle
			loads question data
			appends style
			returns question object
		submitForm:
			does this.$emit from localStorage question data object
		saveFile:
			gets values
			gets daac from local storage if not set in questions.vue
			sets data storage if not empty
			Will alert a message if is passed string
		reset:
			Clears form
		redo:
			Redos last action
			then reApplyValues
		undo:
			Undoes last action
      then reApplyValues
*/