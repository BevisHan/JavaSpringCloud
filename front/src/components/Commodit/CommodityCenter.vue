<template>
  <div class="commodityCenter">
    <top-buttom></top-buttom>
    <div class="container">
      <div class="bar">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>办公文件</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="barBacground">
        <div class="left stationery">文具/耗材</div>
        <div class="left goodsSelect">商品筛选</div>
        <div class="left all">共19947个商品</div>
      </div>
      <!-- 商品分类区域 -->
      <div class="bigBox" id="goodsBig">
        <div class="goodssType">商品大类:</div>
        <div class="test1" id="goodsSmall">
          <div class="goodsCateType"><span class="gctP1 active1" @click="act($event)">全部</span></div>
          <div class="goodsCateType" v-for="item in cateGory" :key="item.id"><span class="gctP1" @click="act($event,item.categoryId)">{{item.categoryName}}</span></div>
        </div>
        <div class="morebox" @click="more">
          <div class="more">更多</div>
          <div class="upp"><i class="el-icon-arrow-up arrow" id="turn" ></i></div>
        </div>
      </div>
      <div class="bigBox" id="Second" style="height:80px">
        <div class="goodssType">二级分类:</div>
        <div class="test1" style="height:80px" id="goodsSecond">
          <div class="goodsCateType"><span class="gctP2 active1" @click="act($event)">全部</span></div>
          <div class="goodsCateType" v-for="item in cateGorySon" :key="item.id"><span class="gctP2" @click="act($event)">{{item.categoryName}}</span></div>
        </div>
        <div class="morebox">
          <div class="more">更多</div>
          <div class="upp" @click="twoMore"><i class="el-icon-arrow-down arrow" id="turn1"></i></div>
        </div>
      </div>
      <!-- 排序区域 -->
      <div class="sort">
        <div class="boxFont1">
          <el-radio-group v-model="radio2" size="small" fill="#db0014">
            <el-radio-button label="综合排序">综合排序</el-radio-button>
            <el-radio-button label="销量">销量<i @click="upDown0($event)" class="el-icon-caret-top" style="margin-left:5px"></i></el-radio-button>
            <el-radio-button label="价格">价格<i @click="upDown1($event)" class="el-icon-caret-bottom" style="margin-left:5px"></i></el-radio-button>
            <el-radio-button label="评论数">评论数<i @click="upDown2($event)" class="el-icon-caret-bottom" style="margin-left:5px"></i></el-radio-button>
          </el-radio-group>
        </div>
        <div class="toRight" @click="addNumber">&gt;</div>
        <div class="toLeft" @click="minusNumber">&lt;</div>
        <div class="number1">
          <div class="left numberColor" id="changeNumber">1</div>
          <div class="left">/</div>
          <div class="left">{{((this.totalRecords%this.params.pageSize)==0)?this.totalRecords/this.params.pageSize:parseInt(this.totalRecords/this.params.pageSize)+1}}</div>
        </div>
      </div>

      <!-- 具体商品信息 -->
      <div class="allGoods">
        <div class="left wrap" v-for="item in goods" :key="item.commodityId">
          <div class="sBox" @click="toCommodityDetails(item.commodityId,item.categoryFirst)">
            <div class="images"><img :src="item.pictureAddress" /></div>
            <div class="deliFont">{{item.commodityName}}</div>
            <div class="money">￥{{item.commodityRetailPrice}}.00</div>
          </div>
          <div class="buy">
            <div class="left now" @click="buyNow(item.commodityId)">立即购买</div>
            <div class="left now" @click="addCart(item.commodityId)">加入购物车</div>
          </div>
        </div>
      </div>
      <!-- 页码 -->
      <div class="pagebox">
        <div class="page">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalRecords"
            :page-size="params.pageSize"
            :current-page.sync="currentPage"
            @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="line"> </div>
    <foot></foot>
  </div>
