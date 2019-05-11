<template>
  <div class="accNum">

    <div>
      <el-form :inline="true" ref="formSelect" :model="formSelect" label-width="60px"
        class="demo-form-inline searchStyle">
        <el-form-item label="客户账号" prop="accountNum">
          <el-input v-model="formSelect.accountNum" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="formSelect.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formSelect.status" style="width:150px">
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" style="margin-left: 15px;" @click="selectAccountNumBefore()">查询</el-button>
        <el-button @click="resetSelect('formSelect')">重置</el-button>
        <div style="clear:both"></div>
      </el-form>

      <div class="groupbtn">
        <el-button type="primary" icon="el-icon-plus" @click="dialogAddVisible = true">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="editAccNum()">修改</el-button>
        <el-button type="primary" icon="el-icon-setting" @click="statusOpen()">启用</el-button>
        <el-button type="primary" icon="el-icon-setting" @click="statusClose()">禁用</el-button>
      </div>

      <el-table :data="tableData" border stripe @select="chooseOne" @select-all="chooseAll" style="width: 100%">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column prop="customerNumber" label="账号" width="250">
        </el-table-column>
        <el-table-column prop="customerName" label="用户名" width="250">
        </el-table-column>
        <el-table-column prop="customerIsUsed" label="启用/禁用" :formatter="formatStatus">
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
        :page-sizes="[10,15,20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="dataSize">
      </el-pagination>

      <!-- 新增模态框 -->
      <el-dialog title="新增账号" :visible.sync="dialogAddVisible" :close-on-click-modal="false" width="530px"
        :before-close="cancelDialog">
        <el-form :model="formAdd" :rules="rulesAdd" ref="formAdd">
          <el-form-item label="账号" :label-width="formLabelWidth" prop="accountNum">
            <el-input v-model="formAdd.accountNum" clearable auto-complete="off" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formAdd.name" clearable auto-complete="off" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
            <el-input type="password" v-model="formAdd.password" clearable auto-complete="off" style="width:300px">
            </el-input>
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
            <el-select v-model="formAdd.status" style="width:150px">
              <el-option label="启用" value="0" selected></el-option>
              <el-option label="禁用" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog()">取 消</el-button>
          <el-button type="primary" @click="addSure('formAdd')">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改模态框 -->
      <el-dialog title="修改账号" :visible.sync="dialogEditVisible" :close-on-click-modal="false" width="530px"
        :before-close="cancelDialog">
        <el-form :model="formEdit" :rules="rulesEdit" ref="formEdit">
          <!-- <el-form-item label="账号" :label-width="formLabelWidth" prop="accountNum">
            <el-input v-model="formEdit.accountNum" clearable auto-complete="off" style="width:300px"></el-input>
          </el-form-item> -->
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="customerName">
            <el-input v-model="formEdit.customerName" clearable auto-complete="off" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
            <el-select v-model="formEdit.customerIsUsed" style="width:150px">
              <el-option label="启用" value="0"></el-option>
              <el-option label="禁用" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog()">取 消</el-button>
          <el-button type="primary" @click="editSure('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      //表单验证
      var validate1 = (rule, value, callback) => {
        if (value.replace(/(^\s*)|(\s*$)/g, "") === '') {//前后去空格
          callback(new Error('请输入账号'));
        } else {
          callback();
        }
      };
      var validate2 = (rule, value, callback) => {
        if (value.replace(/(^\s*)|(\s*$)/g, "") === '') {//前后去空格
          callback(new Error('请输入用户名'));
        } else {
          callback();
        }
      };
      var validate3 = (rule, value, callback) => {
        if (value.replace(/(^\s*)|(\s*$)/g, "") === '') {//前后去空格
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };


      return {
        //搜索的数据
        formSelect: {
          id: '',
          accountNum: '',
          name: '',
          status: ''
        },
        tableData: [],        //表格的数据
        pageNum: 1,
        pageSize: 10,
        dataSize: 0,
        dialogAddVisible: false,    //新增模态框
        dialogEditVisible: false,   //修改模态框
        dialogStatusOpenVisible: false,  //状态修改确认框
        dialogStatusCloseVisible: false,
        formLabelWidth: '120px',

        tokenBackend: '',
        //增加模态框数据
        formAdd: {
          accountNum: '',
          name: '',
          password: '',
          status: ''
        },
        formEdit: {},       //修改模态框数据
        formEditBefore: {},    //修改前的值 取消修改用
        selectId: [],       //选中的id

        //表单验证
        rulesAdd: {
          accountNum: [
            { required: true, validator: validate1, trigger: 'blur' },
          ],
          name: [
            { required: true, validator: validate2, trigger: 'blur' },
          ],
          password: [
            { required: true, validator: validate3, trigger: 'blur' },
          ],
          status: [
            { required: true,  trigger: 'blur' },
          ]
        },
        rulesEdit: {
          customerName:[
            { required: true, validator: validate2, trigger: 'blur' },
          ],
          customerIsUsed:[
            { required: true,  trigger: 'blur' },
          ]
        },

        getDataUrl: 'http://39.105.73.110:8082/backend/customer/getCustomerList',  //获取客户列表
        addUrl: 'http://39.105.73.110:8082/backend/customer/addCustomer',  //新增客户
        editUrl: 'http://39.105.73.110:8082/backend/customer/updateAccount',   //修改客户信息
        statusUrl: 'http://39.105.73.110:8082/backend/customer/updateAccountByStatus',   //状态修改
      }
    },

    mounted() {
      this.$nextTick(function () {
        this.tokenBackend=sessionStorage.getItem('customertoken');
        this.getData();//获取页面表格
      })
    },

    methods: {
      //打开加载
      openFullScreen() {
        this.loading = this.$loading({
          lock: true,
          text: '操作中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      },
      //表格状态格式化 0：启用  1：禁用
      formatStatus: function (row, column) {
        return row.customerIsUsed == 0 ? '启用' : '禁用'
      },
      //获取表格数据
      getData() {
        this.$axios.defaults.headers.common['token']=this.tokenBackend;
        this.$axios.get(this.getDataUrl+'?pageNum='+this.pageNum+'&pageSize='+this.pageSize+'&tokenBackend='+this.tokenBackend).then(res =>  {
          this.formEditBefore = {};
          this.selectId = {};
          if (0 == res.data.code) {//查询成功
            this.tableData = res.data.data.list;
            this.dataSize = res.data.data.totalRecords;
          } else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error'
            });
          }
        })
      },
      //选中
      chooseOne(val) {
        var accoutNumCode = [];
        for (var i = 0; i < val.length; i++) {
          accoutNumCode.push(val[i].accoutNumCode)
        }
        this.delNum = accoutNumCode.length;
        this.selectId = accoutNumCode;//将选中的id存起来
        if (1 == val.length) {//选中一条时将选中的值存起来 否则清空待修改
          this.formEditBefore = JSON.parse(JSON.stringify(val[0]));
        } else {
          this.formEdit = {};
          this.formEditBefore = {};
        }
      },
      //选中所有
      chooseAll(val) {
        var accoutNumCode = [];
        for (var i = 0; i < val.length; i++) {
          accoutNumCode.push(val[i].accoutNumCode)
        }
        this.delNum = accoutNumCode.length;
        this.selectId = accoutNumCode;//将选中的id存起来
        this.formEdit = {};
        this.formEditBefore = {};
      },

      //每条页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.selectAccountNum();
        
      },
      //第几页
      handleCurrentChange(val) {
        this.pageNum = val;
        this.selectAccountNum();
      },

      selectAccountNumBefore(){
        this.pageNum=1;
        this.selectAccountNum();
      },
      //查询    
      selectAccountNum() {        
        var params='?customerIsUsed='+this.formSelect.status+'&customerNumber='+this.formSelect.accountNum+'&customerName='+this.formSelect.name;
        if(this.formSelect.status == ""){
          params='?customerNumber='+this.formSelect.accountNum+'&customerName='+this.formSelect.name;
          if(this.formSelect.name == ""){
            params='?customerNumber='+this.formSelect.accountNum;
            if(this.formSelect.accountNum == ""){
              params="";
            }
          }
          else if(this.formSelect.accountNum == ""){
            params='?customerName='+this.formSelect.name;
          }
        }
        else if(this.formSelect.name == ""){
          params='?customerIsUsed='+this.formSelect.status+'&customerNumber='+this.formSelect.accountNum;
          if(this.formSelect.accountNum == ""){
            params='?customerIsUsed='+this.formSelect.status;
          }
        }
        else if(this.formSelect.customerNumber == ""){
          params='?customerIsUsed='+this.formSelect.status+'&customerName='+this.formSelect.name;
        }
        
        if(params == ""){
          params=params+'?pageNum='+this.pageNum+'&pageSize='+this.pageSize;
        }else{
          params=params+'&pageNum='+this.pageNum+'&pageSize='+this.pageSize;
        }
        this.openFullScreen();//打开遮罩
        this.$axios.defaults.headers.common['token']=this.tokenBackend;
        this.$axios.get(this.getDataUrl+params+'&tokenBackend='+this.tokenBackend).then(res => {
          this.loading.close(); //关闭加载
          if(res.data.code==0){
            this.tableData = res.data.data.list;
            this.dataSize = res.data.data.totalRecords;
          }else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error'
            });
          }
        })
      },
      //重置查询域
      resetSelect(formSelect) {
        this.$refs[formSelect].resetFields();
      },

      //取消新增，修改,状态后表单数据重置清空
      cancelDialog() {
        this.dialogAddVisible = false;
        this.dialogEditVisible = false;
        this.dialogStatusOpenVisible = false;
        this.dialogStatusCloseVisible = false;
        if (this.$refs['formAdd']) {//清空表单
          this.$refs['formAdd'].resetFields();
        }
        if (this.$refs['formEdit']) {//清空表单
          this.$refs['formEdit'].resetFields();
        }
      },
      //确认新增
      addSure(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params=new URLSearchParams();
            params.append('customerNumber',this.formAdd.accountNum);
            params.append('customerName',this.formAdd.name);
            params.append('customerPassword',this.formAdd.password);
            params.append('customerIsUsed',this.formAdd.status);
            params.append('tokenBackend',this.tokenBackend);
            this.$axios.defaults.headers.common['token']=this.tokenBackend;
            this.openFullScreen();//打开遮罩
            this.$axios.post(this.addUrl, params).then(res => {
              this.loading.close(); //关闭加载
              if (0 == res.data.code) {//新增成功
                this.getData();
                this.$message({
                  showClose: true,
                  message: '新增用户成功',
                  type: 'success'
                });
                this.$refs[formName].resetFields();
                this.$refs[formName].clearValidate();  //清除表单验证
                this.dialogAddVisible = false;//隐藏dialo  
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'error'
                });
              }
            })
          } else {
            return false;
          }
        });
      },
      //修改账号页
      editAccNum() {
        if (this.formEditBefore) {
          if (undefined != this.formEditBefore.customerNumber) {
            this.dialogEditVisible = true;
            this.formEdit = JSON.parse(JSON.stringify(this.formEditBefore));
            if(typeof(this.formEdit.customerIsUsed) == "number"){      //判断customerIsUsed是否为number类型，是则转换成string类型
              this.formEdit.customerIsUsed=this.formEdit.customerIsUsed+"";
            }            
            // console.log(this.formEdit)
          } else {
            this.$message({
              showClose: true,
              message: "请选择一条数据进行修改",
              type: 'error'
            });
          }
        } else {
          this.$message({
            showClose: true,
            message: "请选择一条数据进行修改",
            type: 'error'
          });
        }
      },
      //确认修改
      editSure(formName) {        
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params=new URLSearchParams();
            params.append('version',this.formEdit.version);
            params.append('customerName',this.formEdit.customerName);
            params.append('customerId',this.formEdit.customerId);
            params.append('customerIsUsed',this.formEdit.customerIsUsed);
            params.append('tokenBackend',this.tokenBackend);
            this.$axios.defaults.headers.common['token']=this.tokenBackend;
            this.openFullScreen();//打开遮罩
            this.$axios.put(this.editUrl, params).then(res => {
              this.loading.close(); //关闭加载
              if (0 == res.data.code) {//修改成功
                this.getData();
                this.$message({
                  showClose: true,
                  message: '修改用户成功',
                  type: 'success'
                });
                this.dialogEditVisible = false;//隐藏dialo 
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'error'
                });
              }
            })
          } else {
            return false;
          }
        });
      },

      //状态启用确认页面
      statusOpen() {
        if(undefined != this.formEditBefore.customerNumber){
          if (this.formEditBefore.customerIsUsed == '0') {
            this.$message({
              showClose: true,
              message: "当前账号状态已是启用",
              type: 'error'
            });
          }
          else {
            this.$confirm('此操作将修改该账号的状态为启用, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var params=new URLSearchParams();
              params.append('customerId',this.formEditBefore.customerId);
              params.append('customerIsUsed','0');
              params.append('tokenBackend',this.tokenBackend);
              this.$axios.defaults.headers.common['token']=this.tokenBackend;
              this.openFullScreen();//打开遮罩
              this.$axios.put(this.statusUrl, params).then(res => {
                this.loading.close(); //关闭加载 
                if (0 == res.data.code) {//修改成功
                  this.getData();
                  this.$message({
                    showClose: true,
                    message: '成功修改状态为启用',
                    type: 'success'
                  });
                  this.dialogStatusOpenVisible = false;//隐藏dialo 
                } else {
                  this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: 'error'
                  });
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消状态修改'
              });
            });
          }
        }else{
          this.$message({
            showClose: true,
            message: "请选择一条数据进行修改",
            type: 'error'
          });
        }
      },
      //状态禁用确认页面
      statusClose() {
        if(undefined != this.formEditBefore.customerNumber){
          if (this.formEditBefore.customerIsUsed == '1') {
            this.$message({
              showClose: true,
              message: "当前账号状态已是禁用",
              type: 'error'
            });
          }
          else {
            this.$confirm('此操作将修改该账号的状态为禁用, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var params=new URLSearchParams();
              params.append('customerId',this.formEditBefore.customerId);
              params.append('customerIsUsed','1');
              params.append('tokenBackend',this.tokenBackend);
              this.$axios.defaults.headers.common['token']=this.tokenBackend;
              this.openFullScreen();//打开遮罩
              this.$axios.put(this.statusUrl, params ).then(res => {
                this.loading.close(); //关闭加载
                if (0 == res.data.code) {//修改成功
                  this.getData();
                  this.$message({
                    showClose: true,
                    message: '成功修改状态为禁用',
                    type: 'success'
                  });
                  this.dialogStatusOpenVisible = false;//隐藏dialo 
                } else {
                  this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: 'error'
                  });
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消状态修改'
              });
            });
          }
        }else{
          this.$message({
            showClose: true,
            message: "请选择一条数据进行修改",
            type: 'error'
          });
        }
      },
    },

  }
</script>
<style>
  .accNum .el-input__inner {
    height: 32px;
  }

  .accNum .searchStyle .el-form-item__label {
    line-height: 40px;
  }

  .accNum .searchStyle .el-button {
    margin-top: 5px;
  }

  .accNum .groupbtn {
    margin-bottom: 20px;
  }

  .accNum .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: rgb(236, 245, 255);
  }

  .accNum .el-table__header tr,
  .accNum .el-table__header th {
    padding: 0;
    height: 45px;
  }

  .accNum .el-pagination {
    float: right;
    margin-top: 20px;
  }

  .accNum .el-dialog {
    width: 35%;
  }
</style>