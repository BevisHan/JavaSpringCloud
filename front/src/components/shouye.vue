<template>
  <div class="shouye">
    <TopButtom></TopButtom>
    <!-- 广告大图 -->
    <div class="bigPic">
      <img
        :src="bigPic"
      >
    </div>
    <div class="middle">
      <div class="smallPic">
        <div v-for="item in smallPic" :key="item.id">
          <img :src="item">
        </div>
      </div>
      <!-- 品质生活 -->
      <div class="pinzhishenghuo">
        <h4>品质生活</h4>
        <p>换一批>></p>
        <div class="clearF"></div>
        <div class="pzsh-left">
          <img :src="pzshBig">
        </div>
        <div class="pzsh-right">
          <div class="pzshLogo" v-for="item in pinzhishenghuoRightLogo" :key="item.id">
            <img :src="item">
          </div>
        </div>
        <div class="clearF"></div>
      </div>
       <!-- 热门推荐 -->
      <div class="Rm">
        <div class="rm-title">
          <span>热门推荐</span>
          <div class="rm-title-btn" @click="nextpage">&gt;</div>
          <div class="rm-title-btn" @click="backpage">&lt;</div>
        </div>
        <div class="Run">
          <div
            class="rm-item"
            v-for="item in rementuijianList"
            :key="item.id"
            @click="toCommodityDetails(item)"
          >
            <div class="rm-item-pic">
              <img :src="item.pictureAddress">
            </div>
            <p>{{item.commodityName}}</p>
            <h4>￥{{item.commodityRetailPrice}}.00</h4>
          </div>
        </div>
      </div>
      <div class="chongdianbao">
        <img :src="guanggao1">
      </div>
      <!-- 买过的商品 -->
      <div class="maiguode">
        <div class="rmtj-title">我买过的商品</div>
        <div
          class="mgd-item"
          v-for="item in maiguodeItem"
          :key="item.id"
          @click="toCommodityDetails(item)"
        >
          <div class="mgd-item-top">
            <div class="mgd-item-pic">
              <img :src="item.pictureAddress">
            </div>
            <p>{{item.commodityName}}</p>
            <h4>￥{{item.commodityRetailPrice}}.00</h4>
          </div>
          <div class="mgd-button">再次购买</div>
        </div>
      </div>
      <div class="chongdianbao" style="height: 175px;">
        <img style="width:100%;height:100%" :src="guanggao2">
      </div>
      <!-- 猜你喜欢 -->
      <div class="cainixihuan">
        <div class="cnxh-title">
          <span>猜你喜欢</span>
          <div class="cnxh-title-btn">&gt;</div>
          <div class="cnxh-title-btn" >&lt;</div>
        </div>
        <div class="Run">
          <div
            class="cnxh-item"
            v-for="item in cainixihuanItem"
            :key="item.id"
            @click="toCommodityDetails(item)"
          >
            <div class="cnxh-item-pic">
              <img :src="item.pictureAddress">
            </div>
            <p>{{item.commodityName}}</p>
            <h4>{{item.commodityRetailPice}}</h4>
          </div>
        </div>
      </div>
      <div class="chongdianbao">
        <img :src="guanggao3">
      </div>
    </div>
    <Foot></Foot>
  </div>
