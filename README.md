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

To deploy vue app, simply:

```bash
$ npm build
$ npm run serve
```

## Custom styling

At a base, eui styling has been applied to the form automatically.  If the questions.json has the tag "style" and then a "link" to a custom css sheet, that is appended to the end of the stylesheets as an override.

An example of the questions.json header should look like this:

```javascript
npm build
$ npm run serve
```

## Develop using Docker

_(Docker setup inspired by https://daten-und-bass.io/blog/getting-started-with-vue-cli-on-docker/)_

Earthdata Pub Forms allows for local development without needing a local install of node.js, npm, and vue requirements by using [Docker](https://docs.docker.com/) to serve the vue.js application. [docker-compose](https://docs.docker.com/compose/) makes container deployment simple. See the [Dockerfile](./Dockerfile) and [docker.compose.yml](./docker-compose.yml) for details.

To deploy using docker-compose, simply:

```bash
$ docker-compose up
```

### Edits to code

The vue.js application code base is mounted into the Docker container as a volume. This allows the code to be edited outside of the container while vue updates what is served within the container.

### Auto documentation using vuese plugin

_(Documentation to vuese is here)(https://dev.to/berniwittmann/quick--easy-documentation-generation-for-vuejs-components-7k6)
_(API Documentation to vuese is here)(https://vuese.org/)

To build, at the commandline simply type:

```bash
$ vuese gen
```

### Vue builds inside Docker

The Docker container can be entered to run npm or vue commands that will persist outside of the container. To enter the container:

```bash
$ docker exec -it forms_forms_1 /bin/bash
```

You can run `vue run build` or other commands.

## Testing with Jest

Earthdata Pub uses [Jest](https://jestjs.io/) for unit testing.

## Open source liceneses for depenencies

`fontawesome`
`https://github.com/FortAwesome/Font-Awesome/blob/master/LICENSE.txt`

`bootstrap`
`https://github.com/twbs/bootstrap/blob/master/LICENSE`

`core-js`
`https://github.com/zloirock/core-js/blob/master/LICENSE`

`jquery`
`https://github.com/jquery/jquery/blob/master/LICENSE.txt`

`popper.js`
`https://github.com/popperjs/popper-core/blob/master/LICENSE.md`

`undo-redo-vuex`
`https://github.com/factorial-io/undo-redo-vuex/blob/master/LICENSE`

`vee-validate`
`https://github.com/logaretm/vee-validate/blob/master/LICENSE`

`vue`
`https://github.com/vuejs/vue/blob/dev/LICENSE`

`vue-router`
`https://github.com/vuejs/vue-router/blob/dev/LICENSE`

`vuelidate`
`https://github.com/vuelidate/vuelidate/blob/master/LICENSE`

`vuex`
`https://github.com/vuejs/vuex/blob/dev/LICENSE`