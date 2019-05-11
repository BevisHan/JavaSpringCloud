<template>
  <!-- <div> style="height:550px;line-height:400px;text-align:center;font-size:40px;" -->
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="订单号">
        <el-input v-model="formInline.orderNumber"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-input v-model="formInline.orderState"></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <!-- <el-col :span="11">
          <el-date-picker type="date" value-forma="yyyy-MM-dd"  v-model="formInline.orderDateStart" @change="formatTime" style="width:100%;"placeholder="选择起始时间"></el-date-picker>
        </el-col>-->
        <el-col :span="11">
          <!-- <el-date-picker type="date"  v-model="formInline.orderDateEnd" value-forma="yyyy-MM-dd" style="width:100%;"></el-date-picker> -->
          <el-date-picker
            type="date"
            v-model="formInline.orderDateStart"
            @change="formatTime"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间"
            style="width:100%;"
          ></el-date-picker>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center;font-size:18px;">-</el-col>
        <!-- <el-col :span="11">
          <el-time-picker v-model="formInline.orderDateEnd" style="width: 100%;"></el-time-picker>
        </el-col>-->
        <el-col :span="11">
          <!-- <el-date-picker type="date"  v-model="formInline.orderDateEnd" value-forma="yyyy-MM-dd" style="width:100%;"></el-date-picker> -->
          <el-date-picker
            type="date"
            v-model="formInline.orderDateEnd"
            @change="formatTime1"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间"
            style="width:100%;"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="Reset"
          style="background:white;color:black;border-color:#E8E8E8;"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 查看详情 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline2">
      <el-form-item>
        <el-button type="primary" @click="ChaKan">查看详情</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="SendOrder">订单发货</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="list"
      border
      stripe
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="orderNumber" label="订单号" fixed="left" width="230"></el-table-column>
      <el-table-column prop="orderPrice" label="实际金额" width="200"></el-table-column>
      <el-table-column prop="customerName" label="下单人" width="200"></el-table-column>
      <el-table-column prop="orderState" label="订单状态" width="230"></el-table-column>
      <el-table-column prop="orderDate" label="订单时间"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecords"
        style="float:right;margin-top:20px;"
      ></el-pagination>
    </div>
    <el-dialog title="查看" :visible.sync="dialogFormVisible" class="ChaKan">
      <p class="Select">订单详情</p>
      <el-form :label-position="labelPosition" label-width="60px" :model="formLabelAlign">
        <el-form-item label="订单编号" style="width:47%;float:left;margin-right:5%;">
          <el-input v-model="selectList.orderNumber"></el-input>
        </el-form-item>
        <el-form-item label="下单人" style="width:47%;float:left;">
          <el-input v-model="selectList.customerName"></el-input>
        </el-form-item>
        <el-form-item label="订单日期" style="width:47%;float:left;margin-right:5%;">
          <el-input v-model="selectList.orderDate"></el-input>
        </el-form-item>
        <el-form-item label="收货人" style="width:47%;float:left;">
          <el-input v-model="selectList.receiveContact"></el-input>
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input v-text="selectList.orderAddress" class="bian"></el-input>
        </el-form-item>
        <el-form-item label="发货留言">
          <el-input v-text="selectList.orderRemark" class="bian"></el-input>
        </el-form-item>
        <!-- <el-form-item label="运费" style="width:40%;">
          <el-input v-model="selectList.yunfei"></el-input>
        </el-form-item>-->
      </el-form>
      <p class="Select">商品详情</p>
      <el-table :data="CommodityList" border stripe style="width: 100%;">
        <!-- <el-table-column type="selection" width="45"></el-table-column> -->
        <el-table-column prop="commodityFirstPicture" label="商品首图" fixed="left" width="120">
     <template slot-scope="scope">
                    <img :src="scope.row.commodityFirstPicture" width="70" height="70"/>
        </template>
        </el-table-column>
              <!-- <el-table-column prop="pictureAddress" label="商品首图" fixed="left" width="120">
     <template slot-scope="scope">
                    <img :src="scope.row.pictureAddress" width="70" height="70"/>
        </template> -->
        <el-table-column prop="commodityName" label="商品名称"></el-table-column>
        <el-table-column prop="commodityCode" label="商品编码" width="250"></el-table-column>
        <el-table-column prop="commodityPrice" label="单价" width="100"></el-table-column>
        <el-table-column prop="commodityNum" label="数量" width="100"></el-table-column>
        <el-table-column prop="commodityTotalPrice" label="小计" width="100"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" style="background:#45A0FA;color:white">关 闭</el-button>
        <!-- <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        region: "",
        type: ""
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      pageNum: 1,
      pageSize:5,
      totalRecords:1,
      selectNews: {},
      selectNews2: [],
      selectList: {},
      tokenBackend: "",

      SendOrdertList: {},
      list: [],
      CommodityList: [],
      formInline: {
        orderNumber: "",
        orderState: "",
        orderDateStart: "",
        orderDateEnd: ""
      },
      orderId: "",
      orderNumberList: [],
      getOrderUrl: this.$store.state.url + "/mall/backend/order/getOrders", //订单查询
        // getOrderUrl: "http://172.22.2.183:8088/backend/order/getOrders", //订单查询
      getOrderDetailUrl:
        this.$store.state.url + "/mall/backend/order/getOrderDetail", //订单详情
    //  getOrderDetailUrl:
        // "http://172.22.2.183:8088/backend/order/getOrderDetail", //订单详情
       
      getupdateOrderStatusUrl:
        this.$store.state.url + "/mall/backend/order/updateOrderStatus" //提交订单
      // getupdateOrderStatusUrl:
      //  "http://172.22.2.183:8088/backend/order/updateOrderStatus" //提交订单
    };
  },
  mounted() {
    this.tokenBackend = sessionStorage.getItem("customertoken");
    this.getData();
  },
  methods: {
//开始时间
formatTime(time) {
      this.formInline.orderDateStarte = time; //date是绑定的值
    },
//结束时间
formatTime1(time) {
      this.formInline.orderDateEnd = time;
    },
//打开遮罩
openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: "操作中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
//查询
onSubmit() {
      var a = Date.parse(this.formInline.orderDateStarte);
      var b = Date.parse(this.formInline.orderDateEnd); //格式化日期
      if (a > b) {
        this.$message({
          message: "日期不合法",
          type: "warning"
        });
      } //判断起始日期是否合法
      if (this.formInline.orderState == "已发货") {
        this.formInline.orderState = 2;
      } else if (this.formInline.orderState == "未发货") {
        this.formInline.orderState = 1;
      }
      var params = {
        tokenBackend: this.tokenBackend,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderNumber: this.formInline.orderNumber,
        orderState: this.formInline.orderState,
        orderDateStart: this.formInline.orderDateStart,
        orderDateEnd: this.formInline.orderDateEnd
      };
      this.$axios.defaults.headers.common["token"] = this.tokenBackend;
      this.$axios.get(this.getOrderUrl, { params }).then(res => {
        if (res.data.code == 4) {
          this.$message({
            message: "没有找到数据",
            type: "warning"
          });
        } else {
          this.list = res.data.data.list;
          var a = res.data.data.list;
          var i = 0;
          for (i = 0; i < a.length; i++) {
            if (a[i].orderState == 1) {
              a[i].orderState = "未发货";
            }
            if (a[i].orderState == 2) {
              a[i].orderState = "已发货";
            }
          }
        }
      });
      if (this.formInline.orderState == 2) {
        this.formInline.orderState = "已发货";
      } else if (this.formInline.orderState == 1) {
        this.formInline.orderState = "未发货";
      }
      if (1 != this.pageNum) {
        this.pageNum = 1; //每次查询从第一页开始
        this.getData();
      }
    }, 
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getData();
    },
