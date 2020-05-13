# Questions

This questions component gets the questions data for the selected daac and sets the above template properties, methods, and custom validation used.

## Props

<!-- @vuese:Questions:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|cancelLabel|The cancel label and type|`String`|`false`|Cancel|
|resetLabel|The reset label and type|`String`|`false`|Reset|
|draftLabel|The draft label and type|`String`|`false`|Save as draft|
|saveLabel|The save label and type|`String`|`false`|Save and continue editing|
|undoLabel|The undo label and type|`String`|`false`|Undo|
|redoLabel|The redo label and type|`String`|`false`|Redo|
|submitLabel|The submit label and type|`String`|`false`|Submit|
|enterSubmit|The enter submit conditional to allow for submittal|`Boolean`|`false`|-|
|readonly|The readonly attribute to pass in|`Boolean`|`false`|-|
|showCancelButton|The show cancel button conditional to allow for cancel|`Boolean`|`false`|-|
|showResetButton|The show reset button conditional to allow for reset|`Boolean`|`false`|-|

<!-- @vuese:Questions:props:end -->


## Events

<!-- @vuese:Questions:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|submitForm|-|-|
|resetForm|console.log('Resetting form ...') Resets form to blank entries|-|

<!-- @vuese:Questions:events:end -->


## Methods

<!-- @vuese:Questions:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|reApplyValues|Re-applies the data entry values from values from the store for on undo and redo|-|
|fetchQuestions|Fetchs the questions data|-|
|status|Validation of input data|-|
|enterSubmitForm||The event|
|submitForm|Used to submit the form data if valid|-|
|draftFile|Used to save file and exit TODO - API call will go here|-|
|saveFile|Used to save file TODO - API call will go here|-|
|resetForm|Clear and reset form|-|
|undoToPreviousState|Undos the form and reverts it to its previous state.|-|
|redoToPreviousState|Redo the form and to its previous state.|-|

<!-- @vuese:Questions:methods:end -->


