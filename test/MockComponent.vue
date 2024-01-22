<!-- Reproduced from https://dev.to/deepjyoti30/easily-test-mixins-with-jest-5e49 -->

<template>
    <div class="test"></div>
  </template>
  
  <script>
  /**
   * Return a component to be used as dummy in order
   * to mock things like mixins.
   */
  export default {
    name: "MockComponent"
  };
  </script>