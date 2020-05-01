# Daacs

This Daacs component gets DAAC data and displays abbreviations as a radio selection On selection displays a link to the selected DAAC website, description and a 'Next Button' is displayed to allow users more info and to move on.

## Props

<!-- @vuese:Daacs:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|submitLabel|Submit label property and its type|`String`|`false`|Submit|

<!-- @vuese:Daacs:props:end -->


## Events

<!-- @vuese:Daacs:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|submitForm|-|-|

<!-- @vuese:Daacs:events:end -->


## Methods

<!-- @vuese:Daacs:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|fetchDaacs|Fetchs the DAAC data|-|
|setSelectedValues|On selected, builds dynamic text and sets html dynamically with the link|-|
|enterSubmitForm||The event|
|submitForm|Used to submit the form data if valid|-|
|setSaveObject|Used to save file|-|

<!-- @vuese:Daacs:methods:end -->


