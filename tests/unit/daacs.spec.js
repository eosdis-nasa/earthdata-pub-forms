import { createLocalVue, shallowMount, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue';
import Daacs from '@/components/Daacs.vue'

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const wrapper = mount(Daacs, { localVue })

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

/*** SANITY TESTS ***/
describe('Sanity and system checks', () => {
  // Quick sanity test -> if passes test system is set up correctly
  test('sanity test -> does a return so just makes sure jest and the system is responding before going further.', () => {
    return
  })
  // With this first simple test, I am making sure that my component does not crash completely with empty data.
  it('should renders a vue instance', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  });  
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
  // UNIT TESTS

  // END-TO-END TESTS
  // on clicking nav after selection:
    // loads questions
    // sets address bar without reloading
    // sets the hrefs in navigation
    // sets the objects({DAAC}_questions in localStorage
  
  // on clicking nav without selection:
    // daac:
      // 
    // questions:
      // 
    // help:
      //
});

/*** DAAC SELECTION TESTS ***/
describe('Daacs selection', () => {
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
  // sets address bar without reloading
	// sets the selected value
	// sets the long text
	// selects the link text
	// sets the hrefs in the navigation
  // sets the localStorage
  
  // END-TO-END TESTS
  // You can directly manipulate the state of the component using the setData or setProps method on the wrapper:
  it('description and selection text should be blank, then should render "You have selected: Oak Ridge National Laboratory (ORNL) Distributed Active Archive Center (DAAC)"', async () => {
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
  // 
	
  // END-TO-END TESTS
  // 
});

/*** HELP TESTS ***/
describe('Help', () => {
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
  // clicking help from questions help link
  // clicking help from menu
	
  // END-TO-END TESTS
  // 
});