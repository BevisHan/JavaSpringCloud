import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name:'登陆',
            redirect: '/login',
            meta: {
                keepAlive: true // 需要被缓存
              }
        },
        {
            path: '/home',
            name:'首页',
            meta: {
                keepAlive: true // 需要被缓存
              },
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/home',
                    name:'首页',
                    meta: {
                        keepAlive: true // 需要被缓存
                      },
                    component: resolve => require(['../components/page/systemManage/home.vue'], resolve)
                },
                {
                    path: '/user',
                    name:'用户管理',
                    meta: {
                        keepAlive: true // 需要被缓存
                      },
                    component: resolve => require(['../components/page/systemManage/user.vue'], resolve)    // 用户管理
                },
                {
                    path: '/menu',
                    name:'菜单管理', 
                    meta: {
                        keepAlive: true // 需要被缓存
                      },
                    component: resolve => require(['../components/page/systemManage/menu.vue'], resolve)    // 菜单管理
                }
            ]
        },
        {
            path: '/login',
            name:'登陆',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
