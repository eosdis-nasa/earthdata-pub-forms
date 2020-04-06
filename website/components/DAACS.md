# DAACS

This DAACS component gets DAAC data and displays abbreviations as a radio selection On selection displays a link to the selected DAAC website, description and a 'Next Button' is displayed to allow users more info and to move on.

## Props

<!-- @vuese:DAACS:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|resetLabel|Reset label property and its type|`String`|`false`|Reset|
|submitLabel|Submit label property and its type|`String`|`false`|Submit|

<!-- @vuese:DAACS:props:end -->


## Events

<!-- @vuese:DAACS:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|submitForm|-|-|

<!-- @vuese:DAACS:events:end -->


## Methods

<!-- @vuese:DAACS:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|fetchDaacs|Fetchs the DAAC data|-|
|setSelectedValues|On selected, builds dynamic text and sets html dynamically with the link|-|
|enterSubmitForm||The event|
|submitForm|Used to submit the form data if valid|-|
|setSaveObject|Used to save file|-|

<!-- @vuese:DAACS:methods:end -->


