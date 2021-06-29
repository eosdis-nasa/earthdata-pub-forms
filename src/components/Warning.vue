<template>
  <!--<div id="warning-overlay" v-if="active">
    <div id="warning-window">
      <div id="warning-window-header">
        <h3>Session Expiring</h3>
      </div>
      <div id="warning-window-body">
        <p>Your session will expire in {{ testcount }} seconds. Would you like to extend the session?</p>
      </div>
      <div id="warning-window-footer">
        <button v-on:click="logout">Logout Now</button>
        <button v-on:click="extend">Extend Session</button>
      </div>
    </div>
  </div>-->
  <b-modal ref="timeout-warning"
    title="Session Expiring"
    ok-title="Extend Session"
    cancel-title="Logout Now"
    size="sm"
    button-size="sm"
    @ok="extend"
    @cancel="logout"
    hide-header-close
    no-close-on-backdrop
    no-close-on-esc
    centered
    >
    Your session will expire in {{count}} seconds.
  </b-modal>
</template>

<script>
import { mapState } from 'vuex';
import * as jwt from 'jsonwebtoken';
export default {
  name: 'Warning',
  data() {
    return {
      count: 30,
      timeout: false,
      interval: false
    }
  },
  computed: mapState(['token']),
  watch: {
    token(newToken, oldToken) {
      if (newToken !== oldToken) {
        this.setupTimeout();
      }
    }
  },
  methods: {
    setupTimeout: function () {
      if (this.token) {
        const decoded = jwt.decode(this.token);
        if (decoded && decoded.exp) {
          const expiration = decoded.exp - Date.now() - 31000;
          this.count = 30;
          if (expiration < 1000) {
            window.location.href = `${process.env.VUE_APP_DASHBOARD_ROOT}/auth?redirect=forms`;
          }
          this.timeout = setTimeout(this.show, expiration);
        }
      }
    },
    update: function () {
      this.count -= 1;
      if (this.count <= 1) {
        this.logout();
      }
    },
    show: function () {
      this.timeout = false;
      this.interval = setInterval(this.update, 1000);
      this.$refs['timeout-warning'].show()
    },
    hide: function () {
      this.active = false;
      clearInterval(this.interval);
      this.interval = false;
      this.$refs['timeout-warning'].hide()
    },
    extend: function () {
      const options = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth-token')}`
        }
      };
      fetch(`${process.env.VUE_APP_API_ROOT}/token/refresh`, options)
      .then(r => r.json())
      .then(({ token }) => {
        clearInterval(this.interval);
        this.interval = false;
        localStorage.setItem('auth-token', token);
        this.$store.commit("setToken", token);
      });
      this.hide();
    },
    logout: function () {
      localStorage.removeItem('auth-token');
      window.location.href = process.env.VUE_APP_OVERVIEW_ROOT;
    }
  }
}

</script>

<style>
</style>
