<template>
    <div class="orderdetail">
       <div class="cutdetail">
           <p>订单详情</p>
        </div>
       <div class="condetail">
          <div class="destatus">
              <ul>
                  <li style="border-right:1px solid #dfe0e0;">
                      <div class="module">
                      <div>订单号：{{ tableData.orderNumber }}</div>
                      <div>订单状态： <span>{{ tableData.orderState}}</span></div>
                      </div>
                  </li>
                  <li >
                      <div class="module">
                      <div>制单人：{{ tableData.customerName}}</div>
                      <div>订单备注： {{ tableData.orderRemark}}</div>
                      </div>
                  </li>
                  <li >
                      <div class="module">
                      <div style="overflow:hidden;">下单时间：{{ tableData.gmtCreate}}</div>
                      
                      </div>
                  </li>
              </ul>
          </div>
          <div class="deinfo">
             <div class="detitle">
                <p>收货信息</p>
             </div>
             <div class="decon">
                 <div style="float:left;width:240px;">收货人：{{tableData.receiveContact}}</div>
                 <div>联系电话：{{tableData.receiveTel}}</div>
                 <div>收货地址：{{tableData.orderAddress}}</div>
                 <div></div>
             </div>
          </div>

          <div class="delist">
            <div class="lititle">
                 <p>商品清单</p>
            </div>
                 <div class="delist">
                  <div  class="deinlist">
                    <div class="table">
                        <ul>
                            <li><div class="title two" style="width:21%;">货号</div></li>
                            <li><div class="title two" style="width:22%;">商品名称</div></li>
                            <li><div class="title two" style="width:17%;">价格</div></li>
                            <li><div class="title two" style="width:16%;">下单数量</div></li>
                            <li><div class="title two" style="width:24%;">下单金额</div></li>
                        </ul>
                        <ul v-for="sun in tableData.commodityList" :key='sun.commodityCode'>
                            <li class="two" style="width:21%;">
                                <div class="contable">
                                {{sun.commodityCode}}
                                </div>
                            </li>
                            <li class="two" style="width:22%;">        
                                <div class="contable">
                                  {{sun.commodityName}}
                                </div>
                            </li>
                            <li class="two" style="width:17%;">
                                <div class="contable">
                                  {{sun.commodityPrice}}
                                </div>
                            </li>
                            <li class="two" style="width:16%;">       
                                <div class="contable">
                                  {{sun.commodityNum}}
                                </div>
                            </li>
                            <li class="two" style="width:24%;">                    
                                <div class="contable" style="font-weight:bold;color:#d70917;font-size:17px;">
                                  ￥{{sun.commodityTotalPrice}}
                                </div>
                            </li>                      
                        </ul>  
                  </div>
                </div>
            </div>
          </div>
          <div class="allprice">
               <span class="fir">下单总金额：<span class="two">￥{{tableData.orderPrice}}</span></span>
          </div>
       </div>
    </div>
</template>

<script>
export default {
  name: "orderdetail",
  components: {},
  data() {
    return {
      tokenFront: "",
      orderId: "",
      tableData: [],
      getDetailListUrl:"http://" + this.$store.state.url + "/front/orderCenter/getOrderDetail"
    };
  },
  mounted: function() {
     (this.tokenFront = sessionStorage.getItem("customertoken")),
      this.$nextTick(function() {
        this.orderId = this.$route.params.orderId;
        this.getData(this.orderId);
        document.getElementsByClassName("orderTitleContent")[0].style.color =
          "#006cd9";
        document.getElementsByClassName("orderTitleContent")[0].style.fontWeight ="bold";
      });
  },
  methods: {
    //打开加载
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: "操作中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    getData(orderId) {
      this.openFullScreen(); //打开遮罩
      var params = {
        tokenFront: this.tokenFront,
        orderId: this.orderId
      };
      this.$axios.defaults.headers.common["token"] = this.tokenFront;
      this.$axios.get(this.getDetailListUrl, { params }).then(res => {
        this.loading.close(); //关闭加载
        if (0 == res.data.code) {
          //查询成功
          this.tableData = res.data.data;
            if (1 == this.tableData.orderState) {
              this.tableData.orderState = "未发货";
            } else if(2 == this.tableData.orderState){
              this.tableData.orderState = "已发货";
            }  
        } else if (2 == res.data.code) {
          alert("登录失效，请重新登陆");
          this.$router.push("/");
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
        }
      });
    }
  },
  computed: {}
};
</script>

<style scoped>
.cutdetail {
  width: 100%;
  height: 45px;
  line-height: 45px;
  background: white;
  text-align: left;
}
.cutdetail p {
  margin-left: 24px;
}
.condetail {
  width: 957px;
  background: white;
  margin-top: 15px;
  padding: 20px;
}
.condetail .destatus {
  width: 957px;
  height: 140px;
  background-color: #f4f9fd;
  border-bottom: 1px solid #dfe0e0;
  border-top: 4px solid #006cd9;
  border-left: 1px solid #dfe0e0;
  border-right: 1px solid #dfe0e0;
}
.condetail .destatus li {
  text-align: left;
  width: 33%;
  float: left;
}
.condetail .destatus .module {
  margin-left: 30px;
  padding-top: 14px;
}
.condetail .destatus .module span {
  display: inline;
  color: #d70917;
  font-weight: bold;
}
.condetail .destatus li div {
  height: 56px;
  line-height: 56px;
}
.deinfo {
  width: 957px;
  height: 170px;
  background-color: white;
  margin-top: 20px;
}
.detitle {
  width: 100%;
  height: 50px;
  background: #f2f2f2;
  line-height: 50px;
  text-align: left;
}
.detitle p {
  margin-left: 20px;
}
.decon {
  text-align: left;
  margin-left: 20px;
  margin-top: 15px;
}
.decon div {
  height: 45px;
  line-height: 45px;
}
.lititle {
  width: 100%;
  height: 50px;
  background: #f2f2f2;
  line-height: 50px;
  text-align: left;
}
.lititle p {
  margin-left: 20px;
}
.delist {
  width: 957px;
  background-color: white;
  margin-top: 13px;
}
.delist .deinlist {
  width: 100%;
  border: 1px solid #e9e4e4;
  margin-top: 13px;
}
.deinlist .table .title {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
  background-color: #f2f2f2;
  border-bottom: 2.5px solid #006cd9;
}
.delist .table .two {
  width: 20%;
  float: left;
}
.contable {
  width: 100%;
  height: 80px;
  line-height: 22px;
  display: flex;
  align-items: center; /*定义body的元素垂直居中*/
  justify-content: center;
  font-size: 14px;
}
.allprice {
  width: 957px;
  height: 60px;
  line-height: 60px;
  background-color: #f4f9fd;
  border: 1px solid #dfe0e0;
  margin-top: 20px;
  text-align: right;
}
.allprice .fir {
  margin-right: 28px;
  font-size: 15px;
}
.allprice .two {
  color: #d70917;
  font-size: 18px;
  font-weight: bold;
}
.table ul {
  overflow: hidden;
}
</style>
