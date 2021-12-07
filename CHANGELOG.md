# Changelog

All notable changes to this project will be documented in this file. Changes
should be included in merge requests. Then copied here.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

<!-- Unreleased changes can be added here. -->

## 1.1.0 - 2021-12-07

- Fixed dev dependencies removal of lint and test tools and renamed components 
according to lint allowing for build

## 1.0.9 - 2021-11-19

- Removed unused libraries and upgraded dependencies but for bootstrap

## 1.0.8 - 2021-11-17

- Removed hardcoded forms data
- Added NASA Apache 2.0 license
- Updated CONTRIBUTING.md

## 1.0.7 - 2021-10-29

- Decoupled daac selection page

## 1.0.6 - 2021-08-25

- Updated styling tweaks based on feedback

## 1.0.5 - 2021-08-23

- Update styling based on feedback
- Replace form names with content update
- Add temporary Feedback link to header. This is meant to be removed after testing.
- Updated object compare so it will only warn user on new data when navigating away
- Fixed same as checkbox not always showing
- Moved editable table cell style to global space to allow for editing in tables.

## 1.0.4 - 2021-08-19

- Updated same as checkboxes to display title name instead of value.  Changed contact fields to be readonly if same as is checked. Tweaked undo redo functionality to reset store after loading answers.
- Updated tables for inline editing

## 1.0.3 - 2021-08-16

- Altered help to show on forms automatically instead of by link
- Fixed header links so they work correctly from each view and altered logic so there is no warning to save when on just daac selection and navigating away.

## 1.0.2 - 2021-08-12

- Added config option for unknown website link label override (VUE_APP_UNKNOWN_WEBSITE_LINK_SINGULAR)
- Added link to daac name selected in questions
- Added daac name selected to questions (being set from mixin in setting the active location)
- Updated jsons for publication_dois to be table format for multirow

## 1.0.1 - 2021-07-22

- Updated jsons from api and moved them to public folder
- Added var for testing and code to use json instead of api; fixed help page error
- Some style tweaks and cleanup from after message move.
- Removed error message block and moved errors to corresponding inputs
- Added styling for group type inputs that were newly implemented to group to an input with a calander object
- Separated out date to text input and calendar to allow for text entry
- Added min and max attributes one can optionally apply to new text input for date and calendar for date
- Added calendar button button-only and dropleft attributes to make calendar stand out and force the calendar position so that the calendar buttons never shift up and down
- Added fixDate function to work on blur of date field, to attempt to reformat to browser default of YYYY-MM-DD
- Moved Date Validation to isDateValid function to allow for adding a call to that to use in both templates and validation.
- Altered Date validation to check individual field requirements and rules, as well as check if the date is in a valid format
- Altered template message that checked for Start Date to be greater or equal to End Date to include isDateValid function call
- Added template message for when a date is in an invalid format
- Added label to hint at ideal format above date fields.
- Added format date hint styling

## 1.0.0 - 2021-06-29

- Open source release version 1.0.0

## 0.2.2 - 2021-06-09

- Fix massive breakage from update to bootstrap 5.0.1 from 4.5.3

## 0.2.1 - 2021-04-22

- Add dockerfile for bamboo ci/cd

## 0.2.0  - 2021-04-01

- Release version 0.2 for testing in SIT

## 0.1.7 - 2021-03-30

- Fixed js error in compareDataAskLeave function for when window.questionsComponent is undefined, to allow header links to work correctly on no daac selection
- Appended to new compareDataAskLeave function so modals will work standalone also.
- Corrected store to retain both questions_answers and params so undo and redo buttons work again; added prompt for undoing daac selection
- Allow cancel without any input

## 0.1.6 - 2021-03-25

- Removed local storage store lib; removed local storage vuex object; added prompting if data is different before header links are clicked
- Fixed saving of bad data on error
- Fixed help link to display correct address location when on questionnaire
- Add pull request template to CONTRIBUTING.md

## 0.1.5 - 2021-03-17

- Removed Home.vue and simplified code; removed any unused code for increased test coverage; cleaned up routes and updated vuese comments

## 0.1.4 - 2021-02-17

- added in for daacs selection page route; added slash to config; minor style tweak for contact checkbox
- Changed submit message and confirmation dialog to msgbox to reflect auto-redirect
- Added validation to insure no negative numbers; fixed save so does not redirect
- Added message to redirect notification so theres 1 popup for that condition
- Altered date validation so start date can equal end date
- Added config option for auto-redirect (VUE_APP_REDIRECT_CONFIRMATION)
- Added redirect confirmation when config option is undefined or set to true for draft and submit
- Removed data volume specific validation so it can be 0

## 0.1.3 - 2021-02-16

- Retweaked styles for calendar
- Added start and end date validation
- Added data volume validation
- Altered headers to not display colons
- Label cursor properties fixed
- Added external links to header
- Allows save and draft posts with error
- Changed has to have
- Changed json structure to have data and daac_id on form_id level
- Changed post to promise resolve for firefox save and submit
- Save post sends to /save and submit post to /submit

## 0.1.2 - 2021-02-05

- Updated cancel redirect to just say dashboard requests versus long url
- Added condition if no error before redirect in exitform function
- Made base url configurable
- Updated vue-router to use the base url
- Updated mixin to use router for internal redirects
- Removed APIROOT from start script
- Corrected request back to submission for post
- Did a blanket replace of 'submission' to request to simulate the dashboard.

## 0.1.1 - 2021-01-04

- Added auth token function in mixin.js to redirect when none

## 0.1.0 - 2020-12-04

- Bbox validation message templates added
- Post data to API
- Bbox validation added

## 0.0.9 - 2020-10-27

- Add markdown linting
- Updated NPM packages using Snyk

## 0.0.8 - 2020-08-20

- Incorporate minimum testing
- Connect repositories programmatically

## 0.0.7 - 2020-06-02

- Incorporate logging into output object
- Automate file upload to AWS s3 bucket using Terraform

## 0.0.6 - 2020-05-13

- Add cancel and draft buttons, update buttons, undo/redo icons in console bar
- Update NASA meatball logos, tweak header style
- Add eui button colors

## 0.0.5 - 2020-05-01

- Addition of file,select,radio,textareas,dynamic attributes,options
- Display DAAC selection as a first step
- Incorporate minimum testing

## 0.0.4 - 2020-04-17

- Incorporate logging into output object

## 0.0.3 - 2020-04-03

- Addition of undo redo

## 0.0.2 - 2020-03-13

- Addition of file,select,radio,textareas,dynamic attributes,options
- Display DAAC selection as a first step

## 0.0.1 - 2020-03-09

- Initial commit of repo meta files
