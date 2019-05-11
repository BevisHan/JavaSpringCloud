
<template>
  <div class="head">
    <div class="headTop">
      <p>
        您好！
        <span style="color:rgb(0,104,218)">测试</span> 欢迎登录合约客户频道
      </p>
      <p style="margin:0 20px 0 20px">|</p>
      <p>我的订单</p>
      <p style="margin:0 20px 0 20px">|</p>
      <p @click="toLogin">退出</p>
    </div>

    <div class="webHead">
      <div class="webHead-top">
        <p class="webName">
          <span style="color:rgb(0,104,218)">NEUSIRI</span>
          <span style="color:rgb(104,104,104)">|</span>
          <span style="color:rgb(102,102,102)">商城</span>
        </p>
        <div class="shopcartBtn"  @click="toCart">
          <img :src="PublicHeadShoppingcart">
          <span >购物车</span>
          <p>{{Cartnumber}}</p>
        </div>
        <div class="search">
          <input type="text" placeholder="手机话费" class="searchGoods">
          <div class="searchBtn" @click="toCommodit">搜索</div>
        </div>
        <div class="clearF"></div>
      </div>
      <div class="webTitle">
        <div class="gategory" id="allGate" @mouseenter="ShowList" @mouseleave="HideList">
          <span>全部商品分类</span>
          <img id="gategoryIco" :src="PublicHeadDown">
          <div class="gategoryMenu" id="gategoryMenu" >
            <div class="gmlist" v-for="item in gategoryMenuList" :key="item.id" @mouseenter="ShowGmlistSon(item)">
              <div class="gmlistName-1">{{item.categoryName}}</div>
              <div class="gmlistName-2">{{item.categoryRemark}}</div>
              <img :src="PublicHeadRight">
            </div>
            <div class="gmlist-son" id="gmlist-son">
              <div v-for="item in gategoryMenuListSon" :key="item.id">{{item.categoryName}}</div>
            </div>
          </div>
        </div>
        <div class="tab">
          <div @click="toShouYe">首页</div>
          <div @click="toCommodit">商品中心</div>
          <div @click="toOrder">订单中心</div>
        </div>
      </div>
    </div>
    <div class="rightMenu">
      <div class="rm-shoppingcart" @click="toCart">
        <div class="rms-pic">
          <img :src="PublicHeadRmShoppingcart">
        </div>
        <p>购</p>
        <p>物</p>
        <p>车</p>
      </div>
      <div class="returnTop" id="returnTop" @click="toTop">
        <img :src="PublicHeadReturntop">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      PublicHeadShoppingcart:require("../../assets/img/PublicHead-shoppingcart.png"),
      PublicHeadDown:require("../../assets/img/PublicHead-down.png"),
      PublicHeadRight:require("../../assets/img/PublicHead-right.png"),
      PublicHeadRmShoppingcart:require("../../assets/img/PublicHead-rm-shoppingcart.png"),
      PublicHeadReturntop:require("../../assets/img/PublicHead-returntop.png"),
      Cartnumber:'',
      shopcartNum:'',
      customerId:'',
      categroyParentId:0,
      categoryId:'',
      gategoryMenuList:[],
      gategoryMenuListSon: [ ],
      getClassifyListUrl: "http://"+this.$store.state.url + "/front/commodity/getClassifyList" ,//商品分类
      getShopCartUrl:"http://"+this.$store.state.url+"/front/shoppingCart/getShoppingCartList",//查询购物车
    };
  },

mounted () {
this.getdate();
},
  methods: {
    //下拉菜单隐藏出现
    HideList() {
      $("#gategoryIco").css({"transform-origin":"10px 10px","transform":"rotate(-90deg)","transition":"all 1s"})
      $("#gategoryMenu").slideUp(400);
      $(".gmlist").css({"border":"none","background":"none"});
      $(".gmlist-son").fadeOut(400);
    },
    ShowList() {
      $("#gategoryIco").css({"transform-origin":"10px 10px","transform":"rotate(0deg)","transition":"all 1s"});
      if(!$("#gategoryMenu").is(":animated")){
          $("#gategoryMenu").slideDown(400);
      }
     this.$axios.get(this.getClassifyListUrl+ '?categoryParentId=0').then(res => {
       console.log(res.data)
      this.gategoryMenuList=res.data.data;
      this.categoryLevel=res.data.data.categoryLevel;
      });//下拉菜单
      },
    ShowGmlistSon(e) {
      $(".gmlist").css({"border":"none","background":"none"});
      $(e.srcElement).css({"border":"2px solid rgb(0,104,218)","border-right":"2px solid white","background":"rgba(255,255,255,1)"});
      $("#gmlist-son").fadeIn(200);
        this.categoryId=String(e.categoryId);
        this.$axios.get(this.getClassifyListUrl+'?categoryParentId='+this.categoryId).then(res=>{
        this.gategoryMenuListSon=res.data.data;

         })
    },
    toTop() {
      // if (document.documentElement.scrollTop > 0) {
      //   document.documentElement.scrollTop = 0;
      // }
      $("html").animate({
        "scrollTop":0
      },600);
    }, //回到顶部
    toShouYe() {
      this.$router.push('/shouye');
    }, //跳转首页
    toCommodit() {
      this.$router.push('/Commodit/CommodityCenter');
    }, //跳转商品中心
    toOrder() {
      this.$router.push("/Order/OrderCenter");
    }, //跳转订单中心
      toCart() {
      this.$router.push("/Cart/ShoppingCart");
    }, //跳转购物车
      toLogin() {
      this.$router.push("/");
    }, //跳转登陆页
    getdate(){
     this.$axios.get(this.getClassifyListUrl+ '?categoryParentId=0').then(async res => {
      this.gategoryMenuList=res.data.data;
      this.categoryLevel=res.data.data.categoryLevel
      await this.getShopCartNum();
      });//下拉菜单
    },
    getShopCartNum(){
      //购物车数量
      this.$axios.get(this.getShopCartUrl,{
        params:{
          "tokenFront":sessionStorage.getItem('customertoken')
        },
        headers:{
          "token":sessionStorage.getItem('customertoken')
        }
      }).then(res=>{
        if(res.data.data == null||undefined){
          this.Cartnumber = 0;
        }
        else{
          this.Cartnumber = res.data.data.length;
        }
      })
    }
  }
};
</script>
<style>
@import "../../assets/css/public.css";
@import "../../assets/css/index.css";
     #app{
            margin: 0;
            padding: 0;
        }

</style>



