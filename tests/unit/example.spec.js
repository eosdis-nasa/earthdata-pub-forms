import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
// Example found from :
// https://vue-test-utils.vuejs.org/guides/testing-single-file-components-with-jest.html
describe('HelloWorld.vue', () => {
  // Inspect the raw component options
  it('has a created hook', () => {
    expect(typeof HelloWorld.created).toBe('function')
  })
  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof HelloWorld.data).toBe('function')
    const defaultData = HelloWorld.data()
    expect(defaultData.message).toBe('hello!')
  })
  // Inspect the component instance on mount
  it('correctly sets the message when created', () => {
    expect(wrapper.vm.$data.message).toBe('bye!')
  })

  // Mount an instance and inspect the render output
  it('renders the correct message', () => {
    expect(wrapper.text()).toBe('bye!')
  })

  test('renders correctly', () => {
    const wrapper = mount(HelloWorld)
    expect(wrapper.element).toMatchSnapshot()
  })
})
