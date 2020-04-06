# Questions

This questions component gets the questions data for the selected daac and sets the above template properties, methods, and custom validation used.

## Props

<!-- @vuese:Questions:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|resetLabel|The reset label and type|`String`|`false`|Reset|
|submitLabel|The submit label and type|`String`|`false`|Submit|
|enterSubmit|The enter submit conditional to allow for submittal|`Boolean`|`false`|-|
|readonly|The readonly attribute to pass in|`Boolean`|`false`|-|
|showResetButton|The show reset button conditional to allow for reset|`Boolean`|`false`|-|

<!-- @vuese:Questions:props:end -->


## Events

<!-- @vuese:Questions:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|submitForm|-|-|
|resetForm|Resets form to blank entries|-|

<!-- @vuese:Questions:events:end -->


## Methods

<!-- @vuese:Questions:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|fetchQuestions|Fetchs the questions data|-|
|status|Validation of input data|-|
|enterSubmitForm||The event|
|submitForm|Used to submit the form data if valid|-|
|saveFile|Used to save file TODO - API call will go here|-|
|resetForm|Clear and reset form|-|

<!-- @vuese:Questions:methods:end -->


