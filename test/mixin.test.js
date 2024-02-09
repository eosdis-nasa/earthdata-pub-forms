import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from 'vuex'

import mixin from "@/mixins/mixin.js"
import MockComponent from "./MockComponent"
import { test_daacs } from "./test_constants"

// https://www.leighhalliday.com/mock-fetch-jest
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(test_daacs)
  })
);

describe("Test mounted mixin file", () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)

  let wrapper
  let store

  beforeEach(() => {
    fetch.mockClear();

    store = new Vuex.Store({
      commit: jest.fn(),
      state: {
        question_answers: [],
        global_params: {formTitle: "DAAC Selection"},
        token: ''
      }
    })

    wrapper = shallowMount(MockComponent, {
      mixins: [mixin],
      data() {
        return {
          selected: "",
          loaded: false,
          daacs: [],
          $route: {
            query: {},
            params: {}
          },
          $testing: false,
        };
      },
      localVue,
      store
    });
  });

  // Testing titleCase function
  it("should return a titlecased string", () => {
      expect(wrapper.vm.titleCase("edpub is awesome")).toBe("Edpub Is Awesome")
  })

  it("should return undefined", () => {
      expect(wrapper.vm.titleCase()).toBe("undefined")
  })

  //Testing fetchDaacs function
  it("should return an array containing info about the daacs", async () => {
    expect(wrapper.vm.daacs).toHaveLength(0)

    const result = await wrapper.vm.fetchDaacs();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(test_daacs)

    // Verify that it added objects to daacs
    expect(wrapper.vm.daacs).toHaveLength(12)

  });

  // Testing getDaac function
  it("should return an object with no values", () => {
    expect(wrapper.vm.getDaac()).toMatchObject({
      "id": "",
      "long_name": "",
      "url": "",
      "short_name": "",
      "description": ""
    });
  })

  it("should return the NSIDS DAAC object", () => {
    wrapper.setData({
      daacs: test_daacs
    });

    const expected = {
      "id": "aec3724f-b30b-4b3f-9b9a-e0907d9d14b3",
      "long_name": "National Snow and Ice Data Center (NSIDC) Distributed Active Archive Center (DAAC)",
      "url": "http://nsidc.org/daac/",
      "short_name": "NSIDC DAAC",
      "description": "NASA's National Snow and Ice Data Center (NSIDC) Distributed Active Archive Center (DAAC) provides data and information for snow and ice processes, particularly interactions among snow, ice, atmosphere, and ocean, in support of research in global change detection and model validation.\nNSIDC DAAC archives and distributes cryosphere and climate related products from several EOS sensors including:\n Advanced Microwave Scanning Radiometer - EOS  (AMSR-E)\nAMSR2\nAquarius Airborne Snow Observatory  (ASO)\nCold Land Processes Field Experiment  (CLPX)\nGlobal Land Ice Measurements  (GLIMS)\nIceBridge ICESat/Geoscience Laser Altimeter System  (GLAS)\nIce, Cloud, and land Elevation Satellite-2  (ICESat-2)\nModerate Resolution Imaging Spectroradiometer  (MODIS)\nSoil Moisture Active Passive  (SMAP)\nScanning Multichannel Microwave Radiometer  (SMMR)\nSpecial Sensor Microwave Imager  (SSM/I)\nSpecial Sensor Microwave Imager/Sounder  (SSMIS)\nSnow Experiment  (SnowEX)\nVisible Infrared Imaging Radiometer Suite  (VIIRS)\nNSIDC DAAC also provides general data and information services to the cryospheric and polar processes research community. NSIDC DAAC is located in Boulder, CO. NSIDC DAAC has served at the forefront of cryospheric data management practices since 1976. NSIDC DAAC is part of the Cooperative Institute for Research in Environmental Sciences (CIRES), a joint institute of University of Colorado Boulder and the National Oceanic and Atmospheric Administration.\n",
    }

    expect(wrapper.vm.getDaac("NSIDC DAAC")).toMatchObject(expected);
    expect(wrapper.vm.getDaac("National Snow and Ice Data Center (NSIDC) Distributed Active Archive Center (DAAC)")).toMatchObject(expected);
    expect(wrapper.vm.getDaac("aec3724f-b30b-4b3f-9b9a-e0907d9d14b3")).toMatchObject(expected);
  })

  // Testing countDownChanged function
  it("should update dismissCountDown value", () => {
    const dismissCountDown = 42;
   
    wrapper.vm.countDownChanged(dismissCountDown);
    expect(wrapper.vm.dismissCountDown).toBe(dismissCountDown);
  });

});