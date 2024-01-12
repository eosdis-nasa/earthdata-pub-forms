let plugins = []
let presets = []
presets.push([
  '@babel/preset-env'
])
plugins.push([
  "js-logger"
])
if (process.env.NODE_ENV === 'test') {
  presets.push([
    '@vue/app'
  ])
  presets.push(['@istanbuljs/nyc-config-babel'])
  plugins.push(["transform-class-properties"])
  plugins.push([
    "istanbul", {
      // specify some options for NYC instrumentation here
      // like tell it to instrument both JavaScript and Vue files
      "extension": ['**/*.js', '**/*.vue'],
      "exclude": [
        "**/cypress/*.js"
      ]
    }
  ])
}

module.exports = {
  presets,
  plugins
}
