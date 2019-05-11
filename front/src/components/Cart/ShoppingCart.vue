<template>
  <div>
    <TopButtom></TopButtom>
    <!-- 面包屑 -->
    <div class="breadcrumbCart">
      <div class="breadcrumbCartPosition">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>购物车</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <!-- 购物车 -->
    <div class="shoppingCart">
      <!-- 购物车主体 -->
      <div class="cartMain">
        <!-- 表头 -->
        <div class="cartThead">
          <div class="goods">
            商品
          </div>
          <div class="minimum">
            起订量
          </div>
          <div class="number">
            数量
          </div>
          <div class="price">
            价格
          </div>
          <div class="sum">
            实付款
          </div>
          <div class="action">
            操作
          </div>
        </div>
        <!-- 蓝色分割线 -->
        <div class="cartCut"></div>
        <!-- 列表 -->
        <div class="cartList">
          <div class="cartItem" v-for="(goodsdata, index) in goodsdatas" :key="goodsdata.shopId">
            <!-- 复选框 -->
            <div class="cartCheckbox">
              <input type="checkbox" @change="checkedRadioBtn(goodsdata, index)" v-model="goodsdata.itemcheckbox" />
            </div>
            <!-- 图片 -->
            <div class="itemImg">
              <img :src=goodsdata.pictureAddress alt="商品">
            </div>
            <div class="itemDetaIled">
              <p>{{goodsdata.commodityName}}</p>
            </div>
            <div class="itemMinimum">
              <p>1</p>
            </div>
            <div class="itemNumber">
              <div class="counter">
                <!-- <el-input-number size="mini" v-model="num" :min='1'></el-input-number> -->
                <input type="button" @click="goodNum(goodsdata,-1, index)" class="ad" value="-" />
                <input v-model="goodsdata.commodityNum" type="text" class="numInput"
                  v-on:input="watchNum(goodsdata,index, $event)">
                <input type="button" @click="goodNum(goodsdata,1, index)" class="ad" value="+" />
              </div>
            </div>
            <div class="itemPrice">
              <p>{{goodsdata.commodityRetailPrice | moneyFiler}}</p>
            </div>
            <div class="itemSum">
              <p>{{goodsdata.commodityRetailPrice*goodsdata.commodityNum | moneyFiler}}</p>
            </div>
            <div class="itemAction" @click="deleteGoodsBtn(goodsdata, index)">
              <p>删除</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部工具栏 -->
      <div class="cartToolBar">
        <!-- 全选 -->
        <div class="allCheckbox">
          <input type="checkbox" v-model="checkedAll" @change="checkedAllBtn(checkedAll)" />
          <p>全选</p>
        </div>
        <!-- 删除选中商品 -->
        <div class="delete" @click="deleteSelectGoodsBtn">
          <p>删除选中商品</p>
        </div>
        <!-- 已选中商品计数 -->
        <div class="count">
          已选择
          <p>{{goodsNum}}</p>
          件商品
        </div>
        <!-- 总计 -->
        <div class="amount">
          金额总计（不包含运费）：
          <p>{{totalMoney | moneyFiler}}</p>
        </div>
        <!-- 操作 -->
        <div class="action">
          <div class="goShop" @click="toCommodityCenter()">
            <p>继续购物</p>
          </div>
          <div class="sure" @click="toSureCart()">
            <p>提交订单</p>
          </div>
        </div>
      </div>
    </div>
    <Foot></Foot>
  </div>
</template>
<style>
  @import './../../assets/css/shoppingCart.css';
