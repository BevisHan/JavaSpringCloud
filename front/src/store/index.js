import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state={//要设置的全局访问的state对象
    showFooter: true,
    changableNum:0,
    //要设置的初始属性值
    url:'39.105.73.110:8082',     //接口ip    
    // url:'172.22.2.28:8082',     //接口ip
    //url:'172.22.2.185:8082',     //接口ip
    // url:'172.22.4.120:8082',
    // url:'172.22.2.195:8088',
  };
  const store = new Vuex.Store({
        state
 });
 export default store;
