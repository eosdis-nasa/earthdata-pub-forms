import { createLocalVue, mount } from "@vue/test-utils"
import Vuex from "vuex"
import flushPromises from 'flush-promises'
import FormsDaacs from "@/components/FormsDaacs";
import { BootstrapVue, BootstrapVueIcons, IconsPlugin } from 'bootstrap-vue'

import { test_daacs } from "./test_constants"

Object.defineProperty(window, "headerComponent", {
  value: {
     daac: undefined
  },
  writable: true
});


global.fetch = jest.fn(() =>
  Promise.resolve({
    ok:true,
    json: () => Promise.resolve(test_daacs),
  }),
)

describe('FormsDaacs', () => {
  const localVue = createLocalVue()

  localVue.use(Vuex)
  localVue.use(BootstrapVue)
  // Optionally install the BootstrapVue icon components plugin
  localVue.use(BootstrapVueIcons)
  // Optionally install the BootstrapVue icon components plugin
  localVue.use(IconsPlugin)

  let wrapper
  let store


  beforeEach( () => {
    store = new Vuex.Store({
      state: {
        question_answers: [],
        global_params: {formTitle: "DAAC Selection"},
        token: ''
      }
    })

    wrapper = mount(FormsDaacs, { localVue, store})
    
  });


  it ('checks that the expected number of radio buttons are displayed', () => {
  
    const radio_buttons = wrapper.findAllComponents('.custom-radio')
    expect(radio_buttons).toHaveLength(12)
   
  })

  it ('checks that nothing is selected by default', () => {

    const selected = wrapper.findComponent('#selected_daac')
    expect(selected.exists()).toBeFalsy()
    
  })

  // // TODO - figure out why the vue doesn't update the infoSection properly
  // it ('checks that info is populated when radio button is selected', async () => {

  //   const infoSection = wrapper.getComponent('.info_section')
  //   const radioInput = wrapper.getComponent('[name="ORNL_DAAC"]')

  //   expect(infoSection.text()).toBeFalsy()
  //   expect(radioInput.element.checked).toBe(false)

  //   await radioInput.setChecked()
  //   await flushPromises()

  //   expect(radioInput.element.checked).toBe(true)
  //   expect(infoSection.text()).toBeTruthy()

  //   const description = wrapper.getComponent('#selected_description')
  //   expect(description.text()).toBe("NASA's Oak Ridge National Laboratory (ORNL) Distributed Active Archive Center (DAAC) is located at the Oak Ridge National Laboratory in Oak Ridge, Tennessee. ORNL DAAC was established in 1993 and is under an interagency agreement between NASA and the Department of Energy.\nORNL DAAC specializes on data and information relevant to terrestrial biogeochemistry, ecology, and environmental processes, which are critical to understanding the dynamics of Earth's biological, geological, and chemical components.")
    
  // })

})
