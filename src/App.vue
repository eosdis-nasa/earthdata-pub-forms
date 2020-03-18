<template>
  <div id="app">
    <div id="nav">
      <router-link to="/daacs">DAACS</router-link> | 
      <router-link to="/questions">Questions</router-link> | 
      <router-link to="/help">Help</router-link> 
    </div>
    <router-view/>
  </div>
</template>
<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: left;
        color: #2c3e50;
    }
    .selector-for-some-widget {
        box-sizing: content-box;
    }
    #nav {
        padding: 30px;
        text-align:center;
    }
    #nav a {
        font-weight: bold;
        color: #2c3e50;
    }
    #nav a.router-link-exact-active {
        color: #42b983;
    }
    label{
        font-weight:bold;
    }
    div.row{
        margin:0rem;
    }
    input[type=radio   ]:not(old) + label{
        cursor: pointer;
    }
    label {
        margin-top: 0.5rem;
    }
</style>
