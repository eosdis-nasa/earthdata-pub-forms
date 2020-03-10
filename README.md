# Earthdata Pub Forms

This is the forms code repository for Earthdata Pub.

### Table of Contents

- **[Contributing](#contributing)**
- **[Framework: vue.js](#framework-vuejs)**
- **[Develop using Docker](#develop-using-docker)**
- **[Testing with Jest](#testing-with-jest)**

## Contributing

The [`CONTRIBUTING.md`](./CONTRIBUTING.md) has instruction for contributing to the Earthata Pub project. Be sure to read that before submitting pull requests.

## Framework: vue.js

Earthdata Pub Forms uses [Vue.js](https://vuejs.org/), the progressive JavaScript framework.

## Develop using Docker

_(Docker setup inspired by https://daten-und-bass.io/blog/getting-started-with-vue-cli-on-docker/)_

Earthdata Pub Forms allows for local development without needing a local install of node.js, npm, and vue requiremetns by using [Docker](https://docs.docker.com/) to serve the vue.js application. [docker-compose](https://docs.docker.com/compose/) makes container deployment simple. See the [Dockerfile](./Dockerfile) and [docker.compose.yml](./docker-compose.yml) for details.

To deploy using docker-compose, simply:

```bash
$ docker-compose up
```

### Initialize Vue application using Docker

_(skip this if the vue.js app already exists)_

If the vue.js application has not yet been initialized, a Docker container can be used to do so. Follow the directions in [`vue-init.txt`](./vue-init.txt) to initialize an application using a Docker container.

### Edits to code

The vue.js application code base is mounted into the Docker container as a volume. This allows the code to be edited outside of the container while vue updates what is served within the container.

### Vue builds inside Docker

The Docker container can be entered to run npm or vue commands that will persist outside of the container. To enter the container:

```bash
$ docker exec -it forms_forms_1 /bin/bash
```

You can run `vue run build` or other commands.

## Testing with Jest

Earthdata Pub uses [Jest](https://jestjs.io/) for unit testing.