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
        if(this.$route){
          if((this.$route.query && typeof this.$route.query.group != 'undefined') ||
            (this.$route.params && typeof this.$route.params.group != 'undefined')){
            if(typeof this.$store !=='undefined'){
              if (typeof this.$route.query.group !== 'undefined') {
                redirect=`/${form}/questions/${this.$route.query.group}`
                this.$store.commit("pushGlobalParams", ['group',`${this.$route.query.group}`]);
              } else if (this.$route.params.group != 'selection') {
                redirect=`/${form}/questions/${this.$route.params.group}`
                this.$store.commit("pushGlobalParams", ['group',`${this.$route.params.group}`]);
              }
            }
          // Set path to form and questions for interest form
          } 
          /* else if (form.toLowerCase().match(/interest/g)){
            redirect=`/${form}/daacs/selection`
            if(typeof this.$store !=='undefined'){
              this.$store.commit("pushGlobalParams", ['group',`selection`]);
            }
          // Set path to form and questions for questionnaire
          } 
        }
        else if (form.toLowerCase().match(/questionnaire/g)){
          // TODO should redirect to dashboard with a message that a request has not yet started
          console.error('TODO should redirect to dashboard with a message that a request has not yet started')
          /* redirect=`/${form}/questions`
          if(typeof this.$store !=='undefined'){
            this.$store.commit("pushGlobalParams", ['group', null]);
          }*/
        } 
        // console.log('fullPath', this.$route.fullPath)
        // console.log('this.$route.path', this.$route.path)
        // console.log('redirect', redirect)
        // console.log('windows.location.href', window.location.href);
        this.setGlobalParameters();
        if(this.$route.path != redirect && redirect != ''){
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
      // Compares objects @x @y
      object_equals( x, y ) {
        if ( x === y ) return true;
          // if both x and y are null or undefined and exactly the same
      
        if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
          // if they are not strictly equal, they both need to be Objects
      
        if ( x.constructor !== y.constructor ) return false;
          // they must have the exact same prototype chain, the closest we can do is
          // test there constructor.
      
        for ( var p in x ) {
          // eslint-disable-next-line no-prototype-builtins
          if ( ! x.hasOwnProperty( p ) ) continue;
            // other properties were tested using x.constructor === y.constructor
          // eslint-disable-next-line no-prototype-builtins
          if ( ! y.hasOwnProperty( p ) ) return false;
            // allows to compare x[ p ] and y[ p ] when set to undefined
      
          if ( x[ p ] === y[ p ] ) continue;
            // if they have the same strict value or identity then they are equal
      
          if ( typeof( x[ p ] ) !== "object" ) return false;
            // Numbers, Strings, Functions, Booleans must be strictly equal
      
          if ( ! this.object_equals( x[ p ],  y[ p ] ) ) return false;
            // Objects and Arrays must be tested recursively
        }
      
        for ( p in y )
          // eslint-disable-next-line no-prototype-builtins
          if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) )
            return false;
              // allows x[ p ] to be set to undefined
      
        return true;
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
          if(typeof this.$route.params.group != 'undefined'){
            if (form == 'questionnaire'){
              this.$store.commit("pushGlobalParams",['group', null]);
            } else {
              this.$store.commit("pushGlobalParams",['group',`${this.$route.params.group}`]);
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
        if (typeof this.$route != 'undefined' && typeof this.$route.path != 'undefined'){
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
          component_name_prefix = 'Data Publication Request - '
        } else {
          component_name_prefix = 'Data Accession Request - '
        }
        return [form, component_name_prefix]
      },
      // @vuese
      // get Path via parameters then form, then saves whether daacs should show to the store
      setShowDaacs(){
        if (this.$route.path.match(/daacs/g) || this.$route.path.match(/selection/g)){
          window.headerComponent.showDaacs = true
        } else {
          window.headerComponent.showDaacs = false
        }
        /* let form = this.getForm()
        if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['showDaacs'] != 'undefined'){
          window.headerComponent.showDaacs = (this.$store.state.global_params['showDaacs'] == 'true' || this.$store.state.global_params['showDaacs'])
        } else if(typeof this.$store !== 'undefined' && typeof this.$store.state.global_params['group'] !== 'undefined' && this.$store.state.global_params['group'] !== 'selection' && form.toLowerCase().match(/interest/g)){
          console.log(this.$store.state.global_params['group'])
          window.headerComponent.showDaacs = false
        } else if (form.match(/questionnaire/g)){
          window.headerComponent.showDaacs = false
        } else if (form.match(/interest/g)){
          window.headerComponent.showDaacs = true
        } */

        if (window.headerComponent.showDaacs && typeof this.$store !=='undefined'){
          this.$store.commit("pushGlobalParams", ['showDaacs',`${window.headerComponent.showDaacs}`]);
        }
      },
      // @vuese
      // Set Daacs daac via parameters or form
      setDaacs(){
        let form = this.getForm()
        if (typeof this.$store !== 'undefined' && this.$store.state.global_params['group']!= ''){
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
                if(window.document.getElementById(`${navs[n]}_nav_link`) != null){
                  prevClassname = window.document.getElementById(`${navs[n]}_nav_link`).className
                  window.document.getElementById(`${navs[n]}_nav_link`).className = prevClassname.replace(activeClass,'')
                }                
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
      },
      // @vuese
    // Sends data to the API
    // @bvModal - the alert object to modify if an alert is necessary
    // @DAAC - hash string of the group to set in the json
    // @operation - string action (save, draft, submit)
    sendDataToApi(bvModal, DAAC, operation = "save") {
      let action;
      let skip_modal = false;
      let form = this.getForm();
      let was_draft = false
      let json = {
        data: JSON.parse(this.$store.state.global_params[`${form}_outputs`])[
          "data"
        ],
        log: JSON.parse(this.$store.state.global_params[`${form}_outputs`])["log"],
      };
      if (typeof this.$store !== 'undefined' && this.$store.state.global_params['formId'] != "") {
        json["form_id"] = this.$store.state.global_params['formId'];
      }
      if (typeof this.$store !== 'undefined' && this.$store.state.global_params['requestId'] != "") {
        json["id"] = this.$store.state.global_params['requestId'];
      }
      if (typeof DAAC !== "undefined" && DAAC != "" && DAAC != null) {
        json["daac_id"] = DAAC;
      }
      if (operation == "save" || operation == "draft") {
        if (operation == "draft") {
          was_draft = true
          operation = "save";
        }
        action = "saved";
      } else {
        action = "submitted";
      }
      if (typeof this.questions == 'undefined'){
        skip_modal = true
      }
      if(!this.$testing){
        $.ajax({
          type: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          url: `${process.env.VUE_APP_API_ROOT}/submission/${operation}`,
          data: JSON.stringify(json),
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          success: (response) => {
            this.requestId = response.id;
            this.$store.commit("pushGlobalParams",['requestId',`${this.requestId}`]);
            let message = `Your data have been ${action}.`
            if (operation == "submit") {
              this.$values = {};
              this.confirm = false;
              if (!this.$v.$anyError && (typeof process.env.VUE_APP_REDIRECT_CONFIRMATION == 'undefined' || JSON.parse(process.env.VUE_APP_REDIRECT_CONFIRMATION))) {
                this.redirectNotification(bvModal, message, operation)
              } else {
                this.exitForm(bvModal, message, skip_modal)
              }
            } else if (was_draft){
              if (typeof process.env.VUE_APP_REDIRECT_CONFIRMATION == 'undefined' || JSON.parse(process.env.VUE_APP_REDIRECT_CONFIRMATION)) {
                this.redirectNotification(bvModal, message, 'draft')
              } else {
                this.exitForm(bvModal, message, skip_modal)
              }
            } else {
              if(!skip_modal){
                  bvModal.msgBoxOk(message, {
                  title: "Success!",
                  size: "sm",
                  buttonSize: "sm",
                  okTitle: "OK",
                  footerClass: "p-2",
                  hideHeaderClose: false,
                  centered: true,
                })
              } else {
                this.redirectNotification(bvModal, message, 'save', skip_modal);
              }
            }
          },
          error: (XMLHttpRequest, textStatus, errorThrown) => {
            bvModal.msgBoxOk(
              `Your data could not be ${action}. Error returned: ${errorThrown}.  Please try again.`,
              {
                title: "Error!",
                size: "sm",
                buttonSize: "sm",
                okTitle: "OK",
                footerClass: "p-2",
                hideHeaderClose: false,
                centered: true,
              }
            );
          },
        });
      } else {
        bvModal.msgBoxOk('Data did not save.  Testing is set to true.', {
          title: "Success!",
          size: "sm",
          buttonSize: "sm",
          okTitle: "OK",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
      }
    },
    // @vuese
    // Asks the user if they want to be redirected to the dashboard requests page.
    // @bvModal - the alert object to modify if an alert is necessary
    // @message - any other function messages to include
    // @operation - string action (save, draft, submit)
    async redirectNotification(bvModal, message, operation, skip_modal = false) {
      if(operation == "submit" && !skip_modal){
        const value = await bvModal.msgBoxOk(
        `${message} You will be redirected to Earthdata Pub Dashboard Requests Page.`, 
        {
          title: "Success!",
          size: "sm",
          buttonSize: "sm",
          okTitle: "OK",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        if (value) {
          this.exitForm();
        }
    } else if (!skip_modal){
        const value = await bvModal.msgBoxConfirm(
        `${message} Do you want to be redirected to Earthdata Pub Dashboard Requests Page?`,
        {
          title: "Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        if (value) {
          this.exitForm();
        }
      } else if(skip_modal){
        this.exitForm();
      }
    },
    // @vuese
    // Alerts the user to errors and goes to top of page for messages to help.
    // @bvModal - the alert object to modify if an alert is necessary
    errorsNotification(bvModal) {
      bvModal.msgBoxOk(
        "You have errors to correct before you can submit data.  You can save data.",
        {
          title: "Errors",
          size: "sm",
          buttonSize: "sm",
          okTitle: "OK",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        }
      );
    },
    // @vuese
    // Resets form and local storage to empty entries
    // @evt - the event to prevent before checks
    cancelForm() {
      if (!this.confirm) {
        event.preventDefault();
      }
      // Resets form to blank entries
      if (this.confirm == false) {
        this.confirm = "";
        this.$bvModal
          .msgBoxConfirm(
            `This will cancel any input and redirect you to Earthdata Dashboard Requests.  Are you sure?`,
            {
              title: "Please Confirm",
              size: "lg",
              buttonSize: "sm",
              okVariant: "danger",
              okTitle: "YES",
              cancelTitle: "NO",
              footerClass: "p-2",
              hideHeaderClose: false,
              centered: true,
            }
          )
          .then((value) => {
            this.confirm = value;
            if (value) {
              this.okToCancel();
            } else {
              return;
            }
          });
      } else {
        this.confirm = false;
        this.okToCancel();
      }
    },
    // @vuese
    // Removes the store from storage and exits the form to requests page
    // @bvModal - the alert object to modify if an alert is necessary
    // @message - any other function messages to include
    exitForm(bvModal, message, skip_modal = false) {
      let url = `${process.env.VUE_APP_DASHBOARD_ROOT}/requests`;
      if(typeof bvModal != 'undefined' && typeof message != 'undefined' && !skip_modal){
        bvModal.msgBoxOk(message, {
          title: "Success!",
          size: "sm",
          buttonSize: "sm",
          okTitle: "OK",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then(() => {
          $("#eui-banner").addClass("hidden");
          window.location.href = url;
        })
      } else {
        $("#eui-banner").addClass("hidden");
        window.location.href = url;
      }
    },
    // @vuese
    // Used to save file
    // @operation - string action (save, draft, submit)
    saveFile(operation = "save") {
      let DAAC;
      if (this.daac == null && 
        typeof this.$store !== 'undefined' && 
        this.$store.state.global_params['group'] != "") {
        DAAC = this.$store.state.global_params['group']
      } else {
        DAAC = this.daac;
      }
      if(operation != 'draft'){
        this.$v.$touch();
      }
      const data = this.values;
      let form = this.getForm();
      if (data !== JSON.stringify({})) {
        this.$values = data;
        this.$output_object["data"] = this.$values;
        this.$output_object["log"] = this.$logging_object;
        if(typeof this.questions !== 'undefined'){
          this.$input_object["questions"] = this.questions[0];
        }
        this.$input_object["required"] = this.$required;
        this.$store.commit("pushGlobalParams", [`${form}_inputs`,`${JSON.stringify(this.$input_object)}`]);
        this.$store.commit("pushGlobalParams", [`${form}_outputs`,`${JSON.stringify(this.$output_object)}`]);
        // @vuese
        // Example log messages, this.$log.debug|info|warn|error|fatal('test', property|function, 'some error') -> see https://github.com/justinkames/vuejs-logger
        // If production level set (see main.js), will be at different level automatically.
        // Additonal options (can be set in main.js), stringifyArguments|showLogLevel|showMethodName|separator|showConsoleColors
        if (
          (!this.$v.$anyError && operation == "submit") ||
          operation != "submit"
        ) {
          this.sendDataToApi(this.$bvModal, DAAC, operation);
        } else {
          this.errorsNotification(this.$bvModal);
        }
      }
    }
  }
}
