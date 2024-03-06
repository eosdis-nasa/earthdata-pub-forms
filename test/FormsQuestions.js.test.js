import { createLocalVue, mount } from "@vue/test-utils"
import Vuex from "vuex"
import FormsQuestions from "@/components/FormsQuestions";
import { BootstrapVue, BootstrapVueIcons, IconsPlugin } from 'bootstrap-vue'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

import fq from '@/assets/js/FormsQuestions'

describe('FormsQuestions', () => {
    const localVue = createLocalVue()
  
    localVue.use(Vuex)
    localVue.use(BootstrapVue)
    // Optionally install the BootstrapVue icon components plugin
    localVue.use(BootstrapVueIcons)
    // Optionally install the BootstrapVue icon components plugin
    localVue.use(IconsPlugin)

    library.add(fas)
    dom.watch()
    localVue.component('font-awesome-icon', FontAwesomeIcon)
  
    let wrapper
    let store
  
  
    beforeEach( () => {

      store = new Vuex.Store({
        state: {
          question_answers: [],
          global_params: {
            formTitle: "DAAC Selection",
            formId: 'formId'
        },
          token: ''
        }
      })
  
      wrapper = mount(FormsQuestions, { localVue, store, mixins: [fq]});

      localStorage.getItem = jest.fn(() => 'auth-token');
      global.window.location.href = '';
      
    });

    afterEach(() => {
      // restore the spy created with spyOn
      jest.restoreAllMocks();
    });

    test('calls compareDataAskLeave with "daacs"', () => {
      // Mock the compareDataAskLeave method
      const compareDataAskLeaveMock = jest.spyOn(wrapper.vm, 'compareDataAskLeave').mockImplementation()
  
      // Call the goToDaacs method
      wrapper.vm.goToDaacs();
  
      // Expect compareDataAskLeave to be called with 'daacs'
      expect(compareDataAskLeaveMock).toHaveBeenCalledWith('daacs');
    });
    
    test('fixes the date format when a valid date is entered', () => {
      // Set up initial state
      wrapper.vm.values = {
        dateField: '01/01/2024',
      };
  
      // Call the fixDate method
      wrapper.vm.fixDate({ target: { id: 'dateField' } });
  
      // Expect the date to be converted to ISO format
      expect(wrapper.vm.values.dateField).toBe('2024-01-01');
    });
  
    test('does not modify the date when an invalid date is entered', () => {
      // Set up initial state
      wrapper.vm.values = {
        dateField: 'invalid-date',
      };
  
      // Call the fixDate method
      wrapper.vm.fixDate({ target: { id: 'dateField' } });
  
      // Expect the date to remain unchanged
      expect(wrapper.vm.values.dateField).toBe('invalid-date');
    });

    test ('getBboxError all values above expected', () => {
        // Mock fld and set values
        const fld = { control_id: 'test' };
        wrapper.vm.values = {
          test_north: '90.1',
          test_south: '90.1',
          test_east: '180.1',
          test_west: '180.1',
        };
    
        // Call the method and assert the returned value
        expect(wrapper.vm.getBboxError(fld, 'north')).toContain('N must be less than 90.0');
        expect(wrapper.vm.getBboxError(fld, 'south')).toContain('S must be less than 90.0');
        expect(wrapper.vm.getBboxError(fld, 'east')).toContain('E must be less than 180.0');
        expect(wrapper.vm.getBboxError(fld, 'west')).toContain('W must be less than 180.0');
    });

    test ('getBboxError all values below expected', () => {
        // Mock fld and set values
        const fld = { control_id: 'test' };
        wrapper.vm.values = {
          test_north: '-90.1',
          test_south: '-90.1',
          test_east: '-180.1',
          test_west: '-180.1',
        };
    
        // Call the method and assert the returned value
        expect(wrapper.vm.getBboxError(fld, 'north')).toContain('N must be greater than -90.0');
        expect(wrapper.vm.getBboxError(fld, 'south')).toContain('S must be greater than -90.0');
        expect(wrapper.vm.getBboxError(fld, 'east')).toContain('E must be greater than -180.0');
        expect(wrapper.vm.getBboxError(fld, 'west')).toContain('W must be greater than -180.0');
    });

    test ('getBboxError all values in range', () => {
        // Mock fld and set values
        const fld = { control_id: 'test' };
        wrapper.vm.values = {
          test_north: '90',
          test_south: '-90',
          test_east: '180',
          test_west: '-180',
        };
    
        // Call the method and assert the returned value
        expect(wrapper.vm.getBboxError(fld, 'north')).toContain('');
        expect(wrapper.vm.getBboxError(fld, 'south')).toContain('');
        expect(wrapper.vm.getBboxError(fld, 'east')).toContain('');
        expect(wrapper.vm.getBboxError(fld, 'west')).toContain('');
    });

    test ('getBboxError N/S and E/W Compatability - S & W Greater than N & E ', () => {
        // Mock fld and set values
        const fld = { control_id: 'test' };
        wrapper.vm.values = {
          test_north: '35',
          test_south: '42',
          test_east: '35',
          test_west: '42',
        };
    
        // Call the method and assert the returned value
        expect(wrapper.vm.getBboxError(fld, 'north')).toBe('');
        expect(wrapper.vm.getBboxError(fld, 'south')).toBe('S must be less than N');
        expect(wrapper.vm.getBboxError(fld, 'east')).toBe('');
        expect(wrapper.vm.getBboxError(fld, 'west')).toBe('W must be less than E');
        
    });

    // testing charactersRemaining function
    test ("charactersRemaining correctly computes characters remaining when remaining greater than used", () => {

        let test_str = 'The quick brown fox jumps over the lazy dog';
        let return_val = wrapper.vm.charactersRemaining(test_str, 50);
        expect (return_val).toEqual(7)

    })

    test ('getAttribute', () => {
        // Mock input with attributes
        const input = {
            attributes: {
            attr: 'value',
            },
        };

        // Call the method
        const result = wrapper.vm.getAttribute('attr', input);

        // Assert that the function returned the correct value
        expect(result).toBe('value');
    });

    test ('getAttribute undefined', () => {
        // Mock input without attributes
        const input = {};

        // Call the method
        const result = wrapper.vm.getAttribute('attr', input);

        // Assert that the function returned undefined
        expect(result).toBeUndefined();
    });

    test ('handleInvalid', () => {
        wrapper.vm.$v = {
            $anyError: true,
            $touch: jest.fn(),
        };

        document.getElementById = jest.fn(id => {
            if (id.endsWith('_invalid')) {
                return {
                    textContent: '',
                    classList: {
                        remove: jest.fn(),
                        add: jest.fn(),
                    },
                };
            }
            return null;
        });

        // Set validation_errors and create event
        wrapper.vm.validation_errors = {};
        const evt = {
          target: {
            name: 'test',
            validationMessage: 'Invalid',
          },
        };
    
        // Call the method
        wrapper.vm.handleInvalid(evt);
    
        // Assert that the methods were called and the values were updated
        expect(document.getElementById).toHaveBeenCalledWith('test_invalid');
        expect(wrapper.vm.$v.$touch).toHaveBeenCalled();
        expect(wrapper.vm.validation_errors).toEqual({ test: 'Invalid' });
      });

    test ('enterSubmitForm', async () => {
        // Mock submitForm method
        wrapper.vm.submitForm = jest.fn();
    
        // Set enterSubmit to true
        await wrapper.setProps({ enterSubmit: true });
    
        // Call the method
        wrapper.vm.enterSubmitForm();
    
        // Assert that submitForm was called
        expect(wrapper.vm.submitForm).toHaveBeenCalled();
    });
    
    test ('enterSubmitForm not called', async () => {
        // Mock submitForm method
        wrapper.vm.submitForm = jest.fn();
    
        // Set enterSubmit to false
        await wrapper.setProps({ enterSubmit: false });
    
        // Call the method
        wrapper.vm.enterSubmitForm();
    
        // Assert that submitForm was not called
        expect(wrapper.vm.submitForm).not.toHaveBeenCalled();
    });

    test('submitForm correctly calls saveFile with submit', () => {
        // Mock saveFile method
        wrapper.vm.saveFile = jest.fn();
    
        // Call the method
        wrapper.vm.submitForm();
    
        // Assert that saveFile was called with the correct argument
        expect(wrapper.vm.saveFile).toHaveBeenCalledWith('submit');
      });

    test('draftFile correcly calls saveFile with draft', () => {
        // Mock saveFile method
        wrapper.vm.saveFile = jest.fn();

        // Call the method
        wrapper.vm.draftFile();

        // Assert that saveFile was called with the correct argument
        expect(wrapper.vm.saveFile).toHaveBeenCalledWith('draft');
     });

    test('okToCancel', () => {
        // Mock elements and methods
        document.getElementById = jest.fn(id => {
          if (id === 'eui-banner' || id === 'reset_data') {
            return {
              classList: {
                add: jest.fn(),
              },
              focus: jest.fn(),
            };
          }
          return null;
        });
    
        wrapper.vm.$refs = {
          form: {
            reset: jest.fn(),
          },
        };
    
        wrapper.vm.$v = {
          $touch: jest.fn(),
        };
    
        wrapper.vm.values = { key: 'value' };
        wrapper.vm.$values = { key: 'value' };
        wrapper.vm.exitForm = jest.fn();
    
        // Call the method
        wrapper.vm.okToCancel();
    
        // Assert that the methods were called
        expect(document.getElementById).toHaveBeenCalledWith('eui-banner');
        expect(document.getElementById).toHaveBeenCalledWith('reset_data');
        expect(wrapper.vm.$refs.form.reset).toHaveBeenCalled();
        expect(wrapper.vm.$v.$touch).toHaveBeenCalled();
        expect(wrapper.vm.exitForm).toHaveBeenCalled();
    
        // Assert that the values were reset
        expect(wrapper.vm.$values).toEqual({});
        expect(wrapper.vm.confirm).toBe(false);
      });

    test('undoToPreviousState correctly updates values and valueHistoryUndoIdx', () => {
        // Initialize data properties
        wrapper.setData({
          valueHistory: [{foo: 'bar'}, {foo: 'baz'}],
          valueHistoryUndoIdx: 0,
          values: {foo: 'baz'}
        })
    
        // Call the method
        wrapper.vm.undoToPreviousState()
    
        // Check the results
        expect(wrapper.vm.valueHistoryUndoIdx).toBe(1)
        expect(wrapper.vm.values).toEqual({foo: 'bar'})
      })

    test('redoToPreviousState correctly updates values and valueHistoryUndoIdx', () => {
        // Initialize data properties
        wrapper.setData({
          valueHistory: [{foo: 'bar'}, {foo: 'baz'}],
          valueHistoryUndoIdx: 1,
          values: {foo: 'bar'}
        })
    
        // Call the method
        wrapper.vm.redoToPreviousState()
    
        // Check the results
        expect(wrapper.vm.valueHistoryUndoIdx).toBe(0)
        expect(wrapper.vm.values).toEqual({foo: 'baz'})
      })
});