<template>
  <div>
    <TopButtom></TopButtom>
    <!-- 确认订单 -->
    <div class="sureCart">
      <!-- 选择地址 -->
      <div class="talbar">请选择收货地址</div>
      <div class="selectAddress">
        <div class="addressList" v-for="(item, index) in addressData">
          <div class="selectBox" >
            <input type="checkbox" @change="radioBtn(item , index)" v-model="item.radioBox">
          </div>
          <div class="userName">
            {{item.receiveContact}}
          </div>
          <div class="telephone">
            {{item.receiveTel}}
          </div>
          <div class="address">
            {{item.regionProvinceName}}
            {{item.regionCityName}}
            {{item.regionCountyName}}
            {{item.receiveDetailedAddress}}
          </div>
          <div class="acquiescent">
            <div v-show="item.receiveIsDefault==1"><p>默认地址</p></div>
          </div>
          <div class="setAcquiescent">
            <div v-show="item.receiveIsDefault !=1" @click="getUpdateReceiveByDefault(item)"><p>设为默认</p></div>
          </div>
          <div class="changeAddress" @click="toShoppingAddress">
            <p>修改此地址</p>
          </div>
        </div>
        <div class="extraAddress">
          <div @click="toShoppingAddress">
            <div><img :src="sureCartAdd" alt="图片"/></div>
          <p>新增收货地址</p>
          </div>
        </div>
      </div>
      <div class="talbar">确认订单</div>
      <!-- 确认订单主体 -->
      <div class="cartMain">
        <!-- 表头 -->
        <div class="cartThead">
          <div class="goods">
            商品
          </div>
          <div class="number">
            数量
          </div>
          <div class="price">
            单价
          </div>
          <div class="sum">
            小结
          </div>
        </div>
        <!-- 蓝色分割线 -->
        <div class="cartCut"></div>
        <!-- 列表 -->
        <div class="cartList">
          <div class="cartItem" v-for="goodsdata in goodsdatas" :key="goodsdata.commodityCode">
            <!-- 商品信息 -->
            <div class="goodsSelf">
              <div class="itemImg">
                <img :src="goodsdata.pictureAddress" alt="商品">
              </div>
              <div class="itemDetaIled">
                <p>{{goodsdata.commodityName}}</p>
              </div>
            </div>
            <!-- 数量 -->
            <div class="itemNumber">
              <div class="counter">
                <input type="button" @click="goodNum(goodsdata,-1)" class="ad" value="-" />
                <input v-model="goodsdata.commodityNum" type="text" class="numInput">
                <input type="button" @click="goodNum(goodsdata,1)" class="ad" value="+" />
              </div>
            </div>
            <!-- 单价 -->
            <div class="itemPrice">
              <p>{{goodsdata.commodityPrice | moneyFiler}}</p>
            </div>
            <!-- 小结 -->
            <div class="itemSum">
              <p>{{goodsdata.commodityPrice*goodsdata.commodityNum | moneyFiler}}</p>
            </div>

          </div>
          <div class="remark">
            <p>货品留言：</p>
            <textarea  type="text" placeholder="限256字内" cols="4" v-model="orderRemark"></textarea>
          </div>
        </div>
      </div>
      <!-- 底部工具栏 -->
      <div class="cartToolBar">
        <!-- 总计 -->
        <div class="accounts">
          <div class="allGoodsPrice">
            商品金额:
            <p>{{totalMoney | moneyFiler}}</p>
          </div>
          <div class="amount">
            合计:
            <p>{{totalMoney | moneyFiler}}</p>
          </div>
        </div>
        <!-- 操作 -->
        <div class="action" @click="toSuccessCart()">
          <p>提交订单</p>
        </div>
      </div>
    </div>
    <Foot></Foot>
  </div>
