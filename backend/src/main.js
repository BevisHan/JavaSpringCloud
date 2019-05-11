//程序入口文件，加载各种公共组件
import Vue from 'vue';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import qs from 'qs';
//import 'element-ui/lib/theme-default/index.css';    // 默认主题 element1.14
import 'element-ui/lib/theme-chalk/index.css'
import App from './App';
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import store from './store/store';
// import monent from '../static/js/monent';
import moment from 'moment';
import "babel-polyfill";
import 'url-search-params-polyfill';//解决axios使用的URLSearchParms，在ie下未定义的错误
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.$moment = moment;//时间格式化
import VueQuillEditor from 'vue-quill-editor';
//一定要引入这三个css，不然文本编辑器会出现不规则黑白几何图形
//这三个css可以在main.js中引入，也可以在具体使用的.vue文件中引入
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
Vue.use(VueQuillEditor);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

//添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // console.log(config);
    if(sessionStorage.getItem('access_token')){
      // console.log(config.url.indexOf("/auth/code/image"));
      // if (-1 == config.url.indexOf("/auth/code/image") && -1 == config.url.indexOf("/uaa/auth/form")){
      //   if('post' == config.method){
      //     config.data = {
      //       ...config.data,
      //       access_token : sessionStorage.getItem('access_token')
      //     };
  
      //   } else if ('get' == config.method) {
      //     config.params = {
      //       access_token : sessionStorage.getItem('access_token'),
      //       ...config.params
      //     }
      //   }
      // }
      
        config.data = config.data + '&access_token=' + sessionStorage.getItem('access_token');
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
//添加响应拦截器
axios.interceptors.response.use(function (response) {
     // token 已过期，重定向到登录页面
     if (2003 == response.data.code){
        localStorage.clear();
        sessionStorage.clear();
        router.replace({
            path: '/login',
            query: {redirect: router.currentRoute.fullPath}
          })
    }
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });