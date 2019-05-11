<template>

    <div class="container">
       <div class="title">所有订单</div>
       <div class="content">
           <div class="shuR">
              <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline searchStyle">
                <el-row>
                  <div>
                    <el-form-item label="订单信息"  prop="orderNumber"> 
                      <el-input v-model="formInline.orderNumber" clearable style="width:180px;"></el-input>
                    </el-form-item>
                    <el-form-item label="订单状态"  prop="orderState"  class="inPut"  >
                    <el-select v-model="formInline.orderState" class="inputWidth" style="width:150px" >
                      <el-option label="已完成" value="1" style="padding-right:0px !important"></el-option>
                      <el-option label="未完成" value="0" style="padding-right:0px !important"></el-option>
                    </el-select>
              </el-form-item>
              <el-form-item label="日期" prop="data" class="dateedit">
                      <el-date-picker
                          v-model="formInline.orderDateStart"
                          type="date"
                          placeholder="选择日期" style="width:150px">
                      </el-date-picker>
                      &nbsp;&nbsp;- &nbsp;&nbsp;
                        <el-date-picker
                          v-model="formInline.orderDateEnd"
                          type="date"
                          placeholder="选择日期" style="width:150px">
                          </el-date-picker>
              </el-form-item> 
           </div>    
         <div class="suBmit">
        <el-form-item>
                <el-button type="primary" @click="searchorder">查询</el-button>
                </el-form-item>
        </div> 
        </el-row>
      </el-form>
          </div>

       <div class="table" v-for="item1 in table" :key="item1.shopId">
         <div class="title1">
            <!-- <input type="checkbox" :id="item.commodityCode" :checked="item.checked"> -->
            <tr>
                  <td><input type="checkbox" @click="select(item1.orderId)"></td>
            </tr>
            <div>{{item1.gmtCreate}}</div>
            <div>订单号：{{item1.orderId}}</div>
            <div>制单人：{{item1.customerName}}</div>
         </div>
          <div class="cbox" >
                    <table>
                        <tr>
                            <th class="line1" v-for="item in th" :key="item">{{item}}</th>
                        </tr>
                        <tr >
                          <td></td>
                            <td><img src="">{{item1.orderNumber}}</td>
                            <td>{{item1.orderPrice}}</td>
                            <td>{{item1.orderPrice}}</td>
                            <td>{{item1.orderPrice}}</td>
                            <td>{{item1.orderRemark}}</td>
                            <td>{{item1.orderState}}</td>
                            <td>
                              <a href="#" class="caoZuo">查看详情</a><br>
                              <a href="#" class="caoZuo">再次购买</a>
                            </td>
                      </tr>
                  </table>
          </div>
      </div>


      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dataSize"
          class="paGe">
        </el-pagination>
      </div>
    <div class="anNiu">
      <el-button type="primary" @click="sure">确认收货</el-button>
      <el-button type="warning" @click="del">撤销订单</el-button>
      </div>
    </div>
      
    <div class="kong"></div>

      
  </div>

</template>