</template>
<style>
  @import './../../assets/css/sureCart.css';
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
        tokenFront: '',
        goodsNum: 0, //商品的数量
        totalMoney: 0, //总价
        radioBox: false,//地址选择
        showDefault: true,//是否为默认地址
        showSetDefault: true,//设置为默认地址
        defaultAdd: [],//默认地址
        orderData: [],
        selectAddress: [],
        totalPrice: 0,
        orderRemark: '',
        sureCartAdd: require("../../assets/img/SureCart-add.png"),//增加地址+号图片
        // 数据源
        addressData:[],
        goodsdatas: [],
        getAddressUrl: "http://"+this.$store.state.url+'/front/receive/getReceiveList',//收货地址查询
        getAddOrderUrl: "http://"+this.$store.state.url+'/front/commodityCenter/addOrder',//提交订单
        getCommodityBuyNowUrl: "http://"+this.$store.state.url+'/front/commodityCenter/getCommodityBuyNow',//立即购买
        getUpdateReceiveByDefaultUrl: "http://"+this.$store.state.url+'/front/receive/updateReceiveByDefault',//设为默认地址
      }
    },
    /*金额过滤器*/
    filters: {
      moneyFiler: function (value) {
        return "￥" + parseFloat(value).toFixed(2);
      }
    },
    mounted:function(){
      this.tokenFront = sessionStorage.getItem('customertoken');
      this.getAddData()
      var _this=this;
      this.addressData.map(function(item){
        _this.$set(item,'radioBox',false);
      })
      this.getCommodityBuyNow();//获取确认订单信息
    },
    methods: {
      //获取收货地址信息
      getAddData:function (){
        this.$axios.get(this.getAddressUrl,{
            params:{
              "tokenFront":this.tokenFront
            },
            headers:{
              "token": this.tokenFront
            }
          }).then(result => {
          if (result.data.code == 0) {
            this.addressData = result.data.data;
            this.defaultAddressSelected();
          } else {
            this.$message({
              message: "获取收货地址信息失败",
              type: "warning"
            })
          }
        });
      },
      //收货地址设为默认
      getUpdateReceiveByDefault(item){
        var params = new URLSearchParams();
        params.append('tokenFront', this.tokenFront)
        params.append('receiveId', item.receiveId)
        params.append('version', item.version)
        this.$axios.defaults.headers.common['token']= this.tokenFront;
        this.$axios.put(this.getUpdateReceiveByDefaultUrl,params).then((res)=>{
          if(res.data.code == 0){
            this.$message({
              message: "设为默认收货地址成功",
              type: "success"
            })
            this.getAddData();  //重新查一遍收货地址
          }else{
            this.$message({
              message: "设为默认收货地址失败",
              type: "warning"
            })
            alert(res.data.code + res.data.msg)
          }
        })
      },
      //确认订单部分数据走的立即购买接口
      getCommodityBuyNow(){
        //动态数据
        var params = {
          "tokenFront": this.tokenFront,
          "commodityList": this.$route.query.commodityList
        }
        this.$axios.defaults.headers.common['token']=this.tokenFront;
        this.$axios.post(this.getCommodityBuyNowUrl,params).then(res =>{
          if(res.data.code == 0){
            this.$message({
              message: "获取数据成功",
              type: "success"
            })
            console.log(this.goodsdatas)
            this.totalPrice = res.data.data.totalPrice
            this.goodsdatas = res.data.data.commodityList;
            this.countTotalMoney();
          }else{
            this.$message({
              message: "获取立即购买接口数据失败",
              type: "warning"
            })
          }
        })
      },
      //提交订单
      getAddOrder(){
        this.toSelectedAddress()//选中地址
        this.$confirm('请核对好信息，确认提交订单', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(()=>{
          //将商品信息放入orderData
          this.goodsdatas.forEach((item)=>{
            this.orderData.push({
              "commodityId": item.commodityId,
              "commodityNum": item.commodityNum
            })
          })
          //动态数据
          var params = {
            'tokenFront': this.tokenFront,
            'orderAddress': this.selectAddress[1],
            'receiveTel': this.selectAddress[0].receiveTel,
            'receiveContact': this.selectAddress[0].receiveContact,
            'orderRemark': this.orderRemark,
            'commodityList': this.orderData
          }
          this.$axios.defaults.headers.common['token']= this.tokenFront;
          this.$axios.post(this.getAddOrderUrl,params).then(res =>{
            if(res.data.code == 0){
              this.$message({
              message: "提交订单成功",
              type: "success"
              })
              this.$router.push({path:"/Cart/Success",query:{
                orderNumber:res.data.data.orderNumber,
                orderPrice:res.data.data.orderPrice,
                orderId:res.data.data.orderId
              }
              })
            }else{
              this.$message({
              message: "提交订单失败",
              type: "warring"
              })
            }
          })
        })
      },
      // 跳转至购买成功页
      toSuccessCart() {
        //提交订单提示
        this.getAddOrder()
      },
      //跳转至收货地址页
      toShoppingAddress(){
        this.$router.push("/Order/ShoppingAddress");
      },
      /*商品数量增加减少函数*/
      goodNum: function (item, way) {
        item.itemcheckbox = true;
        if (way == 1) {
          item.commodityNum++;
          this.countTotalMoney();
        } else {
          if (item.commodityNum < 2) {
            item.commodityNum = 1;
          } else {
            item.commodityNum--;
            this.countTotalMoney();
          }
        }
      },
      // 计算总价
      countTotalMoney(){
        var _this= this;
        _this.totalMoney=0;
        this.goodsdatas.forEach(function(item){
           _this.totalMoney += item.commodityNum* item.commodityPrice;
        })
      },
      // 是否显示为默认地址
      changeDefault(){
        var _this =this
        this.addressData.forEach(function(item){
          if(item.receiveIsDefault == 1){
            _this.showDefault = true;
            _this.showSetDefault = false;
          }else{
            _this.showDefault = false;
            _this.showSetDefault = true;
          }
        })
      },
      //默认第一个选中
      defaultAddressSelected(){
        this.addressData.forEach(function(item){
          if(item.receiveIsDefault == 1){
            item.radioBox = true;
          }
        })
      },
      //选择地址
      radioBtn(item, index){
        this.addressData.forEach(function(item){
          item.radioBox = false
        })
        this.addressData[index].radioBox = true
      },
      //将选中地址放入orderData中
      toSelectedAddress(){
        var _this = this
        this.addressData.forEach(function(item, index){
          if(item.radioBox == true){
            _this.selectAddress.push(item,
              _this.addressData[index].regionProvince+
             _this.addressData[index].regionCity+ _this.addressData[index].regionCounty+
             _this.addressData[index].receiveDetailedAddress)
          }
        })
      },
    }
  }
</script>

<style>
</style>
