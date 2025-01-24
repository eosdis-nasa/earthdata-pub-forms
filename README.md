:no-entry: [DEPRECATED] - This repository has been integrated directly to the Earthdata Pub Dashboard
rather than remaining a standalone module: https://github.com/eosdis-nasa/earthdata-pub-dashboard/pull/77

# [DEPRECATED]  - Earthdata Pub Forms

This is the Forms code repository for Earthdata Pub (EDPub).

## Table of Contents

- [\[DEPRECATED\]  - Earthdata Pub Forms](#deprecated----earthdata-pub-forms)
  - [Table of Contents](#table-of-contents)
  - [Contributing](#contributing)
  - [Installing](#installing)
  - [Running locally](#running-locally)
    - [Dashboard and API](#dashboard-and-api)
  - [Styling](#styling)
  - [Developing](#developing)
    - [Edits to code](#edits-to-code)
    - [Vue builds inside Docker](#vue-builds-inside-docker)
  - [Testing](#testing)
  - [Deploying](#deploying)
  - [Documentation](#documentation)

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for instruction for contributing to
the EDPub project. Be sure to read that before submitting pull requests.

## Installing

EDPub Forms use node v18.14.1. EDPub Forms use npm version 9.3.1.  To build/run the Forms on your local
machine, install nvm following the [nvm Install & Update Script](https://github.com/nvm-sh/nvm#install--update-script)
instructions.

We use npm for local package management, to install the requirements:

```bash
nvm install v18.14.1
nvm use
npm install
```

## Running locally

To start and build all containers (api, dashboard, forms and overview):

```bash
npm run start-dev
```

The most current branch of each repo is the 'develop' branches.

You can navigate to 'http://localhost:8080/docs' to verify the api is running.

You can navigate to 'http://localhost:3000' to verify the dashboard is working.
Log in initially by choosing 'Earthdata Pub System'.

After being authenticated, you can test forms is working by navigating to 'http://localhost:8081'.

Finally, test that the overview is working by clicking the forms 'Overview' link in the header.

You can spin down all containers, by running this command:

```bash
npm run stop-dev
```

If forms was ever previously opened, you may need to clear the localStorage in the browser. (Do this if the page is blank).

To run forms locally:

```bash
npm run start-forms-dev
```

The vue app can also be run locally using:

```bash
npm use
npm install
npm run build
npm run serve
```

To view logs from the Docker container:

```bash
npm run view-logs
```

### Dashboard and API

The Forms application is dependent on the EDPub [Dashboard](https://github.com/eosdis-nasa/earthdata-pub-dashboard)
and [API](https://github.com/eosdis-nasa/earthdata-pub-api). Follow
instructions in each repo or the [EDPub core](https://github.com/eosdis-nasa/earthdata-pub)
repo.

The Dashboard will available at <http://localhost:3000/>

The API Swagger documentation will available at <http://localhost:8080/docs/>

## Styling

EDPub uses [EUI](https://cdn.earthdata.nasa.gov/eui/latest/docs/eui/index.html) styling.

## Developing

Docker setup inspired by <https://daten-und-bass.io/blog/getting-started-with-vue-cli-on-docker/>

Earthdata Pub Forms allows for local development without needing a local install
of node.js, npm, and vue requirements by using [Docker](https://docs.docker.com/)
to serve the vue.js application. [docker-compose](https://docs.docker.com/compose/)
makes container deployment simple. See the [Dockerfile](./Dockerfile) and
[docker.compose.yml](./docker-compose.yml) for details.

To deploy using docker-compose:

```bash
docker-compose up
```

### Edits to code

The vue.js application code base is mounted into the Docker container as a volume.
This allows the code to be edited outside of the container while vue updates what
is served within the container.

### Vue builds inside Docker

The Docker container can be entered to run npm or vue commands that will persist
outside of the container. To enter the container:

```bash
docker exec -it forms_forms_1 /bin/bash
```

You can run `vue run build` or other commands.

## Testing

Earthdata Pub uses [Cypress](https://docs.cypress.io/guides/getting-started/testing-your-app#Seeding-data) for e2e testing. The 
[getting started](https://docs.cypress.io/guides/getting-started/installing-cypress) guide 
was followed.

For setup, follow the instructions in the [getting started](https://docs.cypress.io/guides/getting-started/installing-cypress) guide.
You may have a few system libraries to install.  

Next view cypress.json to make sure your local dev settings match.  To run the overview app locally along with testing, run:

```bash
npm run start-forms-dev
npm run start-overview-dev
```

After that it is done:

```bash
npm run cypress OR npx cypress open 
```

The last command will open cypress tests in browser mode.  To run in headless mode:

```bash
npm run cypress-headless OR npx cypress run OR cypress-headless-all (for all browsers supported)
```

Firefox does not have a bypass for CORS, so at the time of this writing, the browsers cypress tests can be run on are chrome, chromium, edge, and electron.
Cypress says firefox needs to add the equivalent CORS bypass like cypress.json/chromeWebSecurity.

## Deploying

Earthdata Pub Forms deploys to AWS using Terraform through Bamboo. In the case
that Bamboo is not available, follow instructions in [terraform/README](./terraform/README.md).

## Documentation

Vuese auto documentation scrapes the javascript comments out of vue files and mixin
file and builds markdown files for them. It creates the folder, 'autodocs', as
depicted by it's config file .vueserc.

Documentation about Vuese can be found at their [NPM page](https://www.npmjs.com/package/vuese/v/1.4.0?activeTab=readme).

To build documentation:

install:

```bash
npm install -g @vuese/cli 
```

or

```bash
yarn global add vuese
```

then build:

```bash
npm run build-docs
```

then serve:

```bash
npm run open-docs
```

It will launch a document server and automatically open the browser.
