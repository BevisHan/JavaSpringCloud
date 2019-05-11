<template>
   <div class="order">
       <TopButtom> </TopButtom>
       <div class="inorder">
         <div class="xiaoorder">
          <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{breadNav}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="con">  
            <div class="menu" >
             <div class="born">
                <div class="weight"><i class="el-icon-date"></i>订单中心</div>
                    <router-link tag="li" :to="{name:'OrderCenter'}" @click="changeColor($event)">
                        <div @click="changeColor($event)" class="orderTitleContent">所有订单</div>
                    </router-link>
                <div class="collect1 weight"><i class="el-icon-star-off"></i>我的收藏</div>
                    <router-link tag="li" :to="{name:'Collect'}">
                        <div @click="changeColor($event)" class="orderTitleContent">收藏列表</div>
                    </router-link>
                <div class="collect1 weight"><i class="el-icon-setting"></i>账户设置</div>
                    <router-link tag="li" :to="{name:'ShoppingAddress'}">
                        <div @click="changeColor($event)" class="orderTitleContent">收货地址</div>
                    </router-link>
                    <router-link tag="li" :to="{name:'rePass'}">
                        <div @click="changeColor($event)" class="orderTitleContent">修改密码</div>
                    </router-link>
              </div>
            </div>
            <div class="rouview" >
               <router-view></router-view>
            </div>
              </div>
          </div>      
       </div>
       <Foot></Foot>
   </div>   
</template>

<script>
import TopButtom from "@/components/publicVue/TopButtom"; //公共头
import Foot from "@/components/publicVue/Foot";
export default {
  name: "order",
  components: {
    TopButtom,
    Foot
  },
  data() {
    return {
    };
  },
  mounted: function() {
    document.getElementsByClassName("orderTitleContent")[0].style.color = "#006cd9";
    document.getElementsByClassName("orderTitleContent")[0].style.fontWeight = "bold";
    if (window.location.hash == "#/order/orderDetails") {
      $(".inorder").css("height", "700px");
    }
  },
  methods: {
    //改变导航条颜色
    changeColor(e) {
      for (var i = 0; i < document.getElementsByClassName("orderTitleContent").length;i++ ) {
        document.getElementsByClassName("orderTitleContent")[i].style.color = "";
        document.getElementsByClassName("orderTitleContent")[ i ].style.fontWeight ="";
      }
      e.srcElement.style.color = "#006cd9";
      e.srcElement.style.fontWeight = "bold";
    }
  },
  computed: {
    breadNav() {
      return this.$route.meta.title;
    }
  }
};
</script>

<style>
.order .inorder {
  width: 100%;
  background-color: #f2f2f2;
  overflow: hidden;
}
.order .xiaoorder {
  width: 1200px;
  margin: 0 auto;
}
.order .breadcrumb {
  width: 1200px;
  height: 50px;
  line-height: 50px;
  margin-top: 15px;
}
.order .breadcrumb li {
  float: left;
}
.order .breadcrumb .fir {
  color: #9c9a9a;
}
.order .breadcrumb .two {
  color: rgb(32, 32, 32);
}
.order .con {
  width: 1200px;
}
.order .con .menu {
  width: 188px;
  height: 360px;
  background: white;
  padding: 40px 0;
  list-style: none;
  text-align: right;
  font-size: 16px;
  float: left;
  margin-bottom: 40px;
  overflow: hidden;
}
.order .con .menu .born {
  width: 128px;
  margin-right: 60px;
}
.order .con .menu i {
  font-size: 20px;
  margin-right: 12px;
}
.order .con .menu li {
  height: 44px;
  line-height: 44px;
}
.order .con .menu .collect1 {
  margin-top: 35px;
}
.order .con .menu .weight {
  font-weight: bold;
  margin-bottom: 15px;
  cursor: default;
}
.order .rouview {
  width: 997px;
  float: right;
  margin-left: 15px;
  margin-bottom: 60px;
}
.order .orderTitleContent {
  cursor: pointer;
}
</style>
