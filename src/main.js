import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/index' 
import './util/rem.js'
import './plugins/element.js'
import VALIDATE from './util/validate';
Vue.config.productionTip = false
Vue.prototype.VALIDATE = VALIDATE;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

