// Jquery javascript
import $ from 'jquery'
export default {
    props:{

    },
    computed: {
    },
    methods: {
      // @vuese
      // Checks for authorization token, if none, redirects to dashboard_root/auth
      checkAuth(){
        if(typeof this.$route.query.token == 'undefined') {
          if(localStorage.getItem('auth-token') == null){
            window.location.href = `${process.env.VUE_APP_DASHBOARD_ROOT}/auth?redirect=forms`
          }
        } else {
          localStorage.setItem('auth-token', this.$route.query.token)
        }
      },
      // @vuese
      // Converts sentence string to title case
      titleCase(str) {
        if(typeof str != 'undefined'){
            str = str.toLowerCase().split(' ');
            for (var i = 0; i < str.length; i++) {
                str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
            }
        } else {
            return 'undefined'
        }
        return str.join(' ');
      },
      // @vuese
      // Re-evaluates the route and changes it if applicable
      resetRoute(){
        this.checkAuth()
        this.setShowDaacs()
        let redirect = '';
        let form = this.getPath()[0]
        // Append daac if parameter available
        if(this.$route && this.$route.query.parameters && this.$route.query.parameters.group){
            const page = window.headerComponent.showDaacs ? '/daacs' : '/questions'
            const group = this.$route.query.parameters.group
            redirect=`/${form}/${page}/${group}`
        // Automatically redirect to questions if daac selected
        } else if(window.localStorage.getItem('DAAC')!=null && form.toLowerCase().match(/interest/g)){
            redirect=`/${form}/questions/${window.localStorage.getItem('DAAC')}`
        // Set path to form and group daac (selection) for interest form
        } else if (form != '' && form.toLowerCase().match(/interest/g)){
            redirect=`/${form}/daacs/selection`
        // Set path to form and questions for questionnaire
        } else if (form != ''){
            redirect=`/${form}/questions`
        // Set path from localhost to interest form with group daac (selection)
        } else if (window.localStorage.getItem("showDaacs") && window.localStorage.getItem('DAAC').toLowerCase() == null){
            redirect = `/interest/daacs/selection`
        // Set path from localhost to questionnaire questions
        } else if (!window.localStorage.getItem("showDaacs")){
            redirect = `/questionaire/questions`
        }
        if(this.$route.fullPath != redirect){
            this.$router.push(redirect)
        }
      },
      // @vuese
      // get Path via parameters, form title (json), then route path
      getPath(){
        let form = ''
        if (typeof this.$route != 'undefined' && typeof this.$route.query != 'undefined' && typeof this.$route.query.form != 'undefined'){
          form = this.$route.query.form
        } else if (typeof window.formTitle != 'undefined' && window.formTitle != ''){
          if (window.formTitle.toLowerCase().match(/publication/g)){
            form = 'interest'
          } else {
            form = 'questionnaire'
          }
        } else if (typeof this.$route != 'undefined' && typeof this.$route.path != 'undefined'){
          if(this.$route.path.toLowerCase().match(/interest/g)){
            form = 'interest'
          } else if (this.$route.path.toLowerCase().match(/questionnaire/g)){
            form = 'questionnaire'
          } else {
            form = 'interest'
          }
        }
        let component_name_prefix = ''
        if(form.match(/questionnaire/g)){
          component_name_prefix = 'Data Product Information - '
        } else {
          component_name_prefix = 'Data Publication Request - '
        }
        return [form, component_name_prefix]
      },
      // @vuese
      // get Path via parameters, form title, then property
      setShowDaacs(){
        let form = this.getPath()[0]
        if(typeof this.$route != 'undefined' && typeof this.$route.query.parameters != 'undefined' && typeof this.$route.query.parameters.group != 'undefined' && Boolean(this.$route.query.parameters.group)){
          window.headerComponent.showDaacs = true
          window.localStorage.setItem("showDaacs", true);
        } else if(typeof this.$route != 'undefined' && typeof this.$route.query.parameters != 'undefined' && typeof this.$route.query.parameters.group != 'undefined' && Boolean(this.$route.query.parameters.group)==false){
          window.headerComponent.showDaacs = false
          window.localStorage.setItem("showDaacs", false);
        } else if (form.match(/questionnaire/g)){
          window.headerComponent.showDaacs = false
          window.localStorage.setItem("showDaacs", false);
        } else if (form.match(/interest/g)){
          window.headerComponent.showDaacs = true
          window.localStorage.setItem("showDaacs", true);
        }
      },
      // @vuese
      // Set Daacs daac via parameters or windows storage
      setDaacs(){
        if (window.localStorage.getItem("DAAC") != null) {
          return window.localStorage.getItem("DAAC");
        } else {
          return "selection";
        }
      },
      // @vuese
      // Set active nav element
      setActiveNav(activeElement, navs = ['daacs', 'help', 'questions'], activeClass = 'router-link-exact-active router-link-active'){
        setTimeout(() => {
          for(var n in navs){
            if((!window.headerComponent.showDaacs && navs[n] == 'daacs')){ continue }
            if(window.document.getElementById(`${activeElement}_nav_link`) != null){
              var prevClassname
              if (navs[n] == activeElement){
                prevClassname = window.document.getElementById(`${activeElement}_nav_link`).className
                window.document.getElementById(`${activeElement}_nav_link`).className = activeClass
              } else {
                prevClassname = window.document.getElementById(`${navs[n]}_nav_link`).className
                window.document.getElementById(`${navs[n]}_nav_link`).className = prevClassname.replace(activeClass,'')
              }
            }
          }
        }, 10)
      },
      // @vuese
      // Get active nav element according to class of nav elements
      getActiveNavViaClass(navs = ['daacs', 'help', 'questions'], activeClass = 'router-link-exact-active.router-link-active'){
        for(var n in navs){
          if(!window.headerComponent.showDaacs && navs[n] == 'daacs'){ continue }
          if ($(`#${navs[n]}_nav_link`).hasClass(activeClass)){
            return navs[n]
          }
        }
      },
      // @vuese
      // Set active nav element according to location.href value
      setActiveNavViaLocation(navs = ['daacs', 'help', 'questions']){
          var match_found = false
          for(var n in navs){
            if(!window.headerComponent.showDaacs && navs[n] == 'daacs'){ continue }
            var reg = `/${navs[n]}/`
            var re = new RegExp(reg, "g")
            if(location.href.match(re)){
              this.setActiveNav(navs[n])
              match_found = true
            }
          }
          return match_found
      },
      // @vuese
      // Set / Resets active location.href value without updating state
      setActiveLocationWithoutReload(lctn = location.href, shortName){
        if(typeof shortName !='undefined' && shortName != null && (lctn.match(/questions/g) || lctn.match(/daacs/g))){
          let after_protocol, new_url;
          var current_href = lctn.substr(0, lctn.lastIndexOf("/")).toLowerCase()
          let to_href = decodeURIComponent(shortName).replace(/ /g,'_').toLowerCase()
          let next_url = `${current_href}/${to_href}`
          if(typeof next_url.split('http://')[1] != 'undefined'){
            after_protocol = next_url.split('http://')[1].replace(/\/\//g,'/')
            new_url = `http://${after_protocol}`
          } else {
            after_protocol = next_url.replace(/\/\//g,'/')
            new_url = `${after_protocol}`
          }
          history.replaceState('updating daac in href', window.document.title, new_url);
        }
      }
    }
  }
