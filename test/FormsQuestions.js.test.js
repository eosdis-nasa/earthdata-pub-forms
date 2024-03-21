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

    test('setLocalVars', () => {
      // Set global_params and call setLocalVars
      wrapper.vm.$store.state.global_params = {
        formId: 'test_formId',
        requestId: 'test_requestId',
        group: 'test_group',
      };
      wrapper.vm.setLocalVars();
  
      // Assert that the local variables were updated
      expect(wrapper.vm.formId).toBe('test_formId');
      expect(wrapper.vm.requestId).toBe('test_requestId');
      expect(wrapper.vm.daac).toBe('test_group');
    });
  
    test('setLocalVars with empty global_params', () => {
      // Set global_params and call setLocalVars
      wrapper.vm.$store.state.global_params = {
        formId: '',
        requestId: '',
        group: '',
      };
      wrapper.vm.setLocalVars();
  
      // Assert that the local variables were not updated
      expect(wrapper.vm.formId).toBe('');
      expect(wrapper.vm.requestId).toBe('');
      expect(wrapper.vm.daac).toBe('');
    });

    test('resize', () => {
      global.document.getElementById = jest.fn().mockReturnValue({
        style: {
          height: '',
        },
        scrollHeight: 100,
      });

      // Call resize
      const textarea = global.document.getElementById('test_id');
      wrapper.vm.resize('test_id');

      // Assert that the textarea's style was updated
      expect(textarea.style.height).toBe('100px');
    });

    test("returns true when a required_if statement is triggered", () => {
      const fld = {
        required_if: [
          { field: "test_radios", value: "Yes" }
        ]
      };
    
      // Set values for the required fields
      wrapper.vm.values = {
        test_radios: "Yes",
      };
    
      const result = wrapper.vm.checkRequiredIf(fld);
      expect(result).toBe(true);
    });

    test("returns false when there is no requirement", () => {
      const fld = {
        required_if: []
      };
    
      const result = wrapper.vm.checkRequiredIf(fld);
      expect(result).toBe(false);
    });

    test('accessibilityHack sets ariaLabel to id for buttons', () => {
      // Setup
      let button = document.createElement('button');
      button.id = 'testButton';
      document.body.appendChild(button);
    
      // Act
      wrapper.vm.accessibilityHack();

      // Assert
      expect(button.ariaLabel).toBe('testButton');
    });

    test('calls compareDataAskLeave with "daacs"', () => {
      // Mock the compareDataAskLeave method
      const compareDataAskLeaveMock = jest.spyOn(wrapper.vm, 'compareDataAskLeave').mockImplementation()
  
      // Call the goToDaacs method
      wrapper.vm.goToDaacs();
  
      // Expect compareDataAskLeave to be called with 'daacs'
      expect(compareDataAskLeaveMock).toHaveBeenCalledWith('daacs');
    });

    test('addRow', () => {
      // Set questions and values and call addRow
      wrapper.vm.questions = [
        [
          {
            inputs: [
              {
                type: 'table',
                control_id: 'test_table',
                enums: [
                  { key: 'test_key' },
                ],
              },
            ],
          },
        ],
      ];

      wrapper.vm.addRow('test_table');
  
      // Assert that the values were updated
      expect(wrapper.vm.values['test_table']).toEqual([
        { 'test_key': undefined},
      ]);
    });
  
    test('addRow with non-existing tableId', () => {
      // Set questions and values and call addRow
      wrapper.vm.questions = [
        [
          {
            inputs: [
              {
                type: 'table',
                control_id: 'test_table',
                enums: [
                  { key: 'test_key' },
                ],
              },
            ],
          },
        ],
      ];
      wrapper.vm.values = {
        'test_table_test_key': 'test_value',
      };
      wrapper.vm.addRow('other_table');
  
      // Assert that the values were not updated
      expect(wrapper.vm.values['test_table']).toBeUndefined();
    });

    test('removeRow', () => {
      // Set values and call removeRow
      wrapper.vm.values = {
        'test_table': [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' },
        ],
      };
      wrapper.vm.removeRow('test_table', { id: 1, name: 'John Doe' });
  
      // Assert that the values were updated
      expect(wrapper.vm.values['test_table']).toEqual([
        { id: 2, name: 'Jane Doe' },
      ]);
    });
  
    test('removeRow with non-existing item', () => {
      // Set values and call removeRow
      wrapper.vm.values = {
        'test_table': [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' },
        ],
      };
      wrapper.vm.removeRow('test_table', { id: 3, name: 'John Doe' });
  
      // Assert that the values were not updated
      expect(wrapper.vm.values['test_table']).toEqual([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
      ]);
    });

    test('moveUpDown up', () => {
      // Set values and call moveUpDown
      wrapper.vm.values = {
        'test_table': [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' },
        ],
      };
      wrapper.vm.moveUpDown('test_table', { id: 2, name: 'Jane Doe' }, 'up');
  
      // Assert that the values were updated
      expect(wrapper.vm.values['test_table']).toEqual([
        { id: 2, name: 'Jane Doe' },
        { id: 1, name: 'John Doe' },
      ]);
    });
  
    test('moveUpDown down', () => {
      // Set values and call moveUpDown
      wrapper.vm.values = {
        'test_table': [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' },
        ],
      };
      wrapper.vm.moveUpDown('test_table', { id: 1, name: 'John Doe' }, 'down');
  
      // Assert that the values were updated
      expect(wrapper.vm.values['test_table']).toEqual([
        { id: 2, name: 'Jane Doe' },
        { id: 1, name: 'John Doe' },
      ]);
    });

    test('moveUpDown up with canMove ', () => {
      // Set values and call moveUpDown
      wrapper.vm.values = {
        'test_table': [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' },
        ],
      };
      const result = wrapper.vm.moveUpDown('test_table', { id: 2, name: 'Jane Doe' }, 'up', true);
  
      // Assert that the function returned true
      expect(result).toBe(true);
    });
  
    test('moveUpDown down with canMove', () => {
      // Set values and call moveUpDown
      wrapper.vm.values = {
        'test_table': [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' },
        ],
      };
      const result = wrapper.vm.moveUpDown('test_table', { id: 1, name: 'John Doe' }, 'down', true);
  
      // Assert that the function returned true
      expect(result).toBe(true);
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

    test('isDateValid with start date greater than end date', () => {
      // Set values and call isDateValid
      wrapper.vm.values = {
        'test_start': '2022-12-31',
        'test_end': '2022-01-01',
      };
      const result = wrapper.vm.isDateValid('test_start');
  
      // Assert that the function returned false
      expect(result).toBe(false);
    });
  
    test('isDateValid with invalid start date', () => {
      // Set values and call isDateValid
      wrapper.vm.values = {
        'test_start': 'invalid-date',
        'test_end': '2022-01-01',
      };
      const result = wrapper.vm.isDateValid('test_start', 'validity');
  
      // Assert that the function returned false
      expect(result).toBe(false);
    });
  
    test('isDateValid with invalid end date', () => {
      // Set values and call isDateValid
      wrapper.vm.values = {
        'test_start': '2022-01-01',
        'test_end': 'invalid-date',
      };
      const result = wrapper.vm.isDateValid('test_end', 'validity');
  
      // Assert that the function returned false
      expect(result).toBe(false);
    });
  
    test('isDateValid with valid dates', () => {
      // Set values and call isDateValid
      wrapper.vm.values = {
        'test_start': '2022-01-01',
        'test_end': '2022-12-31',
      };
      const result = wrapper.vm.isDateValid('test_start');
  
      // Assert that the function returned true
      expect(result).toBe(true);
    });

    test('validateQuestionInputsRequired', () => {
      // Mock inputs and set values
      const inputs = [
        { type: 'bbox', control_id: 'test' },
        { type: 'text', control_id: 'test2' },
        { type: 'checkbox', control_id: 'test3' },
      ];
      wrapper.vm.values = {
        test_north: '90',
        test_south: '89',
        test_east: '180',
        test_west: '-180',
        test2: 'value',
        test3: 'true',
      };
  
      // Call the method and assert the returned value
      expect(wrapper.vm.validateQuestionInputsRequired(inputs)).toBe(false);
    });
  
    test('validateQuestionInputsRequired missing value', () => {
      // Mock inputs and set values
      const inputs = [
        { type: 'bbox', control_id: 'test' },
        { type: 'text', control_id: 'test2' },
        { type: 'checkbox', control_id: 'test3' },
      ];
      wrapper.vm.values = {
        test_north: '90',
        test_south: '',
        test_east: '180',
        test_west: '-180',
        test2: '',
        test3: 'false',
      };
  
      // Call the method and assert the returned value
      expect(wrapper.vm.validateQuestionInputsRequired(inputs)).toBe(true);
    });

    test('validateQuestionInputsRequired checkbox checked', () => {
      // Mock inputs and set values
      const inputs = [
        { type: 'checkbox', control_id: 'test1' }
      ];
      wrapper.vm.values = {
        test1: 'true'
      };

    // Call the method and assert the returned value
    expect(wrapper.vm.validateQuestionInputsRequired(inputs)).toBe(false);

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

    test ('Invalid non-numeric values', () => {
      // Mock fld and set values
      const fld = { control_id: 'test' };
      wrapper.vm.values = {
        test_north: 'test',
        test_south: '42',
        test_east: '35',
        test_west: '42',
      };
  
      // Call the method and assert the returned value
      expect(wrapper.vm.getBboxError(fld, 'north')).toBe("Must be a number");
      
  });

    test('showIf with no config', () => {
      // Call showIf with no config
      const result = wrapper.vm.showIf(null);
  
      // Assert that the function returned true
      expect(result).toBe(true);
    });
  
    test('showIf with empty config', () => {
      // Call showIf with empty config
      const result = wrapper.vm.showIf([]);
  
      // Assert that the function returned true
      expect(result).toBe(true);
    });
  
    test('showIf with matching field and value', () => {
      // Set values and call showIf
      wrapper.vm.values = {
        'test_field': 'test_value',
      };
      const result = wrapper.vm.showIf([{ field: 'test_field', value: 'test_value' }]);
  
      // Assert that the function returned true
      expect(result).toBe(true);
    });
  
    test('showIf with non-matching field and value', () => {
      // Set values and call showIf
      wrapper.vm.values = {
        'test_field': 'test_value',
      };
      const result = wrapper.vm.showIf([{ field: 'test_field', value: 'other_value' }]);
  
      // Assert that the function returned false
      expect(result).toBe(false);
    });

    test('setContact with checked', () => {
      global.document.getElementById = jest.fn().mockReturnValue({ checked: false });

      // Set values and call setContact
      wrapper.vm.values = {
        'from_name': 'John Doe',
        'from_organization': 'Company',
        'to_name': '',
        'to_organization': ''
      };
      wrapper.vm.setContact('to_name', 'from_name', 'test_key');
  
      // Assert that the values were updated
      expect(wrapper.vm.values).toEqual({
        'from_name': 'John Doe',
        'from_organization': 'Company',
        'to_name': 'John Doe',
        'to_organization': 'Company'
      });
    });
  
    test('setContact without checked', () => {
      global.document.getElementById = jest.fn().mockReturnValue({ checked: true });

      // Set values and call setContact
      wrapper.vm.values = {
        'from_name': 'John Doe',
        'from_organization': 'Company',
        'to_name': 'John Doe',
        'to_organization': 'Company',
      };
      wrapper.vm.setContact('to_name', 'from_name', 'test_key');
  
      // Assert that the values were updated
      expect(wrapper.vm.values).toEqual({
        'from_name': 'John Doe',
        'from_organization': 'Company',
        'to_name': '',
        'to_organization': '',
      });
    });

    test('getSameAsId', () => {
      // Call the method
      const result = wrapper.vm.getSameAsId('test_control_id', 'test_contact_fld');
  
      // Assert that the function returned the correct value
      expect(result).toBe('same_as_test_control_id_test_contact_fld');
    });

    test('sameAsSelected checked', () => {
      wrapper.vm.getSameAsId = jest.fn();

      // Set values and call sameAsSelected
      wrapper.vm.values = {
        'same_as_b_name_a_name': 'true',
        'a_name': 'John Doe',
      };

      const result = wrapper.vm.sameAsSelected('b_name');
  
      // Assert that the function returned true
      expect(result).toBe(true);
    });

    test('sameAsSelected not checked', () => {
      wrapper.vm.getSameAsId = jest.fn();

      // Set values and call sameAsSelected
      wrapper.vm.values = {
        'same_as_b_name_a_name': 'false',
        'a_name': 'John Doe',
      };

      const result = wrapper.vm.sameAsSelected('b_name');
  
      // Assert that the function returned true
      expect(result).toBe(false);
    });

    test('anySameAsSelected', () => {
      wrapper.vm.sameAsSelected = jest.fn();

      // Call the method
      wrapper.vm.anySameAsSelected('test_name_organization_department_email_orcid');
  
      // Assert that sameAsSelected was called with the correct argument
      expect(wrapper.vm.sameAsSelected).toHaveBeenCalledWith('test');
    });

    test('setContacts', () => {

      // Set questions and call setContacts
      wrapper.vm.questions = [[
        {
          inputs: [{ control_id: "data_producer_info_name", label: 'First and Last Name' }],
          text: 'Who is the primary person responsible?',
          long_name: 'Primary Data Producer',
          help: 'This is helpful',
        },
        {
          inputs: [{ control_id: "poc_name", label: 'First and Last Name' }],
          text: 'Point of Contact info',
          long_name: 'Data Accession Point of Contact',
          help: 'This person should have in-depth knowledge of this data product',
        },
        {
          inputs: [{ control_id: "generic_question", label: 'Answer' }],
          text: 'Generic Question text',
          long_name: 'Generic Question',
          help: '',
        },
      ]];
      wrapper.vm.setContacts({
        data_producer_info_name: 'John Doe',
        poc_name: 'Jane Doe',
        generic_question: 'generic answer'
      });
  
      // Assert that the contacts and contact_fields were updated
      expect(wrapper.vm.contacts).toEqual(['Primary Data Producer', 'Data Accession Point of Contact']);
      expect(wrapper.vm.contact_fields).toEqual(['data_producer_info_name', 'poc_name']);
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

    test('handleInvalid for corrected errors]', () => {
      wrapper.vm.$v = {
        $anyError: true,
        $touch: jest.fn(),
      };

      document.getElementById = jest.fn(id => {
        if (id.endsWith('_invalid')) {
          return {
            classList: {
              remove: jest.fn(),
              add: jest.fn(),
            },
          };
        }
        return null;
      });
     
      // Set validation_errors and create event
      wrapper.vm.validation_errors = { test: 'Error' };
      const evt = {
        target: {
          name: 'test',
          validationMessage: '',
        },
      };
    
      // Call the method
      wrapper.vm.handleInvalid(evt);
  
      // Assert that the methods were called and the values were updated
      expect(document.getElementById).toHaveBeenCalledWith('test_invalid');
      expect(wrapper.vm.validation_errors).toEqual({});
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