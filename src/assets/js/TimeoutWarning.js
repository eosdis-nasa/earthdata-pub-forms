// The Timeout Warning component checks if authorized
// It then sets a timer for a recheck of the token.
import { mapState } from 'vuex';
import * as jwt from 'jsonwebtoken';
export default {
    name: 'TimeoutWarning',
    data() {
        return {
            expiration: 0,
            count: 30,
            timeout: false,
            interval: false
        }
    },
    computed: mapState(['token']),
    watch: {
        // @vuese
        // If token is new, setup a timeout
        // @arg newToken [String] hash, 
        // @arg oldToken [String] hash
        token(newToken, oldToken) {
            if (newToken !== oldToken) {
                this.setupTimeout();
            }
        }
    },
    methods: {
        // @vuese
        // Sets the timeout unless expired.
        // If expired redirects to the dashboard
        setupTimeout: function () {
            if (this.token) {
                const decoded = jwt.decode(this.token);
                if (decoded && decoded.exp) {
                    this.expiration = decoded.exp;
                    const currentTime = Math.floor(Date.now() / 1000);
                    const sessionLength = this.expiration - currentTime;
                    const warningTime = (sessionLength - 30) * 1000;
                    if (sessionLength < 1 && !this.$testing) {
                        window.location.href = `${process.env.VUE_APP_DASHBOARD_ROOT}/auth?redirect=forms`;
                    }
                    this.timeout = setTimeout(this.show, warningTime);
                }
            }
        },
        // @vuese
        // Updates the counter
        update: function () {
            const currentTime = Math.floor(Date.now() / 1000);
            this.count = this.expiration - currentTime;
            if (this.count <= 1) {
                this.logout();
            }
        },
        // @vuese
        // Shows the TimeoutWarning component
        show: function () {
            this.timeout = false;
            this.update();
            this.interval = setInterval(this.update, 1000);
            this.$refs['TimeoutWarning'].show()
        },
        // @vuese
        // Hides the TimeoutWarning component
        hide: function () {
            this.active = false;
            clearInterval(this.interval);
            this.interval = false;
            this.$refs['TimeoutWarning'].hide()
        },
        // @vuese
        // Extends the timeout
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
        // @vuese
        // Removes the token from local storage and redirects to the overview pages
        logout: function () {
            localStorage.removeItem('auth-token');
            window.location.href = process.env.VUE_APP_OVERVIEW_ROOT;
        }
    }
}