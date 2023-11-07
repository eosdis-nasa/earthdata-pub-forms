# Earthdata Pub Forms

This is the readme for the questions piece of forms and describes the API data accepted
and digested by forms.

## Table of Contents

- **[Input Types and Attributes Currently Accepted](#Inputs-Types-and-Attributes-Currently-Accepted)**
- **[Developers Need-to-Know](#Developers-Need-to-Know)**
- **[Messages](#Messages)**
- **[Example files used in development](#example-files)**

### Inputs Types and Attributes Currently Accepted

The following inputs are currently accepted and are digested by Earthdata Pub Forms:

- text
- textarea
- radio
- checkbox
- select
- file

The following text input types are accepted and should validate via html5:

- text
- password
- number
- url
- email
- search
- range
- date
- tel
- time

The following custom text input types are accepted and should validate:

- bbox

The following input attributes are accepted and are evaluated in forms:

- size (question sections only)
  - The default size is 12, so the data sent in should be less than 12.
- disabled (text, textarea, radio, checkbox, select, file)
  - Inputs can be disabled by the form, however, individual inputs may be disabled.
- readonly (text, textarea)
  - Inputs can be disabled by the form, however, individual inputs may be sent readonly.
- pattern (text)
- maxLength (text, textarea)
- minLength (text, textarea)
- max (text input with type number)
- min (text input with type number)
- multiple (file, select)
- cols (textarea)
- rows (textarea)

For descriptions of html input types and attributes, 
[visit](https://www.w3schools.com/html/html_form_input_types.asp).

### Developers Need to Know

The forms implement conditionally required and conditionally seen inputs,
questions and sections.

So if an array of objects are sent under required_if on an input, that input is
required if the field (in the required_if array object), equals the value (in the
required_if array object).  The same type logic exists for showing a section,
question, or input in a 'show_if' array of objects.  The form also looks for a
message in those objects to display a custom error message.  If more than one object
is in a 'required_if' array or 'show_if' array, it is considered as an 'or' type
condition.

**When using attributes and sending a 'validation_error_msg', it is important
that the message includes any attribute's validation warnings.**

For example, when using pattern, make sure the 'validation_error_msg' in the json
says something like, 'Please provide a number in the pattern of '[0-9]{3}-[0-9]{3}-[0-9]{4}'
as the 'validation_error_msg' is meant to override html5 and vuelidate messages.

### Messages

The following messages may be shown near the input violation.  

- "Section {{ heading }} is required"
- "{{ heading }} - {{ question.title }} section is required"
- "{{ heading }} - {{ question.title }} - {{ input.label }}: {{ req_if.message }}"
- "{{ heading }} - {{ question.title }} - {{ input.label }}: {{ input.validation_
error_msg }}"
- "{{ heading }} - {{ question.title }} - {{ input.label }} is required"
- "{{ heading }} - {{ question.title }} - {{ input.label }} does not match pattern
{{ input.attributes.pattern }}"
- "{{ heading }} - {{ question.title }} - {{ input.label }} requires a minimum
length of {{ input.attributes.minlength }}"
- "{{ heading }} - {{ question.title }} - {{ input.label }} is over the maximum
length of {{ input.attributes.maxlength }}"
- "{{ heading }} - {{ question.title }} - {{ input.label }} the value must be
{{ input.attributes.min }} or greater"
- "{{ heading }} - {{ question.title }} - {{ input.label }} is required the value
must be less than {{ input.attributes.max }}"

More information on requiredif and [vuelidate validators](https://vuelidate.js.org/#sub-builtin-validators)

### Example files

Files that were used during development are available in the repo and can be viewed:

- [Data Accession Request](public/data_accession_request.json)
- [Daacs](public/daacs.json)
- [Data Publication Request](public/data_publication_request.json)
