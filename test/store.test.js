// Adapted from example at https://github.com/vueschool/testing-vue-components/blob/solutions/specs/salad.spec.js
import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'

import MockComponent from "./MockComponent"

describe('store', () => {
    const VueWithVuex = createLocalVue()
    VueWithVuex.use(Vuex)

    let wrapper
    let store

    beforeEach( () => {
        // resetModules and requiring the store here allows the tests to fully reset between test cases
        jest.resetModules();
        store = require('@/store').store;

        wrapper = mount(MockComponent, {
            localVue: VueWithVuex,
            store
        })

    })

    test('store is loaded ', () => {
        
        expect(wrapper.vm.$store.state.global_params).toHaveProperty('formTitle')
    })

    test('pushGlobalParams mutation', () => {

        store.commit("pushGlobalParams", ['formId', "abc123"])
        
        expect(wrapper.vm.$store.state.global_params.formId).toEqual('abc123')
    })

    test('emptyState mutation', () => {

        expect(wrapper.vm.$store.state.global_params).toHaveProperty('formTitle')

        store.commit('emptyState')
        
        expect(wrapper.vm.$store.state.global_params).toEqual({})
    })

    test('setToken mutation', () => {

        expect(wrapper.vm.$store.state.token).toBeFalsy()

        store.commit('setToken', 'abc123')
        
        expect(wrapper.vm.$store.state.token).toEqual('abc123')
    })
})