//重置功能
 Reset() {
      this.formInline.orderNumber = "";
      this.formInline.orderState = "";
      this.formInline.orderDateStart = "";
      this.formInline.orderDateEnd = "";
      this.getData();
    }, 
//查看订单详情
 ChaKan() {
      var params = {
        tokenBackend: this.tokenBackend,
        orderId: this.orderId
      };
     console.log(this.orderId)
      this.$axios.defaults.headers.common["token"] = this.tokenBackend;
      this.$axios.get(this.getOrderDetailUrl, { params }).then(res => {
        console.log(res);
       
        if (res.data.code == 0) {
          this.selectList = res.data.data;
          this.CommodityList = res.data.data.commodityList;
        }
      });
      if (1 == this.selectNews2.length) {
        this.dialogFormVisible = true;
        this.selectList = this.selectNews;
      } else {
        this.$message({
          message: "一次只能查看一条数据",
          type: "warning"
        });
      }
    },
//订单发货
  SendOrder() {
      this.orderState = 2;
      var params = {
        tokenBackend: this.tokenBackend,
        orderState: this.orderState,
        orderNumberList: this.orderNumberList
      };
      this.$axios.defaults.headers.common["token"] = this.tokenBackend;
      this.$axios.put(this.getupdateOrderStatusUrl, params).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: "选中商品已发货",
            type: "warning"
          });
          this.getData();
        }
      });
    },
