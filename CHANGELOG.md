# Changelog

All notable changes to this project will be documented in this file. Changes
should be included in merge requests. Then copied here.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 0.1.4 - 2021-02-17

- [Altered date validation so start date can equal end date](0bc1f8deba5c8fbbe6ecf22252fd4bf156842524)
- [Added config option for auto-redirect (VUE_APP_REDIRECT_CONFIRMATION)](0bc1f8deba5c8fbbe6ecf22252fd4bf156842524)
- [Added redirect confirmation when config option is undefined or set to true for draft and submit](0bc1f8deba5c8fbbe6ecf22252fd4bf156842524)

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
