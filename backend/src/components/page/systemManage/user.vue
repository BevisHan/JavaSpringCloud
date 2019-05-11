<template>
  <div class="userPage">
    <div>
      <el-form :inline="true" :model="formInline" ref="formInline" label-width="60px"
        class="demo-form-inline searchStyle">
        <el-form-item label="用户账号" prop="userAccount">
          <!--prop 重置时用到  -->
          <el-input v-model="formInline.userAccount" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="userName">
          <el-input v-model="formInline.userName" style="width:180px" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" >
          <el-select v-model="formInline.sex" style="width:150px">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFormBefore()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('formInline')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="handle-box">
      <el-button type="primary" icon="el-icon-plus" @click="addUser('addInfo')">用户新增</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="editNews()">修改信息</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="editPassword('editPwd')">修改密码</el-button>
      <el-button type="primary" icon="el-icon-delete" @click="delUser()">删除用户</el-button>
    </div>
    <el-table :data="tableData" border stripe @select="chooseOne" @select-all="chooseAll" style="width: 100%">
      <!--  ref="multipleTable" -->
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="userAccount" label="用户号" fixed="left" sortable width="140">
      </el-table-column>
      <el-table-column prop="userName" label="用户姓名" fixed="left" sortable width="140">
      </el-table-column>
      <el-table-column prop="userIdNumber" label="身份证号码" width="160">
      </el-table-column>
      <el-table-column prop="userGender" label="性别" width="70" :formatter="formatSex">
      </el-table-column>
      <el-table-column prop="userIsUsed" label="是否使用" width="80" :formatter="formatStatus">
      </el-table-column>
      <el-table-column prop="userTel" label="手机号码" width="120">
      </el-table-column>
      <el-table-column prop="userEmail" label="电子邮件" width="150">
      </el-table-column>
      <el-table-column prop="userComments" label="备注">
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
        :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="dataSize">
      </el-pagination>
    </div>

    <!-- 新增用户模态框 -->
    <el-dialog width="52%" title="新增用户" :visible.sync="dialogAdd" :close-on-click-modal="false" class="userDialog">
      <el-form :model="addInfo" label-width="100px" :rules="rules" ref="addInfo" :inline="true"
        :label-position="'right'">
        <el-form-item label="用户账号" prop="userAcct">
          <el-input v-model="addInfo.userAcct" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="userName">
          <el-input v-model="addInfo.userName" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCard">
          <el-input v-model="addInfo.idCard" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addInfo.phone" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="addInfo.email" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="addInfo.sex" class="inputWidth">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="addInfo.remark" clearable style="width:400px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="addSure('addInfo')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户模态框 -->
    <el-dialog width="52%" title="修改用户" :visible.sync="dialogEdit" :close-on-click-modal="false" class="userDialog"
      :before-close="cancelDialog">
      <el-form :model="editInfo" label-width="100px" :rules="rules3" ref="editInfo" :inline="true"
        :label-position="'right'">
        <el-form-item label="用户账号" prop="userAccount">
          <el-input v-model="editInfo.userAccount" clearable disabled class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="userName">
          <el-input v-model="editInfo.userName" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="userIdNumber">
          <el-input v-model="editInfo.userIdNumber" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="用户状态" prop="userIsUsed">
          <el-select v-model="editInfo.userIsUsed" class="inputWidth">
            <el-option label="使用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="userTel">
          <el-input v-model="editInfo.userTel" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="userEmail">
          <el-input v-model="editInfo.userEmail" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="userGender">
          <el-select v-model="editInfo.userGender" class="inputWidth">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="userComments">
          <el-input type="textarea" v-model="editInfo.userComments" clearable style="width:400px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="editSure('editInfo')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改密码模态框 -->
    <el-dialog title="修改密码" :visible.sync="dialogPwdEdit" width="30%" :close-on-click-modal="false"
      class="changePassword" :before-close="cancelDialog">
      <el-form :model="editPwd" :rules="rules2" ref="editPwd" label-width="100px" :label-position="'right'">
        <el-form-item label="新密码" prop="passWord">
          <el-input type="password" v-model="editPwd.passWord" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passWordCheck">
          <el-input type="password" v-model="editPwd.passWordCheck" clearable class="inputWidth"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="editPwdSure('editPwd')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      //表单验证
      //用户名
      var validateName = (rule, value, callback) => {
        if (value.replace(/(^\s*)|(\s*$)/g, "") === '') {//前后去空格
          callback(new Error('请输入用户名称'));
        } else {
          callback();
        }
      };
      //账号
      var validateNum = (rule, value, callback) => {
        if (value.replace(/(^\s*)|(\s*$)/g, "") === '') {//前后去空格
          callback(new Error('请输入用户账号'));
        } else {
          callback();
        }
      };
      //密码
      var validatePassWord = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.editPwd.passWordCheck !== '') {
            this.$refs.editPwd.validateField('passWordCheck');
          }
          callback();
        }
      };
      //密码确认
      var validatePassWordCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.editPwd.passWord) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        loading: '',//加载遮罩
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dataSize: 0, //总条数
        tableData: [],
        pageNum: 1,
        pageSize: 5,
        menuButtonList: [],//菜单按钮列表
        formData: {},//查询条件传值
        dialogAdd: false,//新增框默认隐藏
        dialogEdit: false,//修改框默认隐藏
        dialogPwdEdit: false,//修改密码框默认隐藏

        tokenBackend: '',

        getDataUrl: 'http://39.105.73.110:8081/backend/user/listUsers',//查询
        getUserByUserCodeUrl: 'http://39.105.73.110:8081/webauth/user/getUserByUserCode',//修改获取用户信息
        addUrl: 'http://39.105.73.110:8081/backend/user/saveUser',//新增
        editUrl: 'http://39.105.73.110:8081/backend/user/updateUser',//修改
        editPwdUrl: 'http://39.105.73.110:8081/backend/user/updatePwd',//修改密码
        delUrl: 'http://39.105.73.110:8081/backend/user/deleteUser',//删除


        formInline: {//快捷查询
          userAccount: '',
          userName: '',
          sex: ''
        },
        addInfo: {
          userAcct: '',//用户登陆账号
          userName: '',
          idCard: '',
          sex: '',//0女1男
          phone: '',
          email: '',
          remark: ''
        },
        selectId: [],//选中的id
        editInfo: {},//待修改的参数
        editInfoBefore: {},//修改前的值 取消修改用
        editPwd: {       //修改密码
          passWord: '',
          passWordCheck: '',
        },
        rules: {        //添加表单验证
          userAcct: [
            { required: true, validator: validateNum, trigger: 'blur' },
          ],
          userName: [
            { required: true, validator: validateName, trigger: 'blur' },
          ],
          idCard: [//身份证验证
            { required: true, pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, message: '证件号码格式有误！', trigger: 'blur' }
          ],
          phone: [//手机号码
            { required: true, pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          email: [//电子邮箱
            { required: true, pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/, message: '请输入正确电子邮箱', trigger: 'blur' }
          ],
          remark: [//备注无需验证 写在此处是为了打开tialog时能统一清空表单
            { required: true, min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
          ],
          sex: [
            { required: true,trigger: 'blur' }
          ]
        },
        rules3: {        //修改表单验证
          userAccount: [
            { required: true, validator: validateNum, trigger: 'blur' },
            { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
          ],
          userName: [
            { required: true, validator: validateName, trigger: 'blur' },
            { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
          ],
          userIdNumber: [//身份证验证
            { required: true, pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, message: '证件号码格式有误！', trigger: 'blur' }
          ],
          userTel: [//手机号码
            { required: true, pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          userEmail: [//电子邮箱
            { required: true, pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/, message: '请输入正确电子邮箱', trigger: 'blur' }
          ],
          userComments: [//备注无需验证 写在此处是为了打开tialog时能统一清空表单
            { required: true, min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
          ],
          userGender: [
            { required: true,trigger: 'blur' }
          ],
          userIsUsed: [
            { required: true,trigger: 'blur' }
          ]
        },
        rules2: {//修改密码
          passWord: [
            { required: true, validator: validatePassWord, trigger: 'blur' }
          ],
          passWordCheck: [
            { required: true, validator: validatePassWordCheck, trigger: 'blur' }
          ],
        }
      };
    },
    mounted: function () {
      this.$nextTick(function () {

        this.tokenBackend = sessionStorage.getItem('customertoken');
        console.log(this.tokenBackend);
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
      //表格性别格式化 0：女  1：男
      formatSex: function (row, column) {
        return row.userGender == 1 ? '男' : '女'
      },
      //表格状态格式化 0：禁用  1：使用
      formatStatus: function (row, column) {
        return row.userIsUsed == 1 ? '使用' : '禁用'
      },

      //查询按钮按下
      searchFormBefore(){
        this.pageNum=1;
        this.searchForm();
      },
      //查询    
      searchForm() {
        var params='?userName'+this.formInline.userName+'&userAccount='+this.formInline.userAccount+'&userGender='+this.formInline.sex;
        if(this.formInline.sex == ""){
          params='?userAccount='+this.formInline.userAccount+'&userName='+this.formInline.userName;
          if(this.formInline.userName == ""){
            params='?userAccount='+this.formInline.userAccount;
            if(this.formInline.userAccount == ""){
              params="";
            }
          }
          else if(this.formInline.userAccount == ""){
            params='?userName='+this.formInline.userName;
          }
        }
        else if(this.formInline.userName == ""){
          params='?userGender='+this.formInline.sex+'&userAccount='+this.formInline.userAccount;
          if(this.formInline.userAccount == ""){
            params='?userGender='+this.formInline.sex;
          }
        }
        else if(this.formInline.userAccount == ""){
          params='?userGender='+this.formInline.sex+'&userName='+this.formInline.userName;
        }
        
        if(params == ""){
          params=params+'?pageNum='+this.pageNum+'&pageSize='+this.pageSize;
        }else{
          params=params+'&pageNum='+this.pageNum+'&pageSize='+this.pageSize;
        }
        // console.log(params);

        this.$axios.defaults.headers.common['token']=this.tokenBackend;
        this.$axios.get(this.getDataUrl+params+'&tokenBackend='+this.tokenBackend).then(res => {
          if(res.data.code==0){
            this.tableData = res.data.data.list;
            this.dataSize = res.data.data.totalRecords;
          }else{
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error'
            });
          }
        })
      },

      //重置查询域
      resetForm(formInline) {
        this.$refs[formInline].resetFields();
      },
      //用户新增   
      addUser(addInfo) {
        this.dialogAdd = true;
        if (this.$refs[addInfo]) {//清空表单
          this.$refs[addInfo].resetFields();
        }
      },
      //确认新增
      addSure(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = new URLSearchParams();
            params.append('userAccount', this.addInfo.userAcct);
            params.append('userName', this.addInfo.userName);
            params.append('userIdNumber', this.addInfo.idCard);
            params.append('userGender', this.addInfo.sex);
            params.append('userTel', this.addInfo.phone);
            params.append('userEmail', this.addInfo.email);
            params.append('userComments', this.addInfo.remark);
            params.append('tokenBackend', this.tokenBackend);
            this.$axios.defaults.headers.common['token']=this.tokenBackend;
            this.$axios.post(this.addUrl, params).then(res => {
              if (0 == res.data.code) {//新增成功
                this.getData();
                this.$message({
                  showClose: true,
                  message: '新增用户成功',
                  type: 'success'
                });
                this.dialogAdd = false;//隐藏dialo  
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

      //取消新增，修改，修改密码
      cancelDialog() {
        this.dialogAdd = false;//隐藏新增dialo  
        this.dialogEdit = false;//修改dialo  
        if (this.$refs['addInfo']) {//清空新增表单
          this.$refs['addInfo'].resetFields();
        }
        this.dialogPwdEdit = false;//隐藏修改密码dialo  
      },
      //修改信息
      editNews(form) {
        if (this.editInfoBefore) {
          if (undefined != this.editInfoBefore.userUuid) {
            this.dialogEdit = true;
            this.editInfo = this.editInfoBefore;
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
            var params = new URLSearchParams();
            params.append('tokenBackend', this.tokenBackend);
            params.append('userUuid', this.editInfo.userUuid);
            params.append('version', this.editInfo.version + "");
            params.append('userName', this.editInfo.userName);
            params.append('userIdNumber', this.editInfo.userIdNumber);
            params.append('userTel', this.editInfo.userTel);
            params.append('userGender', this.editInfo.userGender);
            params.append('userIsUsed', this.editInfo.userIsUsed);
            params.append('userEmail', this.editInfo.userEmail);
            params.append('userComments', this.editInfo.userComments);
            this.$axios.defaults.headers.common['token']=this.tokenBackend;
            this.$axios.put(this.editUrl,params).then(res => {
              if (0 == res.data.code) {//修改成功
                this.getData();
                this.$message({
                  showClose: true,
                  message: '修改用户成功',
                  type: 'success'
                });
                this.$refs['editInfo'].clearValidate();  //清除表单验证
                this.dialogEdit = false;//隐藏dialo 
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'error'
                });
              }
            })
          }
          else {
            return false;
          }
        });
      },
      //修改密码   
      editPassword(editPwd) {
        if (this.editInfoBefore) {
          if (this.$refs[editPwd]) {//清空表单
            this.$refs[editPwd].resetFields();
          }
          if (undefined != this.editInfoBefore.userUuid) {
            this.dialogPwdEdit = true;
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
      //确认修改密码
      editPwdSure(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = new URLSearchParams();
            params.append('userUuid', this.editInfoBefore.userUuid);
            params.append('userNewPwd', this.editPwd.passWord);
            params.append('tokenBackend', this.tokenBackend);
            params.append('version', this.editInfoBefore.version);
            this.$axios.defaults.headers.common['token']=this.tokenBackend;
            this.$axios.post(this.editPwdUrl, params).then(res => {
              if (0 == res.data.code) {//修改成功
                this.getData();
                this.$message({
                  showClose: true,
                  message: '修改密码成功',
                  type: 'success'
                });
                this.dialogPwdEdit = false;//隐藏dialo 
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
      //删除用户  
      delUser() {
        if (undefined != this.selectId.length && 0 < this.selectId.length) {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var params = { 'userList': [...this.selectId], 'tokenBackend': this.tokenBackend }
            this.$axios.defaults.headers.common['token']=this.tokenBackend;
            this.$axios.defaults.headers.post['Content-Type'] ='application/json';
            this.$axios.put(this.delUrl,params).then(res => {
              if (0 == res.data.code) {//删除成功
                this.getData();
                this.editInfo = {};
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
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
              message: '已取消删除'
            });
          });
        } else {
          this.$message({
            showClose: true,
            message: "请选择一条数据进行删除",
            type: 'error'
          });
        }
      },
      //每页条数
      handleSizeChange(val) {
        this.pageSize = val;
        this.searchForm();
      },
      //第几页
      handleCurrentChange(val) {
        this.pageNum = val;
        this.searchForm();
      },
      //选中checkbox，取消选中 此处返回的是以选中的val
      chooseOne(val) {
        var userCode = [];
        for (var i = 0; i < val.length; i++) {
          userCode.push(val[i].userUuid)
        }
        this.delNum = userCode.length;
        
        this.selectId = userCode;//将选中的id存起来
        if (1 == val.length) {//选中一条时将选中的值存起来 否则清空待修改
          this.editInfoBefore = val[0];
        } else {
          this.editInfo = {};
          this.editInfoBefore = {};
        }
      },
      //全选
      chooseAll(val) {
        var userCode = [];
        for (var i = 0; i < val.length; i++) {
          userCode.push(val[i].userUuid)
        }
        this.delNum = userCode.length;
        this.selectId = userCode;//将选中的id存起来
        this.editInfo = {};
        this.editInfoBefore = {};
      },
      //获取列表
      getData() {
        this.$axios.defaults.headers.common['token']=this.tokenBackend;
        this.$axios.get(this.getDataUrl + "?pageNum=" + this.pageNum + "&pageSize=" + this.pageSize + "&tokenBackend="+this.tokenBackend ).then(res => {
          this.editInfoBefore = {};
          this.selectId = [];
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
      //时间格式化
      dateFormat(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
      }
    },
  };
</script>

<style scoped>
  .userPage .handle-box {
    margin-bottom: 20px;
  }

  .userPage .mar_top_12 {
    margin-top: 12px
  }

  .userPage .roleStyle {
    width: 250px;
    height: 35px;
    line-height: 35px;
    float: left;
    text-align: center;
    border: 1px solid #d1dbe5;
  }

  .userPage .topNoStyle {
    border-top: none
  }

  .userPage .rightNoStyle {
    border-right: none
  }

  .userPage .tdStyle {
    width: 250px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #d1dbe5;
    border-top: none;
  }

  .userPage .el-form-item {
    margin-bottom: 15px;
  }

  .userPage .autoWidth .el-dialog {
    width: 650px;
  }

  .userPage .changePassword .inputWidth {
    width: 250px;
  }

  .userPage .userDialog .el-form-item__error {
    padding: 0;
  }

  .userPage .changePassword .el-form-item__error {
    padding: 0;
  }
  .userPage .el-input__inner{
    height: 32px;
  }
  .userPage .searchStyle .el-form-item__label {
    line-height: 40px;
  }

  .userPage .searchStyle .el-button {
    margin-top: 5px;
  }
</style>