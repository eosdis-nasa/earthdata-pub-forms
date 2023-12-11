import { shallowMount } from "@vue/test-utils";
import mixin from "@/mixins/mixin.js"
import MockComponent from "./MockComponent"

describe("Test mounted mixin file", () => {
    const wrapper = shallowMount(MockComponent, {
      mixins: [mixin]
    });
  
    // Testing titleCase function
    it("should return a titlecased string", () => {
        expect(wrapper.vm.titleCase("edpub is awesome")).toBe("Edpub Is Awesome")
    })

    it("should return undefined", () => {
        expect(wrapper.vm.titleCase()).toBe("undefined")
    })
})