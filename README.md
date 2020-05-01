# Earthdata Pub Forms

This is the forms code repository for Earthdata Pub.

### Table of Contents

- **[Contributing](#contributing)**
- **[Framework: vue.js](#framework-vuejs)**
- **[Styling](#Custom-styling)**
- **[Develop using Docker](#develop-using-docker)**
- **[Auto documentaiton using vuese plugin](#Auto-documentation-using-vuese-plugin)**
- **[Testing with Jest](#testing-with-jest)**

## Contributing

The [`CONTRIBUTING.md`](./CONTRIBUTING.md) has instruction for contributing to the Earthata Pub project. Be sure to read that before submitting pull requests.

## Framework: vue.js

Earthdata Pub Forms uses [Vue.js](https://vuejs.org/), the progressive JavaScript framework.

To deploy vue app, simply:

```bash
$ npm build
$ npm run serve
```

## Custom styling

At a base, eui styling has been applied to the form automatically.  If the questions.json has the tag "style" and then a "link" to a custom css sheet, that is appended to the end of the stylesheets as an override.

## Develop using Docker

_(Docker setup inspired by https://daten-und-bass.io/blog/getting-started-with-vue-cli-on-docker/)_

Earthdata Pub Forms allows for local development without needing a local install of node.js, npm, and vue requirements by using [Docker](https://docs.docker.com/) to serve the vue.js application. [docker-compose](https://docs.docker.com/compose/) makes container deployment simple. See the [Dockerfile](./Dockerfile) and [docker.compose.yml](./docker-compose.yml) for details.

To deploy using docker-compose, simply:

```bash
$ docker-compose up
```

### Edits to code

The vue.js application code base is mounted into the Docker container as a volume. This allows the code to be edited outside of the container while vue updates what is served within the container.

### Vue builds inside Docker

The Docker container can be entered to run npm or vue commands that will persist outside of the container. To enter the container:

```bash
$ docker exec -it forms_forms_1 /bin/bash
```

You can run `vue run build` or other commands.

## Auto documentation using vuese plugin

Vuese auto documentation scrapes the javascript comments out of vue files and builds markdown files for them.  It creates the folder, website, and inside that, a folder named 'Components'.
[Documentation to vuese is here](https://dev.to/berniwittmann/quick--easy-documentation-generation-for-vuejs-components-7k6)
[API Documentation to vuese is here](https://vuese.org/)

Install the plugin by running:

```bash
$ npm install -g @vuese/cli --save
```

To build documentation, simply type:

```bash
$ vuese gen
```

Once can rename the folder 'website' as long as it is renamed before this step.  At the time of this writing, it is now named 'autodocs'.  We now need to serve the files as a website.  Run the following from in the autodocs folder:

```bash
$ npm i -g serve && serve .
```

You should now be able to view the files on your [localhost](http://localhost:5000).
[More documentation as well as an example, can be found here](https://docute.org/)

## Testing with Jest

Earthdata Pub uses [Jest](https://jestjs.io/) for unit testing.  I used a [getting started](https://jestjs.io/docs/en/getting-started) guide for Jest.