//判断是否选中一个
handleSelectionChange(val) {
      this.selectNews2 = [];
      this.selectNews = {};
      if (1 <val.length) {
        for (var i = 0; i < val.length; i++) {
          this.selectNews2.push(val[i].orderState);
          this.orderNumberList.push(val[i].orderNumber);
        }
      } else if (1 == val.length) {
        this.selectNews2.push(val[0].orderState);
        this.selectNews = val[0];
        this.orderNumberList.push(val[0].orderNumber);
        this.orderId = val[0].orderId;
      }
    },
//初始化列表，获取数据
getData(val) {
      var list = {
        orderNumber: this.formInline.orderNumber,
        orderState: this.formInline.orderState,
        orderDateStart: this.formInline.orderDateStart,
        orderDateEnd: this.formInline.orderDateEnd
      };
      this.openFullScreen();
      var params = {
        tokenBackend: this.tokenBackend,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      this.$axios.defaults.headers.common["token"] = this.tokenBackend;
      this.$axios.get(this.getOrderUrl, { params }).then(res => {
        this.loading.close(); //关闭加载
        if (0 == res.data.code) {
          this.list = res.data.data.list;
          this.totalRecords = res.data.data.totalRecords;
          var a = res.data.data.list;
          var i = 0;
          for (i = 0; i < a.length; i++) {
            if (a[i].orderState == 1) {
              a[i].orderState = "未发货";
            }
            if (a[i].orderState == 2) {
              a[i].orderState = "已发货";
            }
          }
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
        }
      });

      //   this.$axios.post(this.getDataUrl+'?pageSize='+this.pageSize+'&pageNum='+this.pageNum,params).then(res =>  {
      //   this.loading.close(); //关闭加载
      //   this.editInfoBefore={};
      //   this.selectId={};

      //  })
 }
  }
};
</script>
<style>
.el-input__inner {
  height: 32px;
}
.Select {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: #e6e6e6;
  box-sizing: border-box;
  padding-left: 10px;
  margin-bottom: 20px;
}
.ChaKan tr {
  height: 80px;
}
.el-dialog {
  position: relative;
  margin: 0 auto 50px;
  background: #fff;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  width: 1000px;
}
.el-table thead th,
.el-table thead tr {
  height: 50px;
}
.bian {
  width: 98.5%;
  text-indent: 13px;
  height: 30px;
  line-height: 30px;
  border-radius: 5px;
  border: 2px solid rgba(228, 230, 236, 0.5);
}

</style>

<style scoped>
</style>