// Jquery javascript
import $ from 'jquery'
export default {
    props:{
      form: {default: 'interest', type: String}
    },
    computed: {
    },
    methods: {
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
      // get Path via parameters, form title, then property 
      getPath(){
        let form = ''
        let parameters = this.$route.query
        if(typeof parameters['form'] != 'undefined'){
            form = parameters['form']
        } else if (typeof window.formTitle != 'undefined' && window.formTitle != ''){
            if (window.formTitle.toLowerCase().match(/interest/g)){
              form = 'interest'
            } else {
              form = 'questionaire'
            }   
        } else if (this.form != ''){
            form = this.form
        }
        let component_name_prefix = ''
        if(form.match(/questionaire/g)){
          component_name_prefix = 'Questionaire - '
        } else {
          component_name_prefix = 'Archival Interest - '
        }
        return [form, component_name_prefix]
      },
      // @vuese
      // get Path via parameters, form title, then property 
      setShowDaacs(){
        let form = this.getPath()[0]
        let parameters = this.$route.query
        if(typeof parameters['showDaacs']!='undefined' && Boolean(parameters['showDaacs'])){
          window.headerComponent.showDaacs = true
          window.localStorage.setItem("showDaacs", true);
        } else if(typeof parameters['showDaacs']!='undefined' && Boolean(parameters['showDaacs'])==false){
          window.headerComponent.showDaacs = false
          window.localStorage.setItem("showDaacs", false);
        } else if (form.match(/questionaire/g)){
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
            if(window.document.getElementById(activeElement + '_nav_link') != null){
              var prevClassname
              if (navs[n] == activeElement){
                prevClassname = window.document.getElementById(activeElement + '_nav_link').className
                window.document.getElementById(activeElement + '_nav_link').className = activeClass
              } else {
                prevClassname = window.document.getElementById(navs[n] + '_nav_link').className
                window.document.getElementById(navs[n] + '_nav_link').className = prevClassname.replace(activeClass,'') 
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
          if ($('#' + navs[n] + '_nav_link').hasClass(activeClass)){
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
            var reg = '/' + navs[n] + '/'
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
          var current_href = lctn.substr(0, lctn.lastIndexOf("/")).toLowerCase()
          let to_href = decodeURIComponent(shortName).replace(/ /g,'_').toLowerCase()
          let next_hash = current_href + '/' + to_href
          history.replaceState('updating daac in href', window.document.title, next_hash);
        }
      }
    }
  }