</template>
<script>
import $ from "jquery";
import TopButtom from "@/components/publicVue/TopButtom"; //公共头
import Foot from "@/components/publicVue/Foot"; //公共头
export default {
  components: {
    TopButtom,
    Foot
  },
  data() {
    return {
      tokenFront: "",
      page: 1,
      msg: "",
      currentPage: 1,
      sortingRetailPrice: 1,
      sortingTotalCount: 1,
      categoryParentId:1,
      params: {
        pageNum: 1,
        pageSize: 4,
        sortingRetailPrice: 0,
        sortingTotalCount: 0
      },
      details: {},
      totalRecords: 0,
      goods: [],
      cateGory: [],
      cateGorySon: [],
      radio2: "综合排序"
    };
  },
  // 监听器
  watch: {
    currentPage: function(val) {
      this.params.pageNum = val;
    },
    sortingRetailPrice: function(val) {
      this.params.sortingRetailPrice = val;
    },
    sortingTotalCount: function(val) {
      this.params.sortingTotalCount = val;
    },
    categoryParentId:function(val){
      this.categoryParentId=val;
    }
  },
  // 页面渲染
  mounted() {
    this.getDate();
    this.getCateList();
    this.tokenFront = sessionStorage.getItem("customertoken");
  },
  methods: {
    //商品中心主界面
    getDate() {
      this.$axios
        .get("/front/commodityCenter/getCommodityList", { params: this.params })
        .then(resp => {
          if (resp.data.code == 0) {
            this.goods = resp.data.data.list;
            this.totalRecords = resp.data.data.totalRecords;
          } else if (resp.data.code == 2) {
            alert("登录失效，请重新登录");
            this.router.push({
              path: "/"
            });
          } else {
            alert("商品中心主界面查询失败");
          }
        });
    },
    //获取商品分类
    getCateList() {
      this.$axios
        .get("/front/commodity/getClassifyList", {
          params: { categoryParentId: "0" }
        })
        .then(resp => {
          if (resp.data.code == 0) {
            this.cateGory = resp.data.data;
          } else if (resp.data.code == 2) {
            alert("登录失效，请重新登录");
            this.router.push({
              path: "/"
            });
          } else {
            alert("商品中心分类查询失败");
          }
        });
    },
    //去往商品详情页面
    toCommodityDetails(id, category) {
      this.$router.push({
        path: "/Commodit/CommodityDetails",
        query: {
          commodityId: id,
          categoryFirst: category
        }
      });
    },
    //去往立即购买页面
    buyNow(id) {
      var commodityList =[{ commodityId: id,commodityNum: "1"}];
      //  commodityList.push({ commodityId: id,commodityNum: "1"})
      this.$router.push({
        path: "/Cart/SureCart",
        query: { commodityList }
      });
    },
    // 加入购物车
    addCart(id) {
      var params = new URLSearchParams();
      params.append("commodityId", id);
      params.append("shopNumber", 1);
      params.append("tokenFront", this.tokenFront);
      this.$axios.defaults.headers.common["token"] = this.tokenFront;
      this.$axios
        .post("/front/commodityCenter/addShoppingCart", params)
        .then(resp => {
          if (resp.data.code == 0) {
            this.msg = resp.data.msg;
            alert("加入购物车信息" + this.msg);
          } else if (resp.data.code == 2) {
            alert("登录失效，请重新登录");
            this.router.push({
              path: "/"
            });
          } else {
            alert("其他错误，请仔细检查！！！！");
          }
        });
    },
    // 商品大类更多
    more() {
      if ($("#goodsBig").height() == 40) {
        $("#goodsBig").height($("#goodsBig").height() + 40);
        $("#goodsSmall").height($("#goodsSmall").height() + 40);
        $("#turn").addClass("turn");
      } else {
        $("#goodsBig").height($("#goodsBig").height() - 40);
        $("#goodsSmall").height($("#goodsSmall").height() - 40);
        $("#turn").removeClass("turn");
      }
    },
    // 二级分类更多
    twoMore() {
      if ($("#Second").height() == 40) {
        $("#Second").height($("#Second").height() + 40);
        $("#goodsSecond").height($("#goodsSecond").height() + 40);
        $("#turn1").removeClass("turn");
      } else {
        $("#Second").height($("#Second").height() - 40);
        $("#goodsSecond").height($("#goodsSecond").height() - 40);
        $("#turn1").addClass("turn");
      }
    },
    // 销量排序
    upDown0(e) {
      if (
        e.srcElement.style.transform == "rotate(180deg)" &&
        this.sortingTotalCount == 1
      ) {
        e.srcElement.style.transform = "rotate(0)";
        this.sortingTotalCount = 2;
        this.getDate();
      } else {
        e.srcElement.style.transform = "rotate(180deg)";
        this.sortingTotalCount = 1;
        this.getDate();
      }
    },
    // 价格排序
    upDown1(e) {
      if (
        e.srcElement.style.transform == "rotate(180deg)" &&
        this.sortingRetailPrice == 1
      ) {
        e.srcElement.style.transform = "rotate(0)";
        this.sortingRetailPrice = 2;
        this.getDate();
      } else {
        e.srcElement.style.transform = "rotate(180deg)";
        this.sortingRetailPrice = 1;
        this.getDate();
      }
    },
    // 评论数排序
    upDown2(e) {
      if (e.srcElement.style.transform == "rotate(180deg)") {
        e.srcElement.style.transform = "rotate(0)";
      } else {
        e.srcElement.style.transform = "rotate(180deg)";
      }
    },
    // 数字框减
    minusNumber() {
      if ($("#changeNumber").text() > 1) {
        $("#changeNumber").text(Number($("#changeNumber").text()) - 1);
        this.currentPage = Number($("#changeNumber").text());
        this.getDate();
        $(".toRight").css("background-color", "white");
        if ($("#changeNumber").text() == 1) {
          $(".toLeft").css("background-color", "rgba(241,241,241,0.5)");
        }
      }
    },
    // 数字框加
    addNumber() {
      this.page=this.totalRecords%this.params.pageSize==0?this.totalRecords/this.params.pageSize:parseInt(this.totalRecords/this.params.pageSize)+1
      if ($("#changeNumber").text() < this.page) {
        $("#changeNumber").text(Number($("#changeNumber").text()) + 1);
        this.currentPage = Number($("#changeNumber").text());
        this.getDate();
        $(".toLeft").css("background-color", "white");
        if ($("#changeNumber").text() == this.page) {
          $(".toRight").css("background-color", "rgba(241,241,241,0.5)");
        }
      }
    },
    act(e) {
      if (e.srcElement.className == "gctP1") {
        for (
          var i = 0;
          i < document.getElementsByClassName("gctP1").length;
          i++
        ) {
          document.getElementsByClassName("gctP1")[i].className = "gctP1";
        }
        e.srcElement.className = "gctP1 active1";
      } else {
        for (
          var i = 0;
          i < document.getElementsByClassName("gctP2").length;
          i++
        ) {
          document.getElementsByClassName("gctP2")[i].className = "gctP2";
        }
        e.srcElement.className = "gctP2 active1";
      }
    },
    act(e,categoryId) {
      if (e.srcElement.className == "gctP1") {
        for (
          var i = 0;
          i < document.getElementsByClassName("gctP1").length;
          i++
        ) {
          document.getElementsByClassName("gctP1")[i].className = "gctP1";
           this.$axios.get("/front/commodity/getClassifyList", {params: { categoryParentId: categoryId }}).then(resp => {
            this.cateGorySon = resp.data.data;
        });
        }
        e.srcElement.className = "gctP1 active1";
      } else {
        for (
          var i = 0;
          i < document.getElementsByClassName("gctP2").length;
          i++
        ) {
          document.getElementsByClassName("gctP2")[i].className = "gctP2";
        }
        e.srcElement.className = "gctP2 active1";
      }
    },
    // 上一页下一页
    handleCurrentChange(val) {
      this.getDate();
    }
  }
};
</script>
<style>
.commodityCenter .bar {
  width: 1200px;
  margin: auto;
  margin-top: 15px;
}
.commodityCenter .box {
  width: 1200px;
  margin: auto;
  height: 35px;
  display: flex;
  margin-top: 0.5rem;
  border-bottom: dashed 1px #f1f1f1;
}

