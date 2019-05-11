<template>
  <div>
    <TopButtom></TopButtom>
    <div class="successBackground">
    <div class="successShopping">
      <div class="main">
        <div class="successImg">
          <img :src="cartSuccess" />
        </div>
        <p>支付成功！</p>
        <p>我们会尽快为您处理</p>
      </div>
      <div class="footer">
        <div class="orderId">
          订单号:
          <p>{{orderNumber}}</p>
        </div>
        <div class="pay">
          支付金额:
          <p>￥{{orderPrice}}</p>
        </div>
        <div class="action">
          <p><router-link :to="'/Order/OrderCenter/'+ orderId" style="color: blue;">查看订单详情</router-link></p>
          <p @click="toShop()">继续购物</p>
        </div>
      </div>
    </div>
  </div>
    <Foot></Foot>
  </div>
</template>
<style>
  @import './../../assets/css/success.css';
</style>
<script>
  import TopButtom from '@/components/publicVue/TopButtom' //公共头
  import Foot from '@/components/publicVue/Foot' //公共头
  export default {
    name: 'HelloWorld',
    components: {
      TopButtom,
      Foot,
    },
    name: "Success",
    data() {
      return {
        orderNumber:'',
        orderPrice:'',
        orderId: '',
        cartSuccess: require("../../assets/img/Cart-success.png"),
      };
    },
    mounted:function(){
      this.getOrderData();
    },
    methods:{
      getOrderData(){
        this.orderNumber =this.$route.query.orderNumber
        this.orderPrice = this.$route.query.orderPrice
        this.orderId = this.$route.query.orderId
      },
      toOrderDetails(){
        this.$router.push('/Order/OrderCenter/:orderId')
      },
      toShop(){
        this.$router.push('/Commodit/CommodityCenter')
      }
    }
  };

</script>

<style>
</style>
