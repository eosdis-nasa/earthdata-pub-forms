// Jquery javascript
import $ from 'jquery'
export default {
    methods: {
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