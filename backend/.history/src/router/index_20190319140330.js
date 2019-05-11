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
                    path: '/department',
                    name:'部门管理',  
                    meta: {
                        keepAlive: true // 需要被缓存
                      },                  
                    component: resolve => require(['../components/page/systemManage/department.vue'], resolve)    // 部门管理
                },
                {
                    path: '/post',
                    name:'岗位管理', 
                    meta: {
                        keepAlive: true // 需要被缓存
                      },
                    component: resolve => require(['../components/page/systemManage/post.vue'], resolve)    // 岗位管理
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
                    path: '/role',
                    name:'角色管理', 
                    meta: {
                        keepAlive: true // 需要被缓存
                      },
                    component: resolve => require(['../components/page/systemManage/role.vue'], resolve)    // 角色管理
                },
                {
                    path: '/timejob',
                    name:'定时任务', 
                    meta: {
                        keepAlive: true // 需要被缓存
                      },
                    component: resolve => require(['../components/page/systemManage/timejob.vue'], resolve)    // 定时任务
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
