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
                },
                {
                    path: '/classification',
                    name:'分类管理', 
                    meta: {
                        keepAlive: true // 需要被缓存
                      },
                    component: resolve => require(['../components/page/systemManage/classification.vue'], resolve)    // 分类管理
                },
                {
                    path: '/goods',
                    name:'商品管理', 
                    meta: {
                        keepAlive: true // 需要被缓存
                      },
                    component: resolve => require(['../components/page/systemManage/goods.vue'], resolve)    // 商品管理
                },
                {
                    path: '/accountNumber',
                    name:'账号管理', 
                    meta: {
                        keepAlive: true // 需要被缓存
                      },
                    component: resolve => require(['../components/page/systemManage/accountNumber.vue'], resolve)    // 账号管理
                },
                {
                    path: '/order',
                    name:'订单管理', 
                    meta: {
                        keepAlive: true // 需要被缓存
                      },
                    component: resolve => require(['../components/page/systemManage/order.vue'], resolve)    // 订单管理
                },
                {
                    path: '/unit',
                    name:'单位管理', 
                    meta: {
                        keepAlive: true // 需要被缓存
                      },
                    component: resolve => require(['../components/page/systemManage/unit.vue'], resolve)    // 单位管理
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
