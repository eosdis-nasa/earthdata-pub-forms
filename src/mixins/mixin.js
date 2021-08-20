// Jquery javascript
import $ from "jquery";
export default {
    props:{
    },
    computed: {
    },
    methods: {
      // @vuese
      // Checks for authorization token, if none passed in, redirects to dashboard_root/auth
      checkAuth(){
        if(this.$testing){
          return;
        }
        if(typeof this.$route.query.token == 'undefined') {
          if(localStorage.getItem('auth-token') == null){
            window.location.href = `${process.env.VUE_APP_DASHBOARD_ROOT}/auth?redirect=forms`
          }
        } else {
          localStorage.setItem('auth-token', this.$route.query.token)
        }
        this.$store.commit("setToken", localStorage.getItem('auth-token'));
      },
      // @vuese
      // Converts sentence string to title case
      // @str - the string to make title case
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
      // Fetchs the DAAC data
      async fetchDaacs() {
        return new Promise((resolve) => {
          // Gets DAAC data for template
          var items = [];
          $.ajaxSetup({
            headers : {
              'Authorization' : `Bearer ${localStorage.getItem('auth-token')}`,
            }
          });
          let url;
          if(this.$testing){
            url = "../../daacs.json"
          } else {
            url = `${process.env.VUE_APP_API_ROOT}${process.env.VUE_APP_DAACS_URL}`
          }
          $.getJSON(url, daacs => {
            for (var dict in daacs) {
              items.push(daacs[dict]);
            }
            this.daacs = items
            resolve(items);
          });
        })
      },
      // @vuese
      // Fetchs DAAC specific metadata
      // @daac_specific - current hash to look for
      getDaac(daac_specific) {
        // Gets DAAC data for template
        if (typeof daac_specific === "undefined") {
          return { id: "", short_name: "", long_name: "", url: "", description: "" };
        }
        for (var dict in this.daacs) {
          let id = this.daacs[dict]["id"];
          let long_name = this.daacs[dict]["long_name"];
          let short_name = this.daacs[dict]["short_name"];
          if (
            daac_specific === long_name ||
            daac_specific === short_name ||
            daac_specific === id
          ) {
            let url = this.daacs[dict]["url"];
            let description = this.daacs[dict]["description"];
            return {
              id:id,
              short_name: short_name,
              long_name: long_name,
              url: url,
              description: description
            };
          }
        }
      },
      // @vuese
      // Returns form global params or looks it up by the path
      getForm(){
        let form;
        if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['form'] != 'undefined'){
          form = this.$store.state.global_params['form']
        } else {
          form = this.getPath()[0]
        }
        return form
      },
      // @vuese
      // Returns form name prefix from global params or looks it up by the path
      getFormNamePrefix(){
        let form_name_prefix;
        if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['form_name_prefix'] != 'undefined'){
          form_name_prefix = this.$store.state.global_params['form_name_prefix']
        } else {
          form_name_prefix = this.getPath()[1]
        }
        return form_name_prefix
      },
      // @vuese
      // Evaluates the route and changes it if applicable
      setRoute(){
        this.checkAuth()
        let redirect = '';
        let form = this.getForm();
        this.setShowDaacs()
        // Automatically redirect to questions if daac selected or sent in
        if(this.$route && this.$route.query && this.$route.query.group){
          redirect=`/${form}/questions/${this.$route.query.group}`
          if(typeof this.$store !=='undefined'){
            this.$store.commit("pushGlobalParams", ['group',`${this.$route.query.group}`]);
          }
        // Set path to form and questions for interest form
        } else if (form.toLowerCase().match(/interest/g)){
          redirect=`/${form}/daacs/selection`
          if(typeof this.$store !=='undefined'){
            this.$store.commit("pushGlobalParams", ['group',`selection`]);
          }
        // Set path to form and questions for questionnaire
        } else if (form.toLowerCase().match(/questionnaire/g)){
          redirect=`/${form}/questions`
          if(typeof this.$store !=='undefined'){
            this.$store.commit("pushGlobalParams", ['group', null]);
          }
        }
        this.setGlobalParameters();
        if(this.$route.fullPath != redirect){
          let prefix, formId, requestId, group, loc
          if(typeof this.$store === 'undefined'){
            prefix = this.getFormNamePrefix();
            formId = undefined;
            requestId = undefined;
            group = undefined;
          } else {
            prefix = this.$store.state.global_params['form_name_prefix'];
            group = this.$store.state.global_params['group'];
            formId = this.$store.state.global_params['formId'];
            requestId = this.$store.state.global_params['requestId'];
          }
          if(redirect.match(/questions/g)){
            loc = 'questions';
          } else {
            loc = 'daacs';
          }
          this.setActiveNav(loc);
          this.$router.push({
            name: `${prefix}${this.titleCase(loc)}`,
            path: `${redirect}`,
            params: {
              formId: formId,
              requestId: requestId,
              group: group
            }
          });
          this.setActiveLocationWithoutReload(`${redirect}`)
        }
      },
      // @vuese
      // Set store global parameters from route
      setGlobalParameters(){
        let form_components = this.getPath()
        let form = form_components[0]
        if(typeof this.$store !=='undefined'){
          this.$store.commit("pushGlobalParams", ['form_name_prefix',`${form_components[1]}`]);
          this.$store.commit("pushGlobalParams", ['form',`${form}`]);
          if(typeof this.$route.query.formId != 'undefined'){
            this.$store.commit("pushGlobalParams",['formId',`${this.$route.query.formId}`]);
          } else if (form == 'questionnaire'){
            this.$store.commit("pushGlobalParams",['formId',`${process.env.VUE_APP_PRODUCT_INFO_FORM_ID}`]);
          } else {
            this.$store.commit("pushGlobalParams",['formId',`${process.env.VUE_APP_PUBLICATION_REQ_FORM_ID}`]);
          }
          if(typeof this.$route.query.requestId != 'undefined'){
            this.$store.commit("pushGlobalParams",['requestId',`${this.$route.query.requestId}`]);
          }
          if(typeof this.$route.query.group != 'undefined'){
            if (form == 'questionnaire'){
              this.$store.commit("pushGlobalParams",['group', null]);
            } else {
              this.$store.commit("pushGlobalParams",['group',`${this.$route.query.group}`]);
            }
          }
          if(typeof this.$route.query.showDaacs != 'undefined'){
            this.$store.commit("pushGlobalParams",['showDaacs',`${this.$route.query.showDaacs}`]);
          }
        }
      },
      // @vuese
      // get Path via parameters, form title (json), then route path
      getPath(){
        let form = ''
        if (typeof this.$store !== 'undefined' && this.$store.state.global_params['formId'] == `${process.env.VUE_APP_PRODUCT_INFO_FORM_ID}` ||
          typeof this.$route !== 'undefined' && this.$route.query.formId == `${process.env.VUE_APP_PRODUCT_INFO_FORM_ID}`){
          form = 'questionnaire'
        } else if (typeof this.$store !== 'undefined' && this.$store.state.global_params['formId'] == `${process.env.VUE_APP_PUBLICATION_REQ_FORM_ID}` ||
          typeof this.$route !== 'undefined' && this.$route.query.formId == `${process.env.VUE_APP_PUBLICATION_REQ_FORM_ID}`){
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
      // get Path via parameters then form, then saves whether daacs should show to the store
      setShowDaacs(){
        let form = this.getForm()
        if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['showDaacs'] != 'undefined'){
          window.headerComponent.showDaacs = (this.$store.state.global_params['showDaacs'] == 'true' || this.$store.state.global_params['showDaacs'])
        } else if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['group'] != 'undefined' && form.toLowerCase().match(/interest/g)){
          window.headerComponent.showDaacs = true
        } else if (form.match(/questionnaire/g)){
          window.headerComponent.showDaacs = false
        } else if (form.match(/interest/g)){
          window.headerComponent.showDaacs = true
        }
        if (window.headerComponent.showDaacs && typeof this.$store !=='undefined'){
          this.$store.commit("pushGlobalParams", ['showDaacs',`${window.headerComponent.showDaacs}`]);
        }
      },
      // @vuese
      // Set Daacs daac via parameters or form
      setDaacs(){
        let form = this.getForm()
        if (typeof this.$store !== 'undefined' && this.$store.state.global_params['group']!= ''){
          this.$store.commit("pushGlobalParams", ['group',`${this.$store.state.global_params['group']}`]);
          return this.$store.state.global_params['group']
        } else if (form.toLowerCase().match(/interest/g) && typeof this.$store !== 'undefined'){
          this.$store.commit("pushGlobalParams", ['group',`selection`]);
          return "selection";
        } else {
          return null;
        }
      },
      // @vuese
      // Set active nav element
      setActiveNav(activeElement, navs = ['daacs', 'questions'], activeClass = 'router-link-exact-active router-link-active'){
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
      // Set / Resets active location.href value without updating state
      setActiveLocationWithoutReload(id){
        if(typeof id !='undefined' && id != null){
          let after_protocol, new_url;
          let to_href = decodeURIComponent(id).replace(/ /g,'_').toLowerCase()
          let next_url = `${to_href}`
          if(typeof next_url.split('http://')[1] != 'undefined'){
            after_protocol = next_url.split('http://')[1].replace(/\/\//g,'/')
            new_url = `http://${after_protocol}`
          } else {
            after_protocol = next_url.replace(/\/\//g,'/')
            new_url = `${after_protocol}`
          }
          this.fetchDaacs().then(() => {
            let daacData = this.getDaac(id)
            if(typeof daacData != 'undefined' && typeof window.questionsComponent != 'undefined'){
              window.questionsComponent.daac_name = daacData.short_name
            }
          });
          history.replaceState('updating daac in href', window.document.title, new_url);
        }
      }
    }
  }