</style>
<script>
  import Bus from '../../common/bus.js'
  import TopButtom from '@/components/publicVue/TopButtom' //公共头
  import Foot from '@/components/publicVue/Foot' //公共头
  export default {
    name: 'HelloWorld',
    components: {
      TopButtom,
      Foot,
    },
    data() {
      return {
        // 默认标签和关键字
        checkedAll: true, //全选
        itemcheckbox: true,
        goodsNum: 0, //商品的数量
        totalMoney: 0, //总价
        checked: [],
        itemcheckbox: false, //单选框
        allSelectGoods: [], //选中商品
        selectedGoods: [],//点击提交订单，将已选中商品放入数组中
        idAndNum: [],//存放要shopId+shopIditem
        tokenFront: '',//用户token
        // 数据源
        getShopCartUrl: "http://"+this.$store.state.url+"/front/shoppingCart/getShoppingCartList",
        getDeleteShopCartUrl: "http://"+this.$store.state.url+"/front/shoppingCart/deleteShoppingCart",
        goodsdatas: [],
      }
    },
    /*金额过滤器*/
    filters: {
      moneyFiler: function (value) {
        return "￥" + parseFloat(value).toFixed(2);
      }
    },
    mounted: function () {
      //从session中获取token
      this.tokenFront = sessionStorage.getItem('customertoken');
      //获取购物车信息
      this.getShopCart();
    },
    methods: {
      //查询购物车接口
      getShopCart: function () {
        if(this.tokenFront != null || undefined){
          this.$axios.get(this.getShopCartUrl,{
            params:{
              "tokenFront":this.tokenFront
            },
            headers:{
              "token":this.tokenFront
            }
          }).then((result) => {
            if (result.data.code == 0) {
              this.goodsdatas = result.data.data;
              var _this = this;
              this.goodsdatas.map(function (goodsdata) {
                _this.$set(goodsdata, 'itemcheckbox', true);
              })
              this.shopCartNoGoods();//判断购物车中是否有商品
              this.countTotalMoney(); //计算总价
              this.countGoodsNum(); //计算商品数量
              this.goodsNum = this.allSelectGoods.length;
              this.changeallchecked();
            } else {
              this.$message({
              message: "购物车信息获取失败",
              type: "warning"
              })
              this.checkedAll = false;
            }
          });
        }else{
          this.$confirm('未登录或登陆超时，请重新登录','提示',{
            confirmButtonText: '登录',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(()=>{
            this.$router.push('/');
          })
        }
      },
      // 跳转至确认订单页
      toSureCart() {
        this.selectGoodsToSureCart();
        var _this = this
        this.selectedGoods.forEach(function(item){
          _this.idAndNum.push({'commodityId':item.commodityId,'commodityNum':item.commodityNum})
        })
        this.$router.push({path:"/Cart/SureCart",query:{commodityList:this.idAndNum}});
      },
      //继续购物
      toCommodityCenter(){
        this.$router.push('/Commodit/CommodityCenter');
      },
      //input框输入数量计算
      watchNum(item ,index) {
        item.itemcheckbox = true
        this.shopIdToAllSelectGoods(this.goodsdatas[index].shopId, item, index)
        this.countTotalMoney()
        this.changeallchecked()
      },
      /*商品数量增加减少函数*/
      goodNum: function (item, way, index) {
        item.itemcheckbox = true;
        var _this = this
        if (item.itemcheckbox == true) {
          this.shopIdToAllSelectGoods(this.goodsdatas[index].shopId, item, index)
          this.changeallchecked()
          this.goodsNum = this.allSelectGoods.length;
        }
        this.changeallchecked()
        if (way == 1) {
          item.commodityNum++;
          this.countTotalMoney();
          this.changeallchecked()
        } else {
          if (item.commodityNum < 2) {
            alert("不能再少了")
            item.commodityNum = 1;
            this.changeallchecked()
          } else {
            item.commodityNum--;
            this.countTotalMoney();
            this.changeallchecked()
          }
        }
      },
      // 全选
      checkedAllBtn(checkedAll) {
        var _this = this
        if (checkedAll == false) {
          for (var x = 0; x < this.goodsdatas.length; x++) {
            this.goodsdatas[x].itemcheckbox = false;
            this.goodsNum = 0;
            this.totalMoney = 0;
          }
          this.allSelectGoods = []
        } else {
          for (var y = 0; y < this.goodsdatas.length; y++) {
            this.goodsdatas[y].itemcheckbox = true;
            this.totalMoney += this.goodsdatas[y].commodityNum * this.goodsdatas[y].commodityRetailPrice;
          }
          this.countGoodsNum();
          this.goodsNum = this.allSelectGoods.length;
        }

      },
      // 单选
      checkedRadioBtn(item, index) {
        if (item.itemcheckbox == true) {
          this.allSelectGoods.push(this.goodsdatas[index].shopId)
          this.changeallchecked()
          this.goodsNum = this.allSelectGoods.length;
        } else {
          var index = this.allSelectGoods.indexOf(this.goodsdatas[index].shopId)
          if (index > -1) {
            this.allSelectGoods.splice(index, 1)
          }
          this.changeallchecked()
          this.goodsNum = this.allSelectGoods.length;
        }
        this.countTotalMoney()
        this.changeallchecked()
      },
      //删除单个商品
      deleteGoodsBtn(item, index) {
        this.$confirm('确认要删除该商品吗QAQ', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(()=>{
          var params = {
          'tokenFront': this.tokenFront,
          'shopId': item.shopId
          }
          this.$axios.defaults.headers.common['token']= this.tokenFront;
          this.$axios.delete(this.getDeleteShopCartUrl,{params}).then(result => {
            if (result.data.code == 0) {
              this.$message({
                message:"删除商品成功",
                type: "success"
              })
              this.getShopCart();
            } else {
              this.$message({
                message:"删除商品失败",
                type: "warning"
              })
            }
          })
        })
      },
      //删除选中商品
      deleteSelectGoodsBtn() {
        this.$confirm('确认删除选中商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(()=>{
          var _this = this
          this.goodsdatas.forEach((item) =>{
            if (item.itemcheckbox == true) {
              this.$message({
                message:"删除商品成功",
                type: "success"
              })
              var params = {
                'tokenFront': _this.tokenFront,
                'shopId': item.shopId
              }
              this.$axios.defaults.headers.common['token']= this.tokenFront;
              this.$axios.delete(_this.getDeleteShopCartUrl,{params}).then(result => {
              this.getShopCart();
              this.changeallchecked();
            })
            }else{
              this.$message({
                message:"删除商品失败",
                type: "warning"
              })
            }
          })
        })
      },
      // 计算总价
      countTotalMoney() {
        var _this = this;
        _this.totalMoney = 0;
        this.goodsdatas.forEach(function (item) {
          if (item.itemcheckbox == true) {
            _this.totalMoney += item.commodityNum * item.commodityRetailPrice;
          }
        })
      },
      //改变全选框选中状态
      changeallchecked() {
        if (this.allSelectGoods.length == this.goodsdatas.length) {
          this.checkedAll = true
        } else {
          this.checkedAll = false
        }
      },
      //计算商品数量（计算选中商品）
      countGoodsNum() {
        var _this = this
        this.allSelectGoods = []
        this.goodsdatas.forEach(function (item) {
          if (item.itemcheckbox == true) {
            _this.allSelectGoods.push(item.shopId)
          } else {
            var index = _this.allSelectGoods.indexOf(item.shopId)
            if (index > -1) {
              this.allSelectGoods.splice(index, 1)
            }
          }
        })
        this.goodsNum = this.allSelectGoods.length;
      },
      //判断shopId是否在allSelectGoods[]
      shopIdToAllSelectGoods(value, item, index) { //value 传进来的shopId
        var repeat = this.allSelectGoods.some(item => {
          if (item == value) {
            return true
          }
        })
        if (repeat) {
          return true
        } else {
          this.allSelectGoods.push(value)
        }
      },
      //将选定商品放入数组
      selectGoodsToSureCart(){
        this.selectedGoods = []
        var _this =this
        this.goodsdatas.forEach(function(item){
          if(item.itemcheckbox == true){
            _this.selectedGoods.push(item)
          }
        })
      },
      //当购物车无商品时全选框不选中
      shopCartNoGoods(){
        if(this.goodsdatas.length == 0){
          this.checkedAll = false;
        }
      },
    }
  }
</script>
