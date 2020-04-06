<template>
  <!-- header with eui class -->
  <header class="doc-mast header">
    <div class="container">
      <!-- Logo and menu -->
      <div class="eui-application-logo">
        <img
          alt="NASA logo"
          class="logo"
          src="https://cdn.earthdata.nasa.gov/eui/latest/docs/assets/ed-logos/app-logo.png"
        />
        <h2>{{form_title}}</h2>
        <div id="nav">
          <router-link to="/daacs">DAACS</router-link> | 
          <router-link to="/questions">Questions</router-link> | 
          <router-link to="/help">Help</router-link> 
        </div>
      <!-- End of Logo and menu -->
      </div>
    </div>
  </header>
  <!-- end of header with eui class -->
</template>
<script>
  // Exports the header as a component
  export default {
  name: 'Header',
  data() {
      return {
          
      }
  },
  // The property to be set by questions.vue
  props: {
      // The form title parsed from questions.vue
      form_title: { default: '', type: String }
  }
}
</script>
<style scoped>
  h2{
    text-align:left;
    text-decoration: none;
  }
  .header {
    width: 100%;
    background: #2276ac;
    box-shadow: 0 5px 5px rgba(189, 195, 199,0.15);
    display: flex;
    color:white
  }

  #title {
    line-height: 100px;
    text-align: center;
  }

  #title span {
    color: #194173;
    cursor: pointer;
    font-size: 1.2em;
    font-weight: bold;
    line-height: 1;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
  }
  
  @media screen and (max-width: 1330px) {
  .eui-masthead-logo {
      width: 300px;
  }
 .eui-masthead-logo.eui-application-logo a:link, .eui-masthead-logo.eui-application-logo a:visited {
    height: inherit;
    overflow: inherit;
    padding: 23px 0 5px 70px;
    color: white;
    font-weight: 100;
    font-size: 0.8em;
}

.eui-masthead-logo h1 a:link {
    overflow: hidden;
    -webkit-transition: background-image 0.1s linear;
    -moz-transition: background-image 0.1s linear;
    transition: background-image 0.1s linear;
    width: 215px;
    height: 50px;
    display: inline-block;
    background-repeat: no-repeat;
}
  .eui-masthead-logo {
      width: 350px;
      padding: 15px 0;
  }
  .eui-masthead-logo {
      padding: 0.5em 0;
  }
  .eui-masthead-logo {
      float: left;
      display: block;
      margin-right: 2.35765%;
      width: 65.88078%;
  }
  .eui-application-logo .logo {
    padding-top:1rem;
  }
  img {
      border: unset;
  }
}
</style>