</template>
<script>
import TopButtom from "@/components/publicVue/TopButtom"; //公共头
import Foot from "@/components/publicVue/Foot"; //公共头
export default {
  components: {
    TopButtom,
    Foot
  },
  name: "HelloWorld",
  data() {
    return {
      maiguodeItem: [],
      tokenFront: "",
      totalRecords: 10,
      PageNum: 1,
      PageNum1: 1,
      PageSize: 5,
      customerId: 1,
      bigPic:require("../assets/img/ShouYeTitlePicture.webp.jpg"),
      pzshBig:require("../assets/img/pzsh-big.png"),
      smallPic: [
        "https://img10.360buyimg.com/da/s680x400_jfs/t1/18278/27/2266/155345/5c1b0178Ea2df4412/8e9b038639395c30.jpg!q90!cc_340x200",
        "https://img12.360buyimg.com/da/s680x400_jfs/t1/26093/32/2223/140792/5c1b01abEf03c292a/11b5df5e4aa55cd4.jpg!q90!cc_340x200",
        "https://img13.360buyimg.com/da/s680x400_jfs/t1/10397/30/5770/173731/5c1b14a1Ecc3d2b15/9b54f1933951cacb.jpg!q90!cc_340x200",
        "https://img11.360buyimg.com/da/s680x400_jfs/t1/11245/18/3098/189711/5c1b0480Ea6355474/e55ba3866a87ffef.jpg!q90!cc_340x200"
      ],
      pinzhishenghuoLeftPic: "img/pzsh-big.png",
      pinzhishenghuoRightLogo: [
        "http://www.logoids.com/upload/image/201609/2016091217092276379.jpg",
        "http://www.logoids.com/upload/image/201609/2016091217512437777.jpg",
        "http://www.logoids.com/upload/image/201609/2016091310282311815.jpg",
        "http://www.logoids.com/upload/image/201609/2016091312364714498.jpg",
        "http://www.logoids.com/upload/image/201609/2016091317383065832.jpg",
        "http://www.logoids.com/upload/image/201609/2016091413121923791.jpg",
        "http://www.logoids.com/upload/image/201609/2016091912355418776.jpg",
        "http://www.logoids.com/upload/image/201609/2016091619083770627.jpg",
        "http://www.logoids.com/upload/image/201801/15158283677962278.jpg",
        "http://www.logoids.com/upload/image/201801/15151421217019377.jpg",
        "http://www.logoids.com/upload/image/201801/15157245304050870.jpg",
        "http://www.logoids.com/upload/image/201610/2016102517131920137.jpg",
        "http://www.logoids.com/upload/image/201801/15154841674866880.jpg",
        "http://www.logoids.com/upload/image/201801/15151432285720792.jpg",
        "http://www.logoids.com/upload/image/201801/15150561539127516.jpg",
        "http://www.logoids.com/upload/image/201608/2016082114551982705.jpg",
        "http://www.logoids.com/upload/image/201608/20160819233836254.jpg",
        "http://www.logoids.com/upload/image/201608/2016081912152015284.jpg"
      ],
      guanggao1:require("../assets/img/ShouYeGuangGao1.png"),
      guanggao2:require("../assets/img/ShouYeGuangGao2.png"),
      cainixihuanItem: [
        {
          pictureAddress:require("../assets/img/ShouYepictureAddress1.webp.jpg"),
          commodityName:
            'Nike Air Force 1 x NBA x Supreme三方联名板鞋 - AQ8017 100 "N',
          commodityRetailPice: "￥3889.00"
        },
        {
       pictureAddress:require("../assets/img/ShouYepictureAddress2.webp.jpg"),
          commodityName:
            "Dell/戴尔 灵越15-5565 R2225 R1945A 2945A 四核独显 固态笔记本",
          commodityRetailPice: "￥3699.00"
        },
        {
         pictureAddress:require("../assets/img/ShouYepictureAddress3.webp.jpg"),
          commodityName:
            "科沃斯（Ecovacs）扫地机器人扫拖一体机智能家用吸尘器激光导航规划 全自动洗擦拖地机地宝DN33",
          commodityRetailPice: "￥2399.00"
        },
        {
          pictureAddress:require("../assets/img/ShouYepictureAddress4.webp.jpg"),
          commodityName:
            " 金士顿(Kingston) HyperX 黑鹰S 杜比7.1 游戏电竞耳机头戴式 电脑耳机 吃鸡神器 Revolver S 绝地求生耳麦",
          commodityRetailPice: "￥999.00"
        },
        {
         pictureAddress:require("../assets/img/ShouYepictureAddress5.webp.jpg"),
          commodityName:
            "松下（Panasonic）国AA级减蓝光护眼台灯工作阅读旋钮开关调光调色儿童学生学习台灯HHLT0631致言系列",
          commodityRetailPice: "￥499.00"
        }
      ],
      rementuijianList: [ ],
      guanggao3:require("../assets/img/ShouYeGuangGao3.png"),
      getRecommondCommodityListUrl: "http://" +this.$store.state.url +"/front/commodity/getRecommondCommodityList", //热门推荐接口地址
      getBuyCommodityListUrl:"http://" +this.$store.state.url +"/front/commodity/getBuyCommodityList" //我买过的接口地址
    };
  },
  mounted() {
    this.tokenFront = sessionStorage.getItem("customertoken");
    this.getLikeDate();
    this.getdate();
  },
  methods: {
    //下一页
    nextpage() {
      $(".rm-item").fadeOut(0);
      $(".rm-item").fadeIn(300);
      var a = this.PageNum + 1;
      this.PageNum = a;
      if (parseInt(this.totalRecords / 5) > a - 1) {
        var params = {
          commodityIsRecommend: 1,
          pageNum: a,
          pageSize: 5,
          tokenFront: this.tokenFront
        };
        this.$axios.defaults.headers.common["token"] = this.tokenFront;
        this.$axios
          .get(this.getRecommondCommodityListUrl, { params })
          .then(res => {
            this.rementuijianList = res.data.data.list;
          }); 
      } else {
        this.PageNum = 1;
        a = this.PageNum;
        var params = {
          commodityIsRecommend: 1,
          pageNum: a,
          pageSize: 5,
          tokenFront: this.tokenFront
        };
        this.$axios.defaults.headers.common["token"] = this.tokenFront;
        this.$axios
          .get(this.getRecommondCommodityListUrl, { params })
          .then(res => {
            this.rementuijianList = res.data.data.list;
          });
      } },
   //上一页
   backpage() {
      $(".rm-item").fadeOut(0);
      $(".rm-item").fadeIn(300);
      var b = this.PageNum - 1;
      this.PageNum = b;
      if (b >= 1) {
        var params = {
          tokenFront: this.tokenFront,
          commodityIsRecommend: 1,
          pageNum: b,
          pageSize: 5
        };
        this.$axios.defaults.headers.common["token"] = this.tokenFront;
        this.$axios
          .get(this.getRecommondCommodityListUrl, { params })
          .then(res => {
            this.rementuijianList = res.data.data.list;
          });
      } else {
        this.PageNum = parseInt(this.totalRecords / 5);
        b = this.PageNum;
        var params = {
          tokenFront: this.tokenFront,
          commodityIsRecommend: 1,
          pageNum: b,
          pageSize: 5
        };
        this.$axios.defaults.headers.common["token"] = this.tokenFront;
        this.$axios
          .get(this.getRecommondCommodityListUrl, { params })
          .then(res => {
            this.rementuijianList = res.data.data.list;
          });
      }
    },
   //跳转商品详情
   toCommodityDetails(item) {
      this.$router.push({path:'/Commodit/CommodityDetails',query:{'commodityId':item.commodityId,'categoryFirst':item.categoryFirst}});
      // this.bus.$emit("commodityId",item.commodityId);
      // console.log(item.categoryFirst);
      if (document.documentElement.scrollTop > 0) {
        document.documentElement.scrollTop = 0;
      }},
  //跳转商品中心
   toCommodit() {
      this.$router.push("/Commodit/CommodityCenter");
      if (document.documentElement.scrollTop > 0) {
        document.documentElement.scrollTop = 0;
      }
    }, 
  //购买过的商品
   getdate() {
      this.$axios.defaults.headers.common["token"] = this.tokenFront;
      this.$axios
        .get(this.getBuyCommodityListUrl +"?tokenFront=" + this.tokenFront)
        .then(res => {
          this.maiguodeItem = res.data.data;
        }); //我买过的
    },


  //获取热门推荐商品
   getLikeDate(){
      var params = {
        tokenFront: this.tokenFront,
        commodityIsRecommend: 1,
        pageNum: 1,
        pageSize: 5
      };
      this.$axios.defaults.headers.common["token"] = this.tokenFront;
      this.$axios
        .get(this.getRecommondCommodityListUrl, { params })
        .then(res => {
          console.log(res);
          this.rementuijianList = res.data.data.list;
          this.totalRecords = res.data.data.totalRecords;
        }); //热门推荐

    }
  }
};
</script>
<style>
@import "../assets/css/public.css";
@import "../assets/css/index.css";

.shouye .kong {
  width: 1200px;
  margin: auto;
  height: 1000px;
  background: pink;
}
</style>