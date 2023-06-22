# Changelog

All notable changes to this project will be documented in this file. Changes
should be included in merge requests. Then copied here.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

<!-- Unreleased changes can be added here. -->

## 1.0.13 - 2023-06-22

- Updated modals not involving user input or confirmation to bootstrap-vue alerts
- Updated data format question in test jsons
- Updated Node version to v18.14.1

## 1.0.12 - 2022-10-28

- Removed jquery library

## 1.0.11 - 2022-10-25

- Updated verbage from data to request

## 1.0.10 - 2022-07-27

- Fixed required label for tables.

## 1.0.9 - 2022-06-23

- Added getIDs to resolve before everything else in order to fix sometimes not loading on server

## 1.0.8 - 2022-06-22

- Changed content of DOI to table, added move up down feature.

## 1.0.7 - 2022-06-20

- Added in for direct route to selection page.

## 1.0.6 - 2022-05-27

- Changed daac selection header, added back hidden daacs, added a paragraph explaining why some daacs are disabled.

## 1.0.5 - 2022-05-24

- Removed custom routing and fixed routing issues. Request ID is in address bar instead of Group ID. Added a cancel button to the daac selection page.

## 1.0.4 - 2022-05-12

- Updated old form name fragments to current.

## 1.0.3 - 2022-05-05

- Added hide daac feature for daac selection page

## 1.0.2 - 2022-05-11

- Fixed section required shifting and some message tweaks for missing data.

## 1.0.1 - 2022-04-13

- Update to Node v14.19.1

## 1.0.0 - 2022-03-29

- EDPub MVP release

## 0.3.19 - 2022-03-23

- Updated to render links using vhtml attribute for help and custom validation messages
- Turn on Earthdata Feedback Module

## 0.3.18 - 2022-03-09

- Added accessibility testing module. Applied accessibilty updates found through axe automated testing in cypress.

## 0.3.17 - 2022-03-08

- Updated scripts in package.json to include new overview docker container.
- Minor tweaks, Reordered buttons, Code formatting, Fixed squished required label.
- Added range validation to coordinates
- Added spinner to prevent forms header appearing before authorization.

## 0.3.16 - 2022-03-03

- Moved eui css to outside of code and after all other css is processed.

## 0.3.15 - 2022-02-17

- Content changes.  Changed orcid to all uppercase and funding orgs to checkboxes. 

## 0.3.14 - 2022-02-09

- Finished adding cypress base tests, removed jest files and libraries

## 0.3.14 - 2022-01-28

- Added Cypress testing suite and a few tests to run in browser mode

## 0.3.13 - 2022-01-25

- Added VUE_APP_TESTING_MODE environment variable

## 0.3.12 - 2022-01-20

- Updated vuese and comments for auto-documentation for better documentation
maintenance. Some minor cleanup

## 0.3.11 - 2021-12-22

- Completed form decoupling for better maintenance. Some needed cleanup

## 0.3.10 - 2021-12-07

- Fixed dev dependencies removal of lint and test tools and renamed components
according to lint allowing for build

## 0.3.9 - 2021-11-19

- Removed unused libraries and upgraded dependencies but for bootstrap

## 0.3.8 - 2021-11-17

- Removed hardcoded forms data
- Added NASA Apache 2.0 license
- Updated CONTRIBUTING.md

## 0.3.7 - 2021-10-29

- Decoupled daac selection page

## 0.3.6 - 2021-08-25

- Updated styling tweaks based on feedback

## 0.3.5 - 2021-08-23

- Update styling based on feedback
- Replace form names with content update
- Add temporary Feedback link to header. This is meant to be removed after testing.
- Updated object compare so it will only warn user on new data when navigating away
- Fixed same as checkbox not always showing
- Moved editable table cell style to global space to allow for editing in tables.

## 0.3.4 - 2021-08-19

- Updated same as checkboxes to display title name instead of value.  Changed contact fields to be readonly if same as is checked. Tweaked undo redo functionality to reset store after loading answers.
- Updated tables for inline editing

## 0.3.3 - 2021-08-16

- Altered help to show on forms automatically instead of by link
- Fixed header links so they work correctly from each view and altered logic so there is no warning to save when on just daac selection and navigating away.

## 0.3.2 - 2021-08-12

- Added config option for unknown website link label override (VUE_APP_UNKNOWN_WEBSITE_LINK_SINGULAR)
- Added link to daac name selected in questions
- Added daac name selected to questions (being set from mixin in setting the active location)
- Updated jsons for publication_dois to be table format for multirow

## 0.3.1 - 2021-07-22

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

## 0.3.0 - 2021-06-29

- Open source release version 0.3.0 [note: retroactively renumbered to 0.3 to allow numbering of MVP release]

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

## 0.0.3 - 2020-12-04

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
