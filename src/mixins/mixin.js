// Jquery javascript
import $ from "jquery";

// This mixins file acts as a common js file and the functions are shared between components.
export default {
    props:{
    },
    computed: {
    },
    methods: {
      // @vuese
      // Checks for authorization token, if none passed in, redirects to dashboard_root/auth
      checkAuth(){
        const url = `${process.env.VUE_APP_DASHBOARD_ROOT}/auth?redirect=forms`
        if(typeof this.$route.query.token == 'undefined' && !this.$testing) {
          if(localStorage.getItem('auth-token') == null){
            localStorage.setItem('forms-arrived-from', window.location.href)
            window.stop()
            window.location.href = url
          }
        } else {
          if(this.$testing){
            this.confirmExit(url)
          }
          localStorage.setItem('auth-token', this.$route.query.token)
          if(localStorage.getItem('forms-arrived-from') != null){
            let formsArrivedFrom = localStorage.getItem('forms-arrived-from')
            localStorage.removeItem('forms-arrived-from')
            window.location.href = formsArrivedFrom
          } else if ((Object.keys(this.$route.params).length === 0 && !window.location.href.match(/token/g)) && !window.location.href.match(/daacs/g)){
            this.showHideForms('hide')
            this.redirectNotification(this.$bvModal, '', 'submit', false, 'Forms require a Request Id')
          } else if (Object.keys(this.$route.params).length === 0 && !window.location.href.match(/daacs/g)){
            this.showHideForms('hide')
            this.redirectNotification(this.$bvModal, '', 'submit', true)
          }
        }
        this.$store.commit("setToken", localStorage.getItem('auth-token'));
      },
      // @vuese
      // Converts sentence string to title case
      // @arg str [String] the string to make title case
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
      // Gets the DAAC data
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
          if (this.$testing){
            url = "../../../daacs.json"
          } else {
            url = `${process.env.VUE_APP_API_ROOT}${process.env.VUE_APP_DAACS_URL}`
          }
          $.getJSON(url, daacs => {
            for (var dict in daacs) {
              if (daacs[dict].hidden) continue;
              items.push(daacs[dict]);
            }
            this.daacs = items
            resolve(items);
          }).fail(function() { 
            const url = `${process.env.VUE_APP_DASHBOARD_ROOT}/auth?redirect=forms`
            if (!this.$testing){
              localStorage.removeItem('auth-token')
              window.location.href = url
            } else { this.confirmExit(url) }
          })
        })
      },
      // @vuese
      // Gets DAAC specific metadata
      // @arg daac_specific [String] current hash to look for
      getDaac(daac_specific) {
        // Gets DAAC data for template
        if (typeof daac_specific === "undefined") {
          return { 
            id: "", 
            short_name: "", 
            long_name: "", 
            url: "", 
            description: ""
          };
        }
        for (var dict in this.daacs) {
          let d = this.daacs[dict];
          let id = d["id"];
          let long_name = d["long_name"];
          let short_name = d["short_name"];
          if (
            daac_specific === long_name ||
            daac_specific === short_name ||
            daac_specific === id
          ) {
            let url = d["url"];
            let description = d["description"];
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
      // Show or Hide forms (shows loading if hidden)
      // @arg hide [String] The action to take place.  Should be 'hide' or 'show'. Defaults to 'hide'.
      showHideForms(hide = 'hide'){
        const loading = document.getElementById('loading')
        if (loading != null) {
          if(hide === 'hide') {
            loading.classList.remove("hidden");
          } else {
            loading.classList.add("hidden");
          }
        }
      },
      // @vuese
      // Gets group id and form id from the API
      async getIDs(){
        return new Promise((resolve) => {
          let url;
          if (this.$testing){
            resolve(this.$store.state.global_params['formShortName'])
          } else {
            url = `${process.env.VUE_APP_API_ROOT}${process.env.VUE_APP_REQUEST_URL}/${this.$store.state.global_params['requestId']}`
            $.ajaxSetup({
              headers: {
                Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
              },
            });
            $.getJSON(url, (request) => {
              if (request.error){
                this.showHideForms('hide')
                this.redirectNotification(this.$bvModal, `The following Request Id ${this.$store.state.global_params['requestId']} was not found.`, 'submit', false, 'Request Not Found')
              } else {
                this.showHideForms('show')
              }
              this.$store.commit("pushGlobalParams", ['group', request.daac_id])
              if (typeof request.step_data != 'undefined') {
                this.$store.commit("pushGlobalParams", ['formId', request.step_data.form_id])
              }
              if (typeof this.$store.state.global_params['formId'] === 'undefined' && typeof request.step_data !== 'undefined' && typeof request.step_data.data !== 'undefined'){
                this.$store.commit("pushGlobalParams", ['formId', request.step_data.data.form_id])
              }
              if (this.$route.params.formId) {
                this.$store.commit("pushGlobalParams", ['formId', this.$route.params.formId])
              }
              url = `${process.env.VUE_APP_API_ROOT}${process.env.VUE_APP_FORM_URL}/${this.$store.state.global_params['formId']}`
              $.getJSON(url, (form) => {
                this.$store.commit("pushGlobalParams", ['formTitle', form.long_name])
                this.$store.commit("pushGlobalParams", ['formShortName', form.short_name])
                resolve(this.$store.state.global_params['formShortName'])
              }) 
            }).fail(function() { 
              const url = `${process.env.VUE_APP_DASHBOARD_ROOT}/auth?redirect=forms`
              if (!this.$testing){
                localStorage.removeItem('auth-token')
                window.location.href = url
              } else { this.confirmExit(url) }
            })
          }
        })
      },
      // @vuese
      // Changes location on nav click
      // @arg comp [String] can be 'daacs', 'dashboard', 'overview', or 'feedback'
      changeLocation(comp) {
        if (comp.match(/daacs/g)){
            this.goToComponent(comp)
          } else if (comp.match(/dashboard/g)){
            location.href=`${process.env.VUE_APP_DASHBOARD_ROOT}`
          } else if (comp.match(/overview/g)){
            location.href=`${process.env.VUE_APP_OVERVIEW_ROOT}`
          } else if (comp.match(/feedback/g)){
            location.href=`${process.env.VUE_APP_OVERVIEW_ROOT}/feedback`
          }
      },
      // @vuese
      // Sorts the current value data and saved data, compares for any differences.  
      // If there are differences, asks user to save before continuing to switch components or leaving
      // @arg comp [String] can be 'daacs', 'dashboard', 'overview', or 'feedback'
      compareDataAskLeave(comp){
        if((typeof window.questionsComponent != 'undefined' && typeof window.questionsComponent.values != 'undefined' && Object.keys(window.questionsComponent.values).length > 0)) {
          if (typeof this.$store !== 'undefined' && this.$store.state.global_params['formId'] != "" && 
            (this.$store.state.global_params['requestId'] != '' && typeof this.$store.state.global_params['requestId'] !== 'undefined')) {
            $.getJSON(
            `${process.env.VUE_APP_API_ROOT}${process.env.VUE_APP_REQUEST_URL}/${this.$store.state.global_params['requestId']}`,
            (answers) => {
              if(!answers.error){
                  if(!this.object_equals(answers.form_data, window.questionsComponent.values)){
                  this.$bvModal
                    .msgBoxConfirm(
                      `You are navigating away from this form. You will lose any unsaved data. Are you sure you want to continue?`,
                      {
                        title: "Please Confirm",
                        size: "lg",
                        buttonSize: "sm",
                        okVariant: "danger",
                        okTitle: "YES",
                        cancelTitle: "NO",
                        footerClass: "p-2",
                        hideformsHeaderClose: false,
                        centered: true,
                      }
                    )
                    .then((value) => {
                      if (value){
                        this.changeLocation(comp)
                      }
                    });
                } else {
                  this.changeLocation(comp)
                }
              }
            })
          } 
          else if ((typeof this.$store !== 'undefined' && this.$store.state.global_params['formId'] != "") && 
            (typeof window.questionsComponent != 'undefined' && typeof window.questionsComponent.values != 'undefined' && Object.keys(window.questionsComponent.values).length > 0)){
            this.$bvModal
            .msgBoxConfirm(
              `You are navigating away from this form. You will lose any unsaved data. Are you you sure you want to continue?`,
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
              if (value){
                this.changeLocation(comp)
              }
            });
          }  
          else {
            this.changeLocation(comp)
          }
        } else {
          this.changeLocation(comp)
        }
      },
      // @vuese
      // Go the component page specified with all the updated params needed
      // @arg comp [String] can be 'daacs', 'dashboard', 'overview', or 'feedback'
      goToComponent(comp){
        let formId, requestId, group, path;
        group = this.$store.state.global_params['group'];
        formId = this.$store.state.global_params['formId'];
        requestId = this.$store.state.global_params['requestId'];
        this.setActiveNav(comp.toLowerCase());
        if (comp.match(/daacs/g)){
          path = `/${comp.toLowerCase()}/selection`
        } else {
          path = `/${comp.toLowerCase()}/${requestId}`
        }
        if(this.$router.history.current.path != path){
          this.$router.push({
            name: comp,
            path: path,
            params: {
              formId: formId,
              requestId: requestId,
              group: group
            }
          });
        }
      },
      // @vuese
      // Fetchs the questions data
      async fetchQuestions() {
        return new Promise((resolve) => {
          $.ajaxSetup({
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
            },
          });
          let url;
          if (this.$testing){
            url = `../../${this.$store.state.global_params['formShortName']}.json`
          } else {
            url = `${process.env.VUE_APP_API_ROOT}${process.env.VUE_APP_FORMS_URL}?order=desc`
          }
          $.getJSON(url, (forms) => {
              var question = [];
              this.contacts = [];
              let contact = false;
              if (this.$testing && 
                typeof this.$store.state.global_params['formId'] == 'undefined' &&
                (this.$store.state.global_params['group'] !== "selection" || this.$store.state.global_params['group'] != "")
              ) {
                for (let f in forms) {
                  if (this.$store.state.global_params['formShortName'] == forms[f].short_name) {
                    this.$store.state.global_params['formId'] = forms[f]["id"];
                    break;
                  }
                }
              } 
              if(!this.$testing && typeof this.$store !== 'undefined'
              && this.$store.state.global_params['formId'] !== "" && this.$store.state.global_params['group'] !== "") {
                url = `${process.env.VUE_APP_API_ROOT}${process.env.VUE_APP_FORM_URL}/${this.$store.state.global_params['formId']}?daac_id=${this.$store.state.global_params['group']}`;
              }
              $.getJSON(url, (questions) => {
                if (typeof this.daacs === 'undefined') {
                  this.fetchDaacs().then(() => {
                    let daacData = this.getDaac(this.$store.state.global_params['group'])
                    if(typeof daacData!= 'undefined'){
                      this.selected = daacData.long_name;
                      this.daac_name = daacData.long_name;
                    }
                  });
                }
                for (var section in questions["sections"]) {
                  var heading = questions["sections"][section]["heading"];
                  var heading_required =
                    questions["sections"][section]["required"] || false;
                  var heading_show_if =
                    questions["sections"][section]["show_if"] || [];
                  var questions_section =
                    questions["sections"][section]["questions"];
                  questions_section["heading"] = heading;
                  questions_section["heading_required"] = heading_required;
                  questions_section["heading_show_if"] = heading_show_if;
                  for (var q in questions_section) {
                    if (typeof questions_section[q].long_name != "undefined") {
                      let text = questions_section[q].text;
                      let long_name = questions_section[q].long_name;
                      let help = questions_section[q].help;
                      if (
                        (typeof text != "undefined" &&
                          text.toLowerCase().match(/person/g)) ||
                        (typeof text != "undefined" &&
                          text.toLowerCase().match(/contact/g)) ||
                        (typeof long_name != "undefined" &&
                          long_name.toLowerCase().match(/person/g)) ||
                        (typeof long_name != "undefined" &&
                          long_name.toLowerCase().match(/contact/g)) ||
                        (typeof help != "undefined" &&
                          help.toLowerCase().match(/person/g)) ||
                        (typeof help != "undefined" &&
                          help.toLowerCase().match(/contact/g))
                      ) {
                        contact = true;
                      }
                    }
                    if (typeof questions_section[q].inputs != "undefined") {
                      for (var input in questions_section[q].inputs) {
                        var options = [];
                        if (
                          contact &&
                          typeof questions_section[q].inputs[input].label != 
                          "undefined" && 
                          questions_section[q].inputs[input].label.match(/name/gi)
                        ) {
                          questions_section[q].inputs[input].contact = true;
                          contact = false;
                        }
                        if (
                          typeof questions_section[q].inputs[input].enums !=
                          "undefined"
                        ) {
                          for (var e in questions_section[q].inputs[input].enums) {
                            var option =
                              questions_section[q].inputs[input].enums[e];
                            if (
                              Array.isArray(
                                questions_section[q].inputs[input].enums
                              )
                            ) {
                              options.push({ value: option, text: option });
                            } else if (
                              typeof questions_section[q].inputs[input].enums
                                .value != "undefined" &&
                              typeof questions_section[q].inputs[input].enums
                                .text != "undefined"
                            ) {
                              var text =
                                questions_section[q].inputs[input].enums.text;
                              var value =
                                questions_section[q].inputs[input].enums.value;
                              options.push({ value: value, text: text });
                            }
                          }
                        }
                        if (options.length > 0) {
                          questions_section[q].inputs[input]["options"] = options;
                        }
                      }
                    }
                  }
                  question.push(questions_section);
                }
                this.questions = question;
                resolve(question)
                if(question.length > 0){
                  this.showHideForms('show')
                }
              }).fail(function() { 
                const url = `${process.env.VUE_APP_DASHBOARD_ROOT}/auth?redirect=forms`
                if (!this.$testing){
                  localStorage.removeItem('auth-token')
                  window.location.href = url
                } else { this.confirmExit(url) }
              });
            }
          );
        })
      },
      // @vuese
      // Compares objects 
      // @arg x [Object], 
      // @arg y [Object]
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
      // Set active nav element
      // @arg activeElement [Object], 
      // @arg navs [Array] defaults to ['daacs', 'questions'], 
      // @arg activeClass [String] defaults to 'router-link-exact-active router-link-active'
      setActiveNav(activeElement, navs = ['daacs', 'questions'], activeClass = 'router-link-exact-active router-link-active'){
        setTimeout(() => {
          for(var n in navs){
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
      // Sends data to the API
      // @arg bvModal [Object] the alert object to modify if an alert is necessary, 
      // @arg DAAC [String] hash of the group to set in the json, 
      // @arg operation [String] action optional and defaults to 'save' out of ('save', 'draft', 'submit')
      sendDataToApi(bvModal, DAAC, operation = "save") {
        let action;
        let skip_modal = false;
        let form = this.$store.state.global_params['formShortName']
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
            url: `${process.env.VUE_APP_API_ROOT}/data/submission/operation/${operation}`,
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
      // @arg bvModal [Object] the alert object to modify if an alert is necessary, 
      // @arg message [String] any other function messages to include, 
      // @arg operation [String] action (save, draft, submit), 
      // @arg skip_modal [Boolean] optional defaults to false
      async redirectNotification(bvModal, message, operation = 'submit', skip_modal = false, custom_ok_title="Success!", custom_confirm_title="Confirmation") {
        if(operation == "submit" && !skip_modal){
          const value = await bvModal.msgBoxOk(
          `${message} You will be redirected to Earthdata Pub Dashboard Requests Page.`, 
          {
            title: custom_ok_title,
            size: "sm",
            buttonSize: "sm",
            okTitle: "OK",
            footerClass: "p-2 redirect-modal",
            hideHeaderClose: false,
            centered: true
          })
          if (value) {
            this.exitForm();
          }
      } else if (!skip_modal){
          const value = await bvModal.msgBoxConfirm(
          `${message} Do you want to be redirected to Earthdata Pub Dashboard Requests Page?`,
          {
            title: custom_confirm_title,
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "YES",
            cancelTitle: "NO",
            footerClass: "p-2 redirect-modal",
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
      // Alerts the user to errors and shows error messages
      // @arg bvModal [Object] the alert object to modify if an alert is necessary
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
      // Resets form
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
      // Exit confirmed.
      // @arg url [String] the url to be routed to.
      confirmExit(url){
        $("#eui-banner").addClass("hidden");
        if (this.$testing) {
          // eslint-disable-next-line
          console.log(`Normally href would be set to ${url}, but not when in testing mode.`)
          setTimeout(() => {
            this.showHideForms('show')
          }, "100")
        } else {
          window.location.href = url;
        }
      },
      // @vuese
      // Exits the form to requests page if user confirms
      // @arg bvModal [Object] the alert object to modify if an alert is necessary, 
      // @arg message [String] any other function messages to include, 
      // @arg skip_modal [Boolean] optional defaults to false
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
            this.confirmExit(url)
          })
        } else {
          this.confirmExit(url)
        }
      },
      // @vuese
      // Used to save file
      // @arg operation [String] action (save, draft, submit)
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
        let form = this.$store.state.global_params['formShortName']
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
