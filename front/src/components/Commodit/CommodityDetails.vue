<template>
  <div>
  <TopButtom></TopButtom>
  <div class="detailsProduct">
      <div class="details">
          <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item :to="{path:'/Commodit/CommodityCenter'}">商品中心</el-breadcrumb-item>
              <el-breadcrumb-item > {{detailsIntroductionDates.commodityName}}</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="detailsIntro">
        <div class="detailsWrap">
          <div class="detailsPlay">
            <img :src="detailsPicList[0].pictureAddress">
            <div class="detailsPicList">
              <img :src="selfPicture2">
              <ul @mouseleave="lastAdd" @mouseenter="emptyAdd">
                <!-- 由于接口文档没有给list数组ID，故这里的key值用的index来代替 -->
                <li v-for="(item,index) in detailsPicList" :key="index">
                  <img :src="item.pictureAddress" @mouseenter="addPicCla" @mouseleave="removePicCla">
                </li>
              </ul>
              <img :src="selfPicture3">
            </div>
          </div>
        </div>
        <div class="detailsMessage">
          <div>
            <!-- 商品名称 -->
            <div class="detailsMessageName">
               <p>
                {{detailsIntroductionDates.commodityName}}
              </p>
            </div>
            <!-- 商品详情 -->
            <div class="detailsIntroduction" >
              <div class="detailsNumber">
                <div class="detailsNumberTitle">编号：</div>
                <div class="detailsNumberVlaue">{{detailsIntroductionDates.commodityCode}}</div>
              </div>
              <div class="detailsPriceBefore">
                <div class="detailsPriceBeforeTitle">原价：</div>
                <div class="detailsPriceBeforeValue">￥{{detailsIntroductionDates.commodityOriginalPrice}}</div>
              </div>
              <div class="detailsPriceNow">
                <div class="detailsPriceNowTitle">零售价：</div>
                <div class="detailsPriceNowValue">￥{{detailsIntroductionDates.commodityRetailPrice}}</div>
              </div>
              <div class="detailsColor">
                <div class="detailsColorTitle">商品颜色：</div>
                <div class="detailsColorValue">{{detailsIntroductionDates.commodityColor}}</div>
              </div>
              <div class="detailsUnit">
                <div class="detailsUnitTitle">购买单位：</div>
                <div class="detailsUnitValue">{{detailsIntroductionDates.commityUnitName}}</div>
              </div>
              <div class="detailsPrompt">
                <div class="detailsPromptTitle">库存：</div>
                <div class="detailsPromptValue">{{detailsIntroductionDates.commodityIsLack}}</div>
              </div>
              <div class="detailsBuy">
                <div class="detailsBuyTitle">购买数量：</div>
                <div class="detailsBuyValue" >
                    <button  @click="changeMoney(-1)">-</button>
                    <input type="text" placeholder="0" v-model="detailsIntroductionDates.commodityTotalCount"  @keydown="handleInput">
                    <button @click="changeMoney(1)">+</button>
                </div>
              </div>
              <div class="detailsFinal">
                <div class="detailsFinalTitle">总计：</div>
                <div class="detailsFinalValue">
                  ￥{{Number(detailsIntroductionDates.commodityRetailPrice)*Number(detailsIntroductionDates.commodityTotalCount)}}
                </div>
              </div>
            </div>
          </div>
          <div class="detailsOperating" >
            <!-- 立即购买 -->
            <div class="tb-btn-buy">
              <el-button class="buyRightNow" id="button" @click="getbuyCommodityData()">
                立即购买
              </el-button>
            </div>
            <!-- 加购 -->
            <div class="tb-btn-add">
              <el-button class="add" @click="addCar()">加入购物车</el-button><!--addToCar() @click="addToCar" -->
            </div>
            <!-- 收藏 -->
            <div class="tb-btn-save">
               <el-button class="save" @click="getcollectCommodityData()" :plain="true" ><!--collect();noCollect() -->
                <div class="star">
                  <img :src="selfPicture"><!-- ref="collect"-->
                </div>
                <div class="shoucang">
                  <p>收藏</p>
                </div>
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="aaaa"></div>
      <div class="detailsCenter">
        <!-- 商品详情大图 -->
        <div class="detailsPicture">
          <template>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="商品详情" name="first">
                <div class="detailsPictureFour">
                  <div v-html="detailsIntroductionDates.commodityDesc">

                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="交易记录" name="second">
                  <template>
                    <div class="detailsTransaction">
                      <el-table :data="detailsTransactionDates" style="width: 100%">
                        <el-table-column prop="createdBy" label="客户ID"></el-table-column>
                        <el-table-column prop="customerName" label="客户姓名"></el-table-column>
                        <el-table-column prop="gmtCreate" label="购买时间"></el-table-column>
                        <el-table-column prop="commodityPrice" label="单价"></el-table-column>
                        <el-table-column prop="commodityNum" label="数量"></el-table-column>
                      </el-table>
                    </div>
                  </template>
              </el-tab-pane>
            </el-tabs>
          </template>
        </div>
        <!-- 同类商品推荐 -->
        <div class="detailsFeatured">
          <div class="detailsSimilar">
            <p>同类商品推荐</p>
          </div>
          <!-- 同类商品推荐详细信息 -->
          <div v-for="recommend in detailsSimilarDates" :key="recommend.id">
            <div class="detailsSimilarRecommend">
              <div class="detailsSimilarRecommendPic" >
                <img :src="recommend.pictureAddress" >
              </div>
              <div class="detailsSimilarRecommendTitle">
                <p>{{recommend.commodityName}}</p>
              </div>
              <div class="detailsSimilarRecommendPrice">
                <p>{{recommend.commodityRetailPrice}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
  <Foot></Foot>
  </div>
</template>
<style>
@import "./../../assets/css/details.css";
</style>
<script typet="text/javascript" src="http://libs.baidu.com/jquery/1.9.1/jquery.min.js"></script>
<script>
import TopButtom from "@/components/publicVue/TopButtom"; //公共头
import Foot from "@/components/publicVue/Foot"; //公共头
import Bus from "./../../common/bus.js";
import "../../assets/js/magnifier.js";
export default {
components: {
  TopButtom,
  Foot
},
data() {
  return {
    commodityDesc: '<p><span>测试测试</span></p><div>',
    msg:'',
    commodityId: "",
    shopNumber:"",
    commodityNum:"",
    tokenFront:"",
    commodityIsLack:"",
    categoryFirst:"",
    pictuList:'',
    collesctMessage:"",
    collectionList:[],
    collectFlag:"",
    list:[],
    picId: 0,//这里用来表示轮播图现在是第几个
    commodityTotalCount: 1,
    selfPicture: require("../../assets/img/nocollect.png"),
    selfPicture2:require("../../assets/img/left.png"),
    selfPicture3:require("../../assets/img/right.png"),
    activeName: "first",
    // isCollect: '',
    num1: 1,
    value1: null,
    totalMoney: 0,
    detailsPicList: [
      {
        commodityCode: "0",
        pictureAddress: "https://g-search1.alicdn.com/img/bao/uploaded/i4/i4/2914266524/TB2358.fr1YBuNjSszhXXcUsFXa_!!2914266524.jpg_580x580Q90.jpg_.webp"
      },
      {
        commodityCode: "1",
        pictureAddress: "https://gw.alicdn.com/bao/uploaded/i2/133702396/TB2hILNotfJ8KJjy0FeXXXKEXXa_!!133702396.jpg"

      },
      {
        commodityCode: "2",
        pictureAddress: "https://g-search1.alicdn.com/img/bao/uploaded/i4/i4/2914266524/TB2358.fr1YBuNjSszhXXcUsFXa_!!2914266524.jpg_580x580Q90.jpg_.webp"
      },
      {
        commodityCode: "3",
        pictureAddress: "https://gw.alicdn.com/bao/uploaded/i2/133702396/TB2hILNotfJ8KJjy0FeXXXKEXXa_!!133702396.jpg"
      },
      {
        commodityCode: "4",
        pictureAddress: "https://g-search1.alicdn.com/img/bao/uploaded/i4/i4/2914266524/TB2358.fr1YBuNjSszhXXcUsFXa_!!2914266524.jpg_580x580Q90.jpg_.webp"
      }
    ],
    //同分类商品
    detailsSimilarDates: [
    ],
    //商品详情
    detailsIntroductionDates:{
    },
    //商品图片
    detailsPictureFourDates: [
    ],
    //交易记录
    detailsTransactionDates: [
    ],
    //收藏
    detailsCollectCommodityDates:[{

    }],
    //加入购物车
    detailsAddCommodityDates:{},

    getDetailsIntroductionUrl:"http://"+this.$store.state.url+"/front/commodityCenter/getCommodityCenterDeatil",//商品详情
    getcategoryFirstUrl:"http://"+this.$store.state.url+"/front/commodityCenter/getCommodityCenterSimilar",//同类商品
    getdetailsTransactionUrl:"http://"+this.$store.state.url+"/front/commodityCenter/getCommodityCenterTrading",//交易记录
    getSavCollectUrl:"http://"+this.$store.state.url+"/front/commodityCenter/commodityCollection",//是否收藏
    getAddCommodityToCarUrl:"http://"+this.$store.state.url+"/front/commodityCenter/addShoppingCart",//加入购物车
  };
},
////放大镜
mounted() {
  $("#magnifier1").imgzoon({ magnifier: "#magnifier1" });
  this.tokenFront=sessionStorage.getItem('customertoken');
  this.getIntroductionData()
  this.getsimilarCommodityData()
  this.gettransactionRecordData()
},

methods: {
  // 商品详情 对接成功
  getIntroductionData(){
    this.$axios.defaults.headers.common['token']=sessionStorage.getItem('customertoken');
    var params = new URLSearchParams();
    params.append("commodityId",this.$route.query.commodityId)
    params.append("tokenFront",sessionStorage.getItem('customertoken'))
    this.$axios.get(this.getDetailsIntroductionUrl,{params}).then(res=>{
     if(0==res.data.code){//查询成功
        this.detailsIntroductionDates=res.data.data;
        this.detailsPicList=res.data.data.pictureList;
            this.isCollect = res.data.data.isCollect;
            if (this.isCollect == "0") {
              this.selfPicture=require("../../assets/img/collect.png")
              
            } else {
              this.selfPicture = require("../../assets/img/nocollect.png")

            }
      }else{
          this.$message({
          message: res.data.msg,
          type: 'error'
        });
      }
    }).catch(err=>{
      console.log(err)
    });
  },
  // 同类商品  对接成功
  getsimilarCommodityData(){
    var params = new URLSearchParams();
    params.append("categoryFirst",this.$route.query.categoryFirst)
    this.$axios.get(this.getcategoryFirstUrl,{params}).then(res=>{
      this.detailsSimilarDates=res.data.data
    }).catch(err=>{
      console.log(err)
    });
  },
  //交易记录 对接成功
  gettransactionRecordData(){
    this.$axios.defaults.headers.common['token']=sessionStorage.getItem('customertoken');
    this.$axios.get(this.getdetailsTransactionUrl,{
      params:{
        commodityId:this.$route.query.commodityId,
      }
    }).then(res=>{
      this.detailsTransactionDates=res.data.data
    }).catch(err=>{
      console.log(err)
    });
  },
  // list立即购买 路由传值成功
  getbuyCommodityData(){
    this.$router.push({
    path: "/Cart/SureCart",
      query: {
        commodityList:[
          {
            commodityId:this.$route.query.commodityId,
            commodityNum:this.detailsIntroductionDates.commodityTotalCount,
          }
        ]
      }
    });
  },
  //是否收藏
  getcollectCommodityData() {
    if (this.isCollect == "1") {//添加收藏
      this.$axios.defaults.headers.common['token']=sessionStorage.getItem('customertoken');
      this.$axios.post( this.getSavCollectUrl, {
        collectionList:[{
          commodityId:this.$route.query.commodityId,
          collectFlag:"1",
        }],
        tokenFront:sessionStorage.getItem('customertoken')
      }).then(res => {
          var datas = res.data;
          if (datas.code == 0) {
            this.isCollect = "0";
            this.selfPicture=require("../../assets/img/collect.png")
            this.$message({
              message:"添加收藏",
              type:"success"
            })
          }else if (datas.code != 2) {
            this.$message.error('添加收藏失败');
          }else {
            this.$router.push({path:"/"});
          }
        });
     } else {//取消收藏
      this.$axios.defaults.headers.common['token']=sessionStorage.getItem('customertoken');
      this.$axios.post( this.getSavCollectUrl, {
        collectionList:[{
          commodityId:this.$route.query.commodityId,
          collectFlag:"0",
        }],
        tokenFront:sessionStorage.getItem('customertoken')
      }).then(res => {
          var datas = res.data;
          if (datas.code == 0) {
            this.isCollect = "1";
            this.selfPicture = require("../../assets/img/nocollect.png")
            this.$message({
              message:"取消收藏",
              type:"waring"
            })
          } else if (datas.code != 2) {
            this.$message.error('取消收藏失败');
          }else {
            this.$router.push({path:"/"});
          }
      });
    }
  },
  //加入购物车  post请求，但是不用返回数据，但在请求的时候需要请求tokenFront
  addCar() {
    var params = new URLSearchParams();
    params.append("commodityId", this.$route.query.commodityId);
    params.append("shopNumber", this.detailsIntroductionDates.commodityTotalCount);
    params.append("tokenFront",sessionStorage.getItem('customertoken'))
    this.$axios.post(this.getAddCommodityToCarUrl, params).then(res => {
      if (0 == res.data.code) {
        //查询成功
        this.detailsAddCommodityDates= res.data;
        this.$message({
          message: "添加购物车成功",
          type: "success"
        });
      } else {
        this.$message({
          message: "添加购物车失败",
          type: "error"
        });
      }
      //接口
    });
  },
  //轮播图加样式
  addPicCla(event) {
    this.picId = $(event.target).parent().index();
    $(event.target).addClass("detailsPicListT");
    $(".detailsPlay>img").attr("src", this.detailsPicList[this.picId].pictureAddress);
  },
  //轮播图去样式
  removePicCla(event) {
    $(event.target).removeClass("detailsPicListT");
  },
  //轮播图加样式
  lastAdd() {
    $(".detailsPicList>ul>li").eq(this.picId).children().addClass("detailsPicListT");
  },
  //轮播图去样式
  emptyAdd() {
    $(".detailsPicList li>img").removeClass("detailsPicListT");
  },
  handleClick(tab, event) {
    console.log(tab, event);
  },
  handleChange(value) {
    console.log(value);
  },
  //数字输入框
  handleInput(e) {
    let a = e.key.replace(/[^\d]/g, "");
    if (!a) {
      e.preventDefault();
      e.target.value = "";
    }
  },
  //计算金额
  changeMoney(way) {
    if (way > 0) {
     this.detailsIntroductionDates.commodityTotalCount++
    } else {
     this.detailsIntroductionDates.commodityTotalCount--
     if (this.detailsIntroductionDates.commodityTotalCount < 1) {
      //  限制数量最少为1
       this.detailsIntroductionDates.commodityTotalCount = 1;
     }
    }
  },
  //加入购物车
  addToCar(introduction, way) {
    this.commodityTotalCount++;
    Bus.$emit("val", this.commodityTotalCount);
  },
  buyRight(){
    console.log(this.detailsIntroductionDates)
  },
}
};
$(function() {
$("#magnifier1").imgzoon({ magnifier: "#magnifier1" });
});
</script>
