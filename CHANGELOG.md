# Changelog

All notable changes to this project will be documented in this file. Changes
should be included in merge requests. Then copied here.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- Unreleased -->

## 0.2.4 - 2021-06-22

- [Removed error message block and moved errors to corresponding inputs](fca3b988f1a2c53852fbe120dc3eb872d2316056)

## 0.2.3 - 2021-06-11

- [Added styling for group type inputs that were newly implemented to group to an input with a calander object](fb36198845670b27c8bfb2ec44cdcef4405a4bfb)
- [Separated out date to text input and calendar to allow for text entry](4dfde56b4a8030fe9a251c3e0bcd229d45e38192)
- [Added min and max attributes one can optionally apply to new text input for date and calendar for date](4dfde56b4a8030fe9a251c3e0bcd229d45e38192)
- [Added calendar button button-only and dropleft attributes to make calendar stand out and force the calendar position so that the calendar buttons never shift up and down](4dfde56b4a8030fe9a251c3e0bcd229d45e38192)
- [Added fixDate function to work on blur of date field, to attempt to reformat to browser default of YYYY-MM-DD](891afe49a725900e2e97809e7c10a99ea0cfb0d8)
- [Moved Date Validation to isDateValid function to allow for adding a call to that to use in both templates and validation.](7e449c3c6c3597168de6e66d58b653762545e2f1)
- [Altered Date validation to check individual field requirements and rules, as well as check if the date is in a valid format](7e449c3c6c3597168de6e66d58b653762545e2f1)
- [Altered template message that checked for Start Date to be greater or equal to End Date to include isDateValid function call](7e449c3c6c3597168de6e66d58b653762545e2f1)
- [Added template message for when a date is in an invalid format](7e449c3c6c3597168de6e66d58b653762545e2f1)
- [Added label to hint at ideal format above date fields.](7e449c3c6c3597168de6e66d58b653762545e2f1)
- [Added format date hint styling](7e449c3c6c3597168de6e66d58b653762545e2f1)

## 0.2.2 - 2021-06-09

- [Fix massive breakage from update to bootstrap 5.0.1 from 4.5.3](5ede14ad8563490a76b683c82ecdd3ac1d75af36)

## 0.2.1 - 2021-04-22

- [Add dockerfile for bamboo ci/cd](6ab4dc498012e70d64616989b887c323a9112a8a)

## 0.2.0  - 2021-04-01

- [Release version 0.2 for testing in SIT](915f4046ddec74edaf89a1fb32b14ae5690942bb)

## 0.1.7 - 2021-03-30

- [Fixed js error in compareDataAskLeave function for when window.questionsComponent is undefined, to allow header links to work correctly on no daac selection](fef5d14bcfaf77bc5b56dec59478eb32f4cb84bd)
- [Appended to new compareDataAskLeave function so modals will work standalone also.](18d86f41305996830ca273c5f27fffde4c0aff38)
- [Corrected store to retain both questions_answers and params so undo and redo buttons work again; added prompt for undoing daac selection](4f2ffaddccce430ee8c75e03e73b215c17ee7940)
- [Allow cancel without any input](040df12b5a09455716ee67114458bcacd5378701)

## 0.1.6 - 2021-03-25

- [Removed local storage store lib; removed local storage vuex object; added prompting if data is different before header links are clicked](bcee32ecbebdd7261f394d57b8c25a479fb2bdb8)
- [Fixed saving of bad data on error](d5e2be8a933530411259a9ed9c8c8c7e926312e0)
- [Fixed help link to display correct address location when on questionnaire](7ee773cd922bba741d65f85673f97b5e095ad8f6)
- [Add pull request template to CONTRIBUTING.md](1a4f968106d37c2f6a88994fcb15ec59182906b1)

## 0.1.5 - 2021-03-17

- [Removed Home.vue and simplified code; removed any unused code for increased test coverage; cleaned up routes and updated vuese comments](69ed572819031b0f674bdd2db3f9b9854d0ef375)

## 0.1.4 - 2021-02-17

- [added in for daacs selection page route; added slash to config; minor style tweak for contact checkbox](dac7111791cc8879106607460b1328bc2509ca48)
- [Changed submit message and confirmation dialog to msgbox to reflect auto-redirect](1ee547d197ffa4153805ae2cc8a3c71dfbfaa54e)
- [Added validation to insure no negative numbers; fixed save so does not redirect](7e74d607103c17dcf0bfa1e44b845270002aab8f)
- [Added message to redirect notification so theres 1 popup for that condition](deb64d5f3f3215b75a8f86a05b9e5a12aa73e755)
- [Altered date validation so start date can equal end date](0bc1f8deba5c8fbbe6ecf22252fd4bf156842524)
- [Added config option for auto-redirect (VUE_APP_REDIRECT_CONFIRMATION)](0bc1f8deba5c8fbbe6ecf22252fd4bf156842524)
- [Added redirect confirmation when config option is undefined or set to true for draft and submit](0bc1f8deba5c8fbbe6ecf22252fd4bf156842524)
- [Removed data volume specific validation so it can be 0](0bc1f8deba5c8fbbe6ecf22252fd4bf156842524)

