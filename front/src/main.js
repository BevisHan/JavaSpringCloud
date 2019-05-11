// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import $ from 'jquery'
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import axios from "axios";
import App from './App'

Vue.use(ElementUI);
// axios.defaults.baseURL='http://39.106.45.82:9090/mall';
// axios.defaults.baseURL='http://172.22.2.195:8088';
axios.defaults.baseURL='http://39.105.73.110:8082';
Vue.prototype.$axios = axios;
Vue.prototype.bus = new Vue();
import store from './store'
// require('./assets/css/index.css')
// require('./assets/css/public.css')
// require('./assets/css/details.css')
// require('./assets/js/details')
// require('./assets/js/magnifier')
// require('./components/cart/shoppingCart.css')
// require('./components/cart/sureCart.css')
// require('./components/cart/success.css')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, //使用store
  components: {
    App
  },
  template: '<App/>'
})

