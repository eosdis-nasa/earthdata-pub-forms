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
        console.log('CHECK AUTH')
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
        //console.log('SET ROUTE')
        this.checkAuth()
        this.setShowDaacs()
        let redirect = '';
        let form_components = this.getPath()
        let form = form_components[0]
        let form_name_prefix = form_components[1]
        /*let address = window.location.href.split("/")
        var host = address[0] + address[1] + address[2];
        host = host.replace('http:','http://')
        // Get form set path start
        if(window.headerComponent.showDaacs){
          redirect=`/${form}/daacs`
        } else {
          redirect=`/${form}/questions`
        }*/
        // Automatically redirect to questions if daac sent in
        //if(typeof this.$route != 'undefined' && typeof this.$route.query != 'undefined' && typeof this.$route.query.group != 'undefined'){
          //redirect=`/${form}/questions/${this.$route.query.group}`
        // Automatically redirect to questions if daac selected
        if(this.$route && this.$route.query && this.$route.query.group){
          const page = window.headerComponent.showDaacs ? '/daacs' : '/questions'
          const group = this.$route.query.group
          redirect=`/${form}/${page}/${group}`
        } else if(window.localStorage.getItem('DAAC')!=null && form.toLowerCase().match(/interest/g)){
          redirect=`/${form}/questions/${window.localStorage.getItem('DAAC')}`
          this.$store.commit(
            "pushGlobalParams",
            ['group',`${window.localStorage.getItem('DAAC')}`]
          );
          //console.log('request id is ' + this.$store.state.global_params['requestId'])
        // Set path to form and group daac (selection) for interest form
        } else if (form != '' && form.toLowerCase().match(/interest/g)){
          redirect=`/${form}/daacs/selection`
        // Set path to form and questions for questionnaire
        } else if (form != ''){
          redirect=`/${form}/questions`
        // Set path from localhost to interest form with group daac (selection)
        } else if (window.localStorage.getItem("showDaacs") && window.localStorage.getItem('DAAC') == null){
          //redirect = `${window.location.href}interest/daacs/selection`
          redirect = `/interest/daacs/selection`
          this.$store.commit(
            "pushGlobalParams",
            ['showDaacs',`${window.localStorage.getItem('showDaacs')}`]
          );
        // Set path from localhost to questionnaire questions
        } else if (!window.localStorage.getItem("showDaacs")){
          //redirect = `${window.location.href}questionaire/questions`
          redirect = `/questionaire/questions`
        }
        this.setGlobalParameters(form);
        //if(window.location.href != `${host}${redirect}`){
        if(this.$route.fullPath != redirect){
          //this.setActiveLocationWithoutReload(window.location.href, `${host}${redirect}`)
          this.setActiveLocationWithoutReload(window.location.href, `${redirect}`)
          if(window.location.href.match(/questions/g)){
            this.setActiveNav('questions');
            this.$router.push({
              name: `${form_name_prefix}Questions`,
              path: `${redirect}`,
              params: {
                formId: this.$store.state.global_params['formId'],
                requestId: this.$store.state.global_params['requestId'],
                group: this.$store.state.global_params['group']
              }
            });
          } else {
            this.setActiveNav('daacs');
            this.$router.push({
              name: `${form_name_prefix}Daacs`,
              path: `${redirect}`,
              params: {
                formId: this.$store.state.global_params['formId'],
                requestId: this.$store.state.global_params['requestId'],
                group: this.$store.state.global_params['group']
              }
            });
          }
        }
      },
      // @vuese
      // Set store global parameters from route
      setGlobalParameters(form){
        // set store global parameters
        if(typeof this.$route.query.formId != 'undefined'){
          // set form id
          this.$store.commit("pushGlobalParams",['formId',`${this.$route.query.formId}`]);
        } else if (form == 'questionnaire'){
          this.$store.commit("pushGlobalParams",['formId',`${process.env.VUE_APP_PRODUCT_INFO_FORM_ID}`]);
        } else {
          this.$store.commit("pushGlobalParams",['formId',`${process.env.VUE_APP_PUBLICATION_REQ_FORM_ID}`]);
        }
        // set request id
        if(typeof this.$route.query.requestId != 'undefined'){
          this.$store.commit("pushGlobalParams",['requestId',`${this.$route.query.requestId}`]);
        }
        // set group / daac
        if(typeof this.$route.query.group != 'undefined'){
          this.$store.commit("pushGlobalParams",['group',`${this.$route.query.group}`]);
          window.localStorage.setItem("DAAC", this.$store.state.global_params['group'])
        }
        if(typeof this.$route.query.showDaacs != 'undefined'){
          this.$store.commit("pushGlobalParams",['showDaacs',`${this.$route.query.showDaacs}`]);
        }
      },
      // @vuese
      // get Path via parameters, form title (json), then route path
      getPath(){
        let form = ''
        if (this.$store.state.global_params['formId'] == `${process.env.VUE_APP_PRODUCT_INFO_FORM_ID}`){
            form = 'questionnaire'
          } else if (this.$store.state.global_params['formId'] == `${process.env.VUE_APP_PUBLICATION_REQ_FORM_ID}`){
            form = 'interest'
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
        if(typeof this.$store.state.global_params['showDaacs'] != 'undefined'){
          window.headerComponent.showDaacs = (this.$store.state.global_params['showDaacs'] == 'true' || this.$store.state.global_params['showDaacs'])
          window.localStorage.setItem("showDaacs", window.headerComponent.showDaacs);
        } else if(typeof this.$store.state.global_params['group'] != 'undefined'){
          window.headerComponent.showDaacs = true
          window.localStorage.setItem("showDaacs", true);
        } else if (form.match(/questionnaire/g)){
          window.headerComponent.showDaacs = false
          window.localStorage.setItem("showDaacs", false);
        } else if (form.match(/interest/g)){
          window.headerComponent.showDaacs = true
          window.localStorage.setItem("showDaacs", true);
        }
        if (window.headerComponent.showDaacs){
          this.$store.commit(
            "pushGlobalParams",
            ['showDaacs',`${window.headerComponent.showDaacs}`]
          );
        }
      },
      // @vuese
      // Set Daacs daac via parameters or windows storage
      setDaacs(){
        if (window.localStorage.getItem("DAAC") != null) {
          this.$store.commit(
            "pushGlobalParams",
            ['group',`${window.localStorage.getItem("DAAC")}`]
          );
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
        if(typeof shortName !='undefined' && shortName != null){
          let after_protocol, new_url;
          var current_href = lctn.substr(0, lctn.lastIndexOf("/")).toLowerCase()
          let to_href = decodeURIComponent(shortName).replace(/ /g,'_').toLowerCase()
          let next_url = `${to_href}`
          if(typeof next_url.split('http://')[1] != 'undefined'){
            after_protocol = next_url.split('http://')[1].replace(/\/\//g,'/')
            new_url = `http://${after_protocol}`
          } else {
            after_protocol = next_url.replace(/\/\//g,'/')
            new_url = `${after_protocol}`
          }
          console.log(`location: ${lctn}, shortName: ${shortName}, current_href: ${current_href}, to_href: ${to_href}, nextUrl: ${next_url}, after_protocol: ${after_protocol}, newurl: ${new_url}`)
          history.replaceState('updating daac in href', window.document.title, new_url);
        }
      }
    }
  }