.commodityCenter .barBacground {
  width: 1200px;
  margin: auto;
  background-color: #f1f1f1;
  height: 35px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  border-top-style: solid;
  border-bottom-style: solid;
  border-width: 1px;
  border-top-color: #e5e5e5;
  border-bottom-color: #e5e5e5;
}

.commodityCenter .left {
  float: left;
}

.commodityCenter .stationery {
  color: #e64e4f;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 1px;
  margin-left: 0.7rem;
}

.commodityCenter .goodsSelect {
  margin-left: 0.3rem;
  font-size: 1rem;
  font-weight: 900;
  color: #737373;
}

.commodityCenter .all {
  font-size: 0.7rem;
  color: #959595;
  margin-left: 1rem;
}

.commodityCenter .goodssType {
  font-weight: 600;
  margin-left: 0.7rem;
  width: 5rem;
  line-height: 40px;
  float: left;
  font-size: 14px;
}

.commodityCenter .goodsType {
  font-weight: 600;
  margin-left: 0.7rem;
  width: 5rem;
  height: 75px;
}

.commodityCenter .goodsCateType {
  width: 135px;
  float: left;
  color: #8f8f8f;
  font-size: 13px;
  height: 40px;
  line-height: 40px;
  margin-left: 30px;
}
.commodityCenter .goodsCateType span {
  padding: 6px 15px;
  cursor: pointer;
}
.commodityCenter .active1 {
  background: #db0014;
  color: white;

  font-size: 13px;
  border-radius: 5px;
}