## 0.1.3 - 2021-02-16

- [Retweaked styles for calendar](9d3e81bbb8e5724437817b0e98e8b0c76c1265f1)
- [Added start and end date validation](956b82ef7336c84c4585ae142e15d735be8b3696)
- [Added data volume validation](956b82ef7336c84c4585ae142e15d735be8b3696)
- [altered headers to not display colons](0f156ac3f633193d1540eaa7080fa0d443e73224)
- [label cursor properties fixed](0f156ac3f633193d1540eaa7080fa0d443e73224)
- [added external links to header](ef3de7ee30dcd842a9195ffd06ec70717d95d085)
- [allows save and draft posts with error](9380492558a04b2996651eb4e150c262ea3bc2ee)
- [changed has to have](3d2ce1165381b6b6698eb37375daf12dbad2aa72)
- [changed json structure to have data and daac_id on form_id level](794ed95533bf6f5429ff027ebbc0977736b9f6b8)
- [changed post to promise resolve for firefox save and submit](794ed95533bf6f5429ff027ebbc0977736b9f6b8)
- [save post sends to /save and submit post to /submit](794ed95533bf6f5429ff027ebbc0977736b9f6b8)

## 0.1.2 - 2021-02-05

- [Updated cancel redirect to just say dashboard requests versus long url](b07d898f9d867d5b9684fd3a78dae0e85c65cdd6)
- [Added condition if no error before redirect in exitform function](b07d898f9d867d5b9684fd3a78dae0e85c65cdd6)
- [Made base url configurable](f74c22d69b532d4f25839b64b723bcb7ee26c9bb)
- [Updated vue-router to use the base url](f74c22d69b532d4f25839b64b723bcb7ee26c9bb)
- [Updated mixin to use router for internal redirects](f74c22d69b532d4f25839b64b723bcb7ee26c9bb)
- [Removed APIROOT from start script](f74c22d69b532d4f25839b64b723bcb7ee26c9bb)
- [Corrected request back to submission for post](71022acb85c83d90be193b9f3f8d358be3a0fc07)
- [Did a blanket replace of 'submission' to request to simulate the dashboard.](abc4bc0229480919eeadbb75fd5eb59ff08d1ff2)

## 0.1.1 - 2021-01-04

- [Added auth token function in mixin.js to redirect when none](b23c320067349187059995e90abad014bba1a91c)

## 0.1.0 - 2020-12-04

- [Bbox validation message templates added](36e01443)
- [Post data to API](e73f3703)
- [Bbox validation added](63965165)

## 0.0.9 - 2020-10-27

- [Add markdown linting](56a82e3c4841d07828435ddc931c15c4ce337407)
- [Updated NPM packages using Snyk](7aabc06c01b11d4cb60b518fefee96bf108fabdb)

## 0.0.8 - 2020-08-20

- [Incorporate minimum testing](a85fb02c1d4c6b147433b9074cdf2dc1dca62258)
- [Connect repositories programmatically](c253499deafd74b2736db1b6dfdbf697d75502ae)

## 0.0.7 - 2020-06-02

- [Incorporate logging into output object](bb7dd43a0b0b13118af78049509b1d702d205a32)
- [Automate file upload to AWS s3 bucket using Terraform](100ac4b2898a70109116cb955ad222377708c639)

## 0.0.6 - 2020-05-13

- [Add cancel and draft buttons, update buttons, undo/redo icons in console bar](9521f3589e029e45fd95ef47342f642e9edbd21f)
- [Update NASA meatball logos, tweak header style](83eac2f44461dbfe8a90341248fa052684b70683)
- [Add eui button colors](75e80549dbf036a40624525cfe96a577f48187e8)

## 0.0.5 - 2020-05-01

- [Addition of file,select,radio,textareas,dynamic attributes,options](78d68c03)
- [Display DAAC selection as a first step](49e5ab6d071ad1b09198a95db477cb83735a469b)
- [Incorporate minimum testing](a85fb02c1d4c6b147433b9074cdf2dc1dca62258)

## 0.0.4 - 2020-04-17

- [Incorporate logging into output object](bb7dd43a0b0b13118af78049509b1d702d205a32)

## 0.0.3 - 2020-04-03

- [Addition of undo redo](fc60bbfb1076619ae9fe081a721c5cf2b940547f)

## 0.0.2 - 2020-03-13

- [Addition of file,select,radio,textareas,dynamic attributes,options](78d68c03)
- [Display DAAC selection as a first step](49e5ab6d071ad1b09198a95db477cb83735a469b)

## 0.0.1 - 2020-03-09

- [Initial commit of repo meta files](ee537d25c879939f3189264942a8f97a90c0a4dc)
