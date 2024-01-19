# Earthdata Pub Forms Code Coverage for E2E Cypress tests

The Cypress E2E tests must be run without errors on top of the instrumented code.  See below on how to do this.

## Table of Contents

- [Earthdata Pub Forms Code Coverage for E2E Cypress tests](#earthdata-pub-forms-code-coverage-for-e2e-Cypress-tests)
  - [Table of Contents](#table-of-contents)
    - [First we need to instrument](#first-we-need-to-instrument)
    - [Prepare to rebuild the report](#prepare-to-rebuild-the-report)
    - [Run Cypress tests and build the coverage report](#run-cypress-tests-and-build-the-coverage-report)

### First we need to instrument

For Forms coverage to be built for Cypress E2E tests, we first have to reinstrument the code base on the fly with istanbul.  The following command clears the build and .nyc_output folders, then instruments the src code files and saves them to the build directory:

- Run the command `npm run clean-and-instrument`.

### Prepare to rebuild the report

The Cypress E2E tests must be run on top of the instrumented code.  The code will automatically build up a json and save the output in build/.nyc_output/out.json.  The text summary report will automatically be built and updated as the cypress E2E tests are run.  To run the html report, there is another command at the end.

We need to setup the environment for the Cypress tests by making sure the docker containers for the api, dashboard and overview apps are running:

- Run the api using the command `npm run start-api`.
- Run the dashboard using the command `npm run start-dashboard`.
- Run the overview app using the command `npm run start-overview-dev`.

Then we run forms using the following command **from the build directory**:

- Run forms using the command `npm run serve`.

**At the time of this writing, there are recent issues with nyc with ESM module type files. The vue files will not be read as of to date, and there is not a good coverage tool out there for vue files yet.**

### Run Cypress tests and build the coverage report

- Run Cypress E2E tests **in the build directory with the instructed code** using the command `npm run cypress` and run all specs. You should be able to see the coverage stats in dev tools during the flow, as a json object. The text summary report will automatically be built and displayed during the run.
- You can now view the report in your browser. I opt to cleanup the build/.nyc_output/out.json file by doing a search for '.js', then removing all the gibberish before that.
- To keep from storing double files everywhere, **from the forms directory** run `npm run finalize-coverage`.  This moves the build/.nyc_output directory with the cooresponding json file into the build/coverage directory, then it moves the coverage directory up a level then removes the build directory.