.commodityCenter .cateType {
  margin-left: 1rem;
  width: 8rem;
  color: #8f8f8f;
  margin-bottom: 1rem;
  text-align: start;
  font-size: 1rem;
  overflow: hidden;
}

.commodityCenter .morebox {
  float: right;
  margin-top: 6.2px;
  margin-right: 17px;
}
.commodityCenter .more {
  font-weight: 600;
  font-size: 14px;
  height: 27.6px;
  line-height: 27.6px;
  margin-right: 7px;
  float: left;
}

.commodityCenter .upp {
  border: solid 1px rgb(230, 230, 230);
  width: 1.6rem;
  height: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
}

.commodityCenter .arrow {
  padding: 5px;
  transition: all 0.1s;
}

.commodityCenter .turn {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}

.commodityCenter .bigBox {
  width: 1200px;
  margin: auto;
  border-bottom: solid 2px #f1f1f1;
  height: 40px;
  transition: all 0.1s;
}

.commodityCenter .sort {
  width: 1200px;
  margin: auto;
  height: 45px;
  background-color: rgb(241, 241, 241);
  margin-top: 1rem;
  align-items: center;
}

.commodityCenter .sortZ {
  background-color: #db0014;
  padding: 5px 15px;

  margin-left: 0.5rem;
  color: white;
  border-radius: 2px;
  text-align: center;
  font-size: 13px;
  float: left;
}

.commodityCenter .boxFont {
  padding: 4px 8px 4px 15px;
  border: solid 1px #e7e7e7;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  float: left;
}
.commodityCenter .boxFont1 {
  float: left;
  margin-top: 7px;
  margin-left: 20px;
}

.commodityCenter .font {
  color: #5a5a5a;
}

.commodityCenter .down {
  width: 1rem;
  height: 1rem;
  margin-left: 0.3rem;
  -webkit-transition: -webkit-transform 1s;
  transition: transform 1s;
}

.commodityCenter .sBox {
  width: 280px;
  height: 370px;
  border: solid 1px #e7e7e7;
  background-color: white;
}

.commodityCenter .images {
  width: 250px;
  height: 240px;
  margin: 0 auto;
  overflow: hidden;
}
.commodityCenter .images img {
  width: 100%;
  height: 100%;
}

.commodityCenter .deliFont {
  color: #3d3d3d;
  width: 85%;
  margin: 0 auto;
  margin-top: 25px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.commodityCenter .money {
  color: #dc1124;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 68px;
  font-size: 20px;
  margin-top: 3px;
}

.commodityCenter .buy {
  height: 40px;
  width: 282px;
  background-color: rgb(248, 248, 248);
}

.commodityCenter .wrap {
  width: 290px;
  height: 410px;
  margin-top: 1rem;
  margin-right: 13.32px;
}
.commodityCenter .wrap:nth-child(4n) {
  margin-right: 0;
}
.commodityCenter .now {
  color: #df2839;
  width: 139px;
  border: solid 1px #e9e9e9;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.commodityCenter .cnxh-title-btn {
  float: right;
  width: 40px;
  height: 30px;
  line-height: 27.1px;
  margin-top: 16px;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid rgb(224, 224, 224);
  cursor: pointer;
}

.commodityCenter .number1 {
  height: 45xp;
  line-height: 45px;
  color: #909090;
  font-size: 13px;
  float: right;
}

.commodityCenter .numberColor {
  color: red;
  font-weight: bold;
}

.commodityCenter .toLeft {
  border: solid 1px rgb(206, 204, 204);
  padding: 2px 16px;
  margin-top: 11px;
  margin-left: 0.5rem;
  color: #d9d9d9;
  text-align: center;
  cursor: pointer;
  float: right;
}

.commodityCenter .toRight {
  border: solid 1px rgb(206, 204, 204);
  padding: 2px 16px;
  margin-top: 11px;
  margin-right: 15px;
  background-color: white;
  color: #d9d9d9;
  text-align: center;
  cursor: pointer;
  float: right;
}

.commodityCenter .pagebox {
  width: 1200px;
  height: 50px;
  margin: 0 auto;
}
.commodityCenter .pagebox .page {
  float: right;
  margin-top: 0.5rem;
  margin-right: 1.5rem;
}

.commodityCenter .line {
  width: 100%;
  border: solid 1px #e4e4e4;
  margin-top: 2rem;
}

.commodityCenter .test {
  width: 64.5rem;
  overflow: hidden;
  height: 75px;
}

.commodityCenter .test1 {
  width: 83%;
  height: 40px;
  margin: 0 15px;
  overflow: hidden;
  float: left;
}

.commodityCenter .allGoods {
  width: 1200px;
  margin: auto;
  overflow: hidden;
}
</style>
