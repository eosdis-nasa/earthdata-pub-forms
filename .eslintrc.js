module.exports = {
  root: true,
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    "airbnb-base"
  ],
  globals: {
    "crypto": true,
    "assert": true,
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    "ecmaVersion": 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'comma-dangle': ["error", "never"],
    'class-methods-use-this': 0,
    'no-param-reassign': ["error", { "props": false }],
    'import/no-extraneous-dependencies': ["error", { "devDependencies": true, "optionalDependencies": true, "peerDependencies": true }],
    'import/extensions': ["off"],
    'import/no-unresolved': ["off"],
    'no-await-in-loop': ["off"]
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ]
    }
  ]
}