<script>
export default {
  data() {
    return {
      formInline:{
        orderNumber:'',
        orderDateStart:'',
        orderDateEnd:'',
        orderState:'',
      },
      th:['','商品','单价','数量','总价','备注','状态','操作'],
      table:[{
          
      }],
      pageNum: 1,
      pageSize: 10,
      dataSize: 0, //总条数
      getDataUrl:this.$store.state.url+'/front/orderCenter/getOrderList',//查询
      selectId:[],
      getOrderStateurl:this.$store.state.url+'/front/orderCenter/updateOrderStatus',
    }
  },
  methods: {
      getData() {
        var list=[{
          orderId:'1',
          orderNumber:'1',
          orderPrice:'100',
          orderState:'1',
          customerId:'1',
          customerName:'123',
          gmtCreate:'2019-01-02',
          orderDate:'2019-01-02',
          orderAddress:'12333',
          receiveTel:'12232133',
          receiveContact:'123',
          orderRemark:'无',
          version:'1'
        },
        {
          orderId:'2',
          orderNumber:'1',
          orderPrice:'100',
          orderState:'1',
          customerId:'1',
          customerName:'123',
          gmtCreate:'2019-01-02',
          orderDate:'2019-01-02',
          orderAddress:'12333',
          receiveTel:'12232133',
          receiveContact:'123',
          orderRemark:'无',
          version:'1'
        }]
         this.table=list;
         for(var i=0;i<this.table.length;i++){
              if(0==this.table[i].orderState){
                  this.table[i].orderState='未发货'
              }else{
                  this.table[i].orderState='已完成'
              }
          }
        return;
        //this.openFullScreen();//打开遮罩
        var params = new URLSearchParams();
        params.append('orderNumber', this.formInline.orderNumber);
        params.append('orderDateStart', this.formInline.orderDateStart);
        params.append('orderDateEnd', this.formInline.orderDateEnd);
        params.append('orderState', this.formInline.orderState);
        params.append('customerId', '1');
        this.$axios.get(this.getDataUrl+'?pageSize='+this.pageSize+'&pageNum='+this.pageNum,params).then(res =>  {
        //this.loading.close(); //关闭加载
        if(0==res.code){//查询成功
          console.log(res.data.list)
          this.table=res.data.list;
          for(var i=0;i<this.table.length;i++){
              if(0==this.table[i].orderState){
                  this.table[i].orderState='未发货'
              }else{
                  this.table[i].orderState='已完成'
              }
          }
          this.dataSize=res.data.totalRecords;
        }else{
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          });
        }
        })
    },
    //每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      //this.getData();
    },
    //第几页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getData();      
    },
    //搜索
    searchorder(){
      console.log(this.formInline.orderNumber);
      console.log(this.formInline.orderDateStart);
      console.log(this.formInline.orderDateEnd);
      console.log(this.formInline.orderState);
        if(1!=this.pageNum){
          this.pageNum=1;//每次查询从第一页开始
        }else{
          this.getData();
        }
    },
    //选中
    select(data){
      var index;
      for(let i=0;i<this.selectId.length;i++){
        if(this.selectId[i]==data){
          index=i;
        }
      }
      if(index>0||index==0){
          this.selectId.splice(index,1);
      }else{
          this.selectId.push(data);
      }
      console.log(this.selectId);
    },
    //确认收货
    sure(){            
    var params = new URLSearchParams();
    params.append('orderNumberList',this.selectId);
    params.append('orderState','3');
    this.$axios.put(this.getOrderStateurl,params).then(res =>  {
    if(0==res.code){//查询成功
      this.getData();
    }else{
      this.$message({
          showClose: true,
          message: res.msg,
          type: 'error'
        });
    }
    })
},
//撤销订单
del(){
   var params = new URLSearchParams();
    params.append('orderNumberList',this.selectId);
    params.append('orderState','4');
    this.$axios.put(this.getOrderStateurl,params).then(res =>  {
    if(0==res.code){//查询成功
      this.getData();
    }else{
      this.$message({
          showClose: true,
          message: res.msg,
          type: 'error'
        });
    }
    })

}
  },
  watch: {
    pageNum: function (){
      this.getData();
      console.log(this.pageNum);
      },
    pageSize: function (){
      this.getData();
      console.log(this.pageSize);
    },
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getData();//获取页面表格
     // this.getButton();//获取页面按钮
    })
  },
    
};
</script>
<style scoped>
@import "../../static/css/classificationOfGoods.css";
.title{
  background-color: white;
  margin-left: 230px;
  line-height: 40px;
  padding-left: 10px;
  height: 40px;
  font-size: 15px;
  margin-bottom: 20px;
}
.content{
  background-color: white;
  margin-left: 230px;
  padding: 20px;
}
.input{
  width: 100px;
} 
.shuR{
  background-color: #f2f2f2;
  padding:20px ;
  margin-bottom: 20px;
}
.table{
  margin-bottom: 20px;
  border: 1px solid #f2f2f2;
}
.kong{
  background-color: #f2f2f2;
  height: 20px;
}
.cbox{
    width: 100%;
    margin-top: 20px;
}
.cbox table{
    width: 100%;
    border-spacing: 0px;
}
.cbox tr{
    width: 100%;
}
.cbox tr th{
    width: 5%;
    height: 40px;
    font-size: 15px;
    line-height: 40px;
}
.cbox tr th:nth-child(1){
    width: 2%;
    text-align: center;
}
.cbox tr th:nth-child(2){
    width: 15%;
    text-align: left;
    padding-left: 25px;
}
.cbox img{
    border: 1px solid #f4f4f4;
    width: 75px;
    height: 75px;
    margin-right: 30px;
}
.cbox td{
    height: 126px;
    text-align: center;
    font-size: 14px;
}
.cbox td:nth-child(4){
    padding-left: 22px;
    
}
.cbox td:nth-child(4) div{
    height: 22px;
    width: 30px;
    background: #eeeeee;
    float: left;
}
.cbox td:nth-child(4) div:nth-child(2){
    height: 20px;
    width: 40px;
    background: none;
    float: left;
    border: 1px solid #f2f2f2;
}
.cbox td:nth-child(2){
    height: 126px;
    text-align: left;
}
.cbox td:nth-child(3){
    font-size: 12px;
    color: #9a928a;    
}
.cbox tr td:nth-last-child(3){
    font-size: 15px;
    color: #9a928a;
    font-weight: bold;
}
.cbox tr td:nth-last-child(2){
    color: red;
    font-size: 17px;
    font-weight: bold;
}
.cbox tr td:last-child{
    height: 126px;
    text-align: center;
    color: red;
}
.title1>div{
  float: left;
  height: 40px;
  width: 180px;
   line-height: 40px;
}
.title1>tr{
  float: left;
  height: 20px;
  margin-top: 15px;
  margin-left: 10px;
  margin-right: 5px;
}
.line1{
  background-color: #f2f2f2;
  margin-top: 0px;
}
.caoZuo{
  color: #579be4;
  font-size: 13px;
}
.block{
  margin-left: 380px;
}
.el-form-item__content{
  width: 100px !important;
}
.inPut>.el-form-item__content{
   width: 10px;
}
.dateedit>.el-form-item__content>.el-date-editor{
  width: 120px;
}
.suBmit{
  float: right;
}
.el-button--primary{
  color: #1f77d0;
  background-color: white;
  border: 1px solid #1f77d0;
}
.suBmit>.el-form-item{
    margin-bottom: 0;
}
.el-row{
  height: 100px;
}
inPut>.el-form-item__content>.el-select>.el-input>.el-input__suffix{
  top:20px !important;
}
.anNiu{
margin-top: 30px;
  margin-left: 700px;
}
</style>
<style>
.inPut .el-input__suffix{
  margin-top: 15px;
}
.paGe .el-input__suffix{
  margin-top: 3px;
}
</style>
