# Earthdata Pub Forms

This is the Forms code repository for Earthdata Pub (EDPub).

## Table of Contents

- [Contributing](#contributing)
- [Installing](#Installing)
- [Running locally](#running-locally)
- [Styling](#Custom-styling)
- [Developing](#Developing)
- [Deploying](#deploying)
- [Testing](#testing)
- [Documentation](#documentation)

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for instruction for contributing to
the EDPub project. Be sure to read that before submitting pull requests.

## Installing

EDPub Forms use node v12.19.0. To build/run the Forms on your local
machine, install nvm following the [nvm Install & Update Script](https://github.com/nvm-sh/nvm#install--update-script)
instructions.

We use npm for local package management, to install the requirements:

```bash
nvm install v12.19.0
nvm use
npm install
```

## Running locally

To run locally:

```bash
npm run start-forms
```

The vue app can also be run locally using:

```bash
npm run build
npm run serve
```

To view logs from the Docker container:

```bash
npm run view-logs
```

### Dashboard and API

The Forms application is dependent on the EDPub [Dashboard](https://git.earthdata.nasa.gov/projects/EDPUB/repos/dashboard)
and [API](https://git.earthdata.nasa.gov/projects/EDPUB/repos/api). Follow
instructions in each repo or the [EDPub core](https://git.earthdata.nasa.gov/projects/EDPUB/repos/earthdata-pub)
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

Earthdata Pub uses [Jest](https://jestjs.io/) for unit testing. I used a
[getting started](https://jestjs.io/docs/en/getting-started) guide for Jest.

To run Jest:

```bash
npm run test:unit questions.spec.js
```

## Deploying

Earthdata Pub Forms deploys to AWS using Terraform through Bamboo. In the case
that Bamboo is not available, follow instructions in [terraform/README](./terraform/README.md).

## Documentation

Vuese auto documentation scrapes the javascript comments out of vue files and builds
markdown files for them. It creates the folder, website, and inside that, a folder
named 'Components'.

- Documentation to vuese - [Quick & easy documentation generation for Vue.js components](https://dev.to/berniwittmann/quick--easy-documentation-generation-for-vuejs-components-7k6)
- API Documentation for [vuese](https://vuese.org/)

To build documentation, simply type:

```bash
vuese gen
```

Once can rename the folder 'website' as long as it is renamed before this step.
At the time of this writing, it is now named 'autodocs'. We now need to serve the
files as a website. Run the following from in the autodocs folder:

```bash
cd website
npm serve .
```

You should now be able to view the files on your [localhost](http://localhost:8081).
[More documentation as well as an example, can be found here](https://docute.org/)
