<template>
  <div class="ordercenter">
    <div class="cut">
      <p>所有订单</p>
    </div>
    <div class="concenter">
      <div class="status">
        <el-form :inline="true" :model="formInline" class="demo-form-inline statusform" size="mini">
              <el-form-item label="订单信息">
                <el-input v-model="formInline.orderNumber" placeholder="订单信息"></el-input>
              </el-form-item>
              <el-form-item label="订单日期">
                <el-date-picker type="date" placeholder="选择日期" v-model="formInline.orderDateStart"
                  style="width: 130px;"></el-date-picker>
                -
                <el-date-picker placeholder="选择日期" v-model="formInline.orderDateEnd" style="width: 130px;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="订单状态">
                <el-select v-model="formInline.orderState" placeholder="订单状态">
                  <el-option label="待发货" value="1"></el-option>
                  <el-option label="已发货" value="2"></el-option>
                  <el-option label="已完成" value="3"></el-option>
                  <el-option label="已撤销" value="4"></el-option>
                </el-select>
              </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchForm" class="but">查询</el-button>
            </el-form-item>
        </el-form>
      </div>

      <div class="list">
        <div v-for="re in tableData" :key='re.id' class="inlist">
          <div class="liststatus">
            <el-checkbox @selection-change="handleSelectionChange" style="margin-left:20px;" @click="select(re.orderId)">{{re.orderDate}}</el-checkbox>
            <span class="account">订单号：{{ re.orderNumber }}</span>
            <span>制单人: {{ re.customerName }}</span>
          </div>
          <div class="totaltitle">
            <ul>
              <li><div class="title" style="width:310px;">商品</div></li>
              <li><div class="title" style="width:100px;">单价</div></li>
              <li><div class="title" style="width:100px;">数量</div></li>
              <li><div class="title" style="width:100px;">总价</div></li>
              <li><div class="title" style="width:115.63px;">备注</div></li>
              <li><div class="title" style="width:115.63px;">状态</div></li>
              <li><div class="title" style="width:115.63px;">操作</div></li>
            </ul>
          </div>
          <div class="table" >
            <div class="tableleft" style="float:left;">
              <ul class="leftul" v-for="rere in re.commodityList" >
                <li class="fir">      
                  <div class="contable">
                    <div class="img">
                      <img :src=rere.commodityFirstPicture>
                    </div>
                    <div class="des">
                      {{rere.commodityName}}
                    </div>
                  </div>
                </li>
                <li class="two">
                  <div class="contable">
                    {{rere.commodityPrice}}
                  </div>
                </li>
                <li class="two">           
                  <div class="contable">
                    {{rere.commodityNum}}
                  </div>
                </li>
                <li class="two">                
                  <div class="contable" style="font-weight:bold;color:#d70917;font-size:17px;">
                    {{rere.commodityTotalPrice}}
                  </div>
                </li>
                <li class="three">
                  <div class="contable">
                    {{re.orderRemark}}
                  </div>
                </li>
                <li class="three">
                  <div class="contable" style="color:red;">
                    {{re.orderState}}
                  </div>
                </li>
              </ul>
           </div>
              <div class="tableright" style="color:#006cd9;">
                  <ul>
                    <li>
                      <router-link :to="'/Order/OrderCenter/'+re.orderId" style="color:#006cd9"  >
                        查看详情
                      </router-link>
                    </li>
                    <li @click="buyNow(re.commodityList)">再次购买</li>
                    <li @click="receiveConfirm(re.orderId)">确认收货</li>
                    <li @click="cancelOrder(re.orderId)">撤销订单</li>               
                  </ul>
            </div>   
          </div>  
        </div>

        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :page-size="pageSize" :current-page="pageNum"
            layout="total, prev, pager, next, jumper" background :total="dataSize">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectId: [],
      tokenFront: "",
      pageNum: 1, 
      pageSize: 3,
      dataSize: 0, //总条数
      orderId: "",
      loading: "", //加载遮罩
      formData: {}, //查询条件传值
      formInline: {
        orderNumber: "",
        orderDateStart: "",
        orderDateEnd: "",
        orderState: ""
      },
      checked: true,
      tableData: [],
      orderNumberList: [],
      commodityList: {},
      getOrderListUrl:
        "http://" + this.$store.state.url + "/front/orderCenter/getOrderList", //订单中心接口地址
      getupdateOrderStatusUrl:
        "http://" + this.$store.state.url + "/front/orderCenter/updateOrderStatus" //更新订单状态接口地址
    };
  },
  mounted: function() {
      this.tokenFront = sessionStorage.getItem("customertoken"),
      this.$nextTick(function() {
        this.getData();
      });
  },
  watch: {
    pageNum: function() {
      this.getData();
      console.log(this.pageNum);
    },
    pageSize: function() {
      this.getData();
      console.log(this.pageSize);
    }
  },
  methods: {
    //立即购买
    buyNow(item) {
      var list = [];
      for (var i = 0; i < item.length; i++) {
        list.push({
          commodityId: item[i].commodityId,
          commodityNum: item[i].commodityNum
        });
      }
      this.$router.push({
        path: "/Cart/SureCart",
        query: {
          commodityList: list
        }
      });
    },
    //选中
    select(data) {
      var index;
      for (let i = 0; i < this.orderNumberList.length; i++) {
        if (this.orderNumberList[i] == data) {
          index = i;
        }
      }
      if (index > 0 || index == 0) {
        this.orderNumberList.splice(index, 1);
      } else {
        this.orderNumberList.push(data);
      }
      console.log(this.orderNumberList);
    },
    //确认收货
    receiveConfirm(id) {
      var params = {
        orderNumberList: [(this.orderId = id)],
        orderState: "3",
        tokenFront: this.tokenFront
      }; 
      this.$axios.defaults.headers.common["token"] = this.tokenFront;
      this.$axios.put(this.getupdateOrderStatusUrl, params).then(res => {
        if (0 == res.data.code) {
          //修改成功
          this.getData();
          console.log("success");
          console.log(res);
          this.$message({
            type: "succe",
            message: "确认收货成功!"
          });
        } else if (2 == res.data.code) {
          alert("登录失效，请重新登陆");
          this.$router.push("/");
        } else {
          console.log("error submit!!");
          this.$message({
            showClose: true,
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //取消订单
    cancelOrder(id) {
      var params = {
        tokenFront:this.tokenFront,
        orderNumberList: [(this.orderId = id)],
        orderState: "4"
      };
      this.$axios.defaults.headers.common["token"] = this.tokenFront;
      this.$axios.put(this.getupdateOrderStatusUrl, params).then(res => {
        if (0 == res.data.code) {
          //修改成功
          console.log(res);
          console.log("success");
          this.getData();
          this.$message({
            type: "succe",
            message: "撤销订单成功!"
          });
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
    },
    //打开加载
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: "操作中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    //点击查询
    searchForm() {
      if (1 != this.pageNum) {
        this.pageNum = 1; //每次查询从第一页开始
      } else {
        this.getData();
        this.$message({
          showClose: true,
          message: "查询成功",
          type: "success"
        });
      }
    },
    handleSelectionChange(val) {
      this.pageSize = val;
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getData();
    },
    getData() {
      var list = [ ];
      this.openFullScreen(); //打开遮罩
      var params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        tokenFront: this.tokenFront,
        //订单信息
        orderNumber:"" == this.formInline.orderNumber ? null : this.formInline.orderNumber, 
        //订单开始日期
        orderDateStart: "" == this.formInline.orderDateStart ? null : this.formInline.orderDateStart, 
        //订单结束日期
        orderDateEnd: "" == this.formInline.orderDateEnd ? null : this.formInline.orderDateEnd, 
        //订单状态
        orderState: "" == this.formInline.orderState ? null : this.formInline.orderState 
      };
      console.log(this.tokenFront);
      this.$axios.defaults.headers.common["token"] = this.tokenFront;
      this.$axios.get(this.getOrderListUrl, { params }).then(res => {
      this.loading.close(); //关闭加载
        if (0 == res.data.code) {
          //查询成功
          console.log(res.data.data.list);
          this.tableData = res.data.data.list;
          this.dataSize = res.data.data.totalRecords;
          for (var i = 0; i < this.tableData.length; i++) {
            if (1 == this.tableData[i].orderState) {
              this.tableData[i].orderState = "未发货";
            } else if(2 == this.tableData[i].orderState){
              this.tableData[i].orderState = "已发货";
            }
          }
        } else if (2 == res.data.code) {
          alert("登录失效，请重新登陆");
          this.$router.push("/");
        } else {
          this.$message({
            showClose: true,
            message: "订单中心查询数据失败",
            type: "error"
          });
        }
      });
    },   
  }
};
</script>

<style>
.ordercenter .el-form--inline .el-form-item {
  display: inline-block;
  margin-right: 14px;
  vertical-align: top;
}

.ordercenter .el-checkbox__label {
  display: inline-block;
  padding-left: 10px;
  line-height: 19px;
  font-size: 17px;
}

.ordercenter .el-checkbox__inner {
  width: 16px;
  height: 16px;
}

.ordercenter .el-pagination {
  text-align: right;
}

.ordercenter .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #006cd9;
  color: #fff;
}
</style>

<style scoped>
.ordercenter {
  text-align: center;
}
.cut {
  width: 100%;
  height: 45px;
  line-height: 45px;
  background: white;
  text-align: left;
}
.cut p {
  margin-left: 24px;
}
.concenter {
  width: 957px;
  background: white;
  margin-top: 15px;
  padding: 20px;
}
.status {
  width: 917px;
  height: 75px;
  background-color: #f2f2f2;
  padding: 20px;
}
.status .statusform {
  text-align: right;
}
.status .but {
  color: #006cd9;
  background-color: white;
  border: 1px solid #006cd9;
  font-size: 13px;
  width: 80px;
}

.list {
  width: 957px;
  background-color: white;
  margin-top: 20px;
}
.list .liststatus {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: left;
  font-size: 16px;
}
.list .inlist {
  width: 100%;
  /* height: 230px; */
  border: 1px solid #e9e4e4;
  margin-top: 20px;
}
.list .liststatus .account {
  margin-left: 25px;
  margin-right: 45px;
}
.table {
  width: 100%;
  overflow: hidden;
  position: relative;
}
.list .table .fir {
  width: 310px;
  float: left;
  display: flex;
  align-items: center;
}

.list .table img {
  width: 80px;
  height: 80px;
}

.list .table .img {
  width: 80px;
  height: 80px;

  margin-left: 15px;
  border: 1px solid #e9e4e4;
  float: left;
}
.contable .des {
  margin-left: 10px;
}
.list .table .two {
  width: 100px;
  float: left;
  display: flex;
  align-items: center; /*定义body的元素垂直居中*/
}
.list .table .three {
  width: 115.63px;
  float: left;
  display: flex;
  align-items: center; /*定义body的元素垂直居中*/
}
.contable {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.contable li {
  height: 24px;
  line-height: 24px;
  color: #006cd9;
}
.block {
  margin-top: 30px;
}
.totaltitle {
  width: 100%;
  height: 40px;
}
.totaltitle ul > li {
  float: left;
}
.totaltitle .title {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  background-color: #f2f2f2;
  border-bottom: 2.5px solid #006cd9;
}
/* .tableleft{
  border-right:1px solid black;
} */
.tableleft li {
  height: 100px;
}
.tableright {
  width: 115.63px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 88%;
  font-size: 14px;
  transform: translateY(-50%);
}
.tableright li {
  height: 22px;
}
.leftul {
  overflow: hidden;
  margin: 10px 0;
}
</style>