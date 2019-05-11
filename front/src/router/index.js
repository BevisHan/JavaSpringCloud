import Vue from 'vue'
import Router from 'vue-router'
import  Login from '@/components/login'//登陆
import  ShouYe from '@/components/shouye'//首页
import  CommodityCenter from '@/components/Commodit/CommodityCenter'//商品中心
import  CommodityDetails from '@/components/Commodit/CommodityDetails'//商品详情
import  ShoppingCart from '@/components/Cart/ShoppingCart'//购物车
import  register from '@/components/register'//注册
import  TopButtom from '@/components/publicVue/TopButtom'//公共头
import  Foot from '@/components/publicVue/Foot'//公共脚
import  Collect from '@/components/Order/Collect'//我的收藏
import  Order from '@/components/Order/Order'//订单导航组件
import  OrderCenter from '@/components/Order/OrderCenter'//订单中心
import  OrderDetails from '@/components/Order/OrderDetails'//订单详情
import  rePass from '@/components/Order/rePass'//修改密码
import  ShoppingAddress from '@/components/Order/ShoppingAddress'//收货地址
import  Success from '@/components/Cart/Success'//加入购物车成功
import  SureCart from '@/components/Cart/SureCart'//确定加入购物车


Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },//登陆
    {
      path:'/register',
      name:'register',
      component:register//注册
    },
    {
      path:'/shouye',
      name:'shouye',
      component:ShouYe
    },//首页

    {
      path:'/Commodit/CommodityCenter',
      name:'CommodityCenter',
      component:CommodityCenter
    },//商品中心
    {
      path:'/Commodit/CommodityDetails',
      name:'CommodityDetails',
      component:CommodityDetails
    },//商品详情
    {
      path:'/publicVue/TopButtom',
      name:'TopButtom',
      component:TopButtom//公共头
    },
    {
      path:'/publicVue/Foot',
      name:'Foot',
      component:Foot//公共脚
    },
    {
      path:'/Cart/ShoppingCart',
      name:'ShoppingCart',
      component:ShoppingCart//购物车
    },
    {
      path:'/Cart/Success',
      name:'Success',
      component:Success //加入购物车成功
    },
    {
      path:'/Cart/SureCart',
      name:'SureCart',
      component:SureCart //确认加入购物车
    },
    {
        path:'/Order/Order',//订单中心
        name:'Order',
        component:Order,
        meta: {
          requireAuth: true,
          title: '订单中心'
        },
        children:[
          {
            path:'/Order/OrderCenter',//订单中心
            name:'OrderCenter',
            component:OrderCenter,
            meta: {
              requireAuth: true,
              title: '订单中心'
            }
          },
          {
            path:'/order/collect',
            name:'Collect',
            component:Collect, //我的收藏
            meta: {
              requireAuth: true,
              title: '收藏列表'
            }
          },
          {
            path:'/Order/OrderCenter/:orderId',//订单详情
            name:'OrderDetails',
            component:OrderDetails,
            meta: {
              requireAuth: true,
              title: '订单中心 > 订单详情'
            }
          },
          {
            path:'/Order/rePass',//修改密码
            name:'rePass',
            component:rePass,
            meta: {
              requireAuth: true,
              title: '修改密码'
            }
          },
          {
            path:'/Order/ShoppingAddress',
            name:'ShoppingAddress',
            component:ShoppingAddress,//收货地址
            meta: {
              requireAuth: true,
              title: '收货地址'
            }
          },
        ]
      },
      
]
  
})
