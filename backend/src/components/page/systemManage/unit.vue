<template>
  <div class="unit">
    <!-- 查询 块 -->
    <div>
      <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline searchStyle" label-width="100px">
        <el-form-item label="单位名称" prop="unitName">
          <!--prop 重置时用到  -->
          <el-input v-model="formInline.unitName" clearable></el-input>
        </el-form-item>
        <el-form-item label=" " label-width="40px">
          <el-button type="primary" @click="searchForm()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('formInline')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮组建 -->
    <div class="handle-box">
      <el-button type="primary" icon="el-icon-edit" @click="editNews()">修改</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addUnit('addInfo')">新增</el-button>
      <el-button type="primary" icon="el-icon-delete" @click="delUnit()">删除</el-button>
    </div>
    <!-- 单位列表 -->
    <el-table :data="tableData" border stripe @select="chooseOne" @select-all="chooseAll" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="unitId" label="单位ID" fixed="left" sortable></el-table-column>
      <el-table-column prop="unitName" label=" 单位名称"></el-table-column>
      <el-table-column prop="version" label="版本号"></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataSize"
      >
        <!-- pageNum 当前的页数 pageSize 每页显示的条目 total 总条目-->
      </el-pagination>
    </div>
    <!-- 单位修改 -->
    <el-dialog width="40%" :inline="true" title="修改" :visible.sync="dialogEdit" :close-on-click-modal="false" class="userDialog" :before-close="cancelDialog">
      <el-row class="edit-row-one edit-row-one_e">
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">基本信息</div>
        </el-col>
      </el-row>
      <el-form :model="editInfo" class="edit-form" label-width="100px" :rules="rules" ref="editInfo" :inline="true" :label-position="'right'">
        <el-form-item label="单位名称" prop="unitName">
          <el-input v-model="editInfo.unitName" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-table-column prop="unitId" label="单位ID" fixed="left" sortable></el-table-column>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="editSure('editInfo')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 单位新增 -->
    <el-dialog width="40%" title="单位新增" :visible.sync="dialogAdd" :close-on-click-modal="false" class="userDialog">
      <el-form :model="addInfo" label-width="100px" :rules="rules" ref="addInfo" :inline="true" :label-position="'right'">
        <el-form-item label="商品名称" prop="unitName">
          <el-input v-model="addInfo.unitName" clearable class="inputWidth"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="addSure('addInfo')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //表单验证飞控去空格后非空
    var validatePass = (rule, value, callback) => {
      if (value.replace(/(^\s*)|(\s*$)/g, "") === "") {
        //前后去空格
        callback(new Error("请输入用户名称"));
      } else {
        callback();
      }
    };
    //修改
    var validatePass2 = (rule, value, callback) => {
      if (value.replace(/(^\s*)|(\s*$)/g, "") === "") {
        //前后去空格
        callback(new Error("请输入用户账号"));
      } else {
        callback();
      }
    };
    //密码
    var validatePassWord = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.editPwd.passWordCheck !== "") {
          this.$refs.editPwd.validateField("passWordCheck");
        }
        callback();
      }
    };
    //密码确认
    var validatePassWordCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.editPwd.passWord) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      valnum:'',
      tokenBackend: "",
      loading: "", //加载遮罩
      data: [], //部门菜单
      defaultProps: {
        children: "children",
        label: "label"
      },
      tableData: [],
      dataSize: 0, //获取的当前页的总条数
      dataSizePost: 0, //获取的当前列表里的总条数
      pageNum: 1, //默认当前页数
      pageNumPost: 1, //默认当前页数
      pageSize: 10, //每页显示条目个数，支持 .sync 修饰符
      pageSizePost: 10, //每页显示条目个数，支持 .sync 修饰符

      formData: {}, //查询条件传值

      dialogAdd: false, //新增框默认隐藏
      dialogEdit: false, //修改框默认隐藏

      editUrl:
        this.$store.state.url +
        "/mall/backend/commodityUnit/updateCommodityUnit", //修改URL
      addUrl:
        this.$store.state.url + "/mall/backend/commodityUnit/addCommodityUnit", //新增URL
      getDataUrl:
        this.$store.state.url +
        "/mall/backend/commodityUnit/getCommodityUnitListPage", //手动查询
      autogetDataUrl:
        this.$store.state.url +
        "/mall/backend/commodityUnit/getCommodityUnitList", //自动查询
      delUrl:
        this.$store.state.url +
        "/mall/backend/commodityUnit/deleteCommodityUnit", //删除

      formInline: {
        //快捷查询
        unitName: ""
      },
      addInfo: {
        unitName: ""
      },
      selectId: [], //选中的id
      editInfo: {}, //待修改的参数
      getInfo: {}, //查询获得的参数
      editInfoBefore: "", //修改前的值 取消修改用
      rules: {
        //表单验证
        userAcct: [
          { required: true, validator: validatePass2, trigger: "blur" }, // //,
          { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
        ],
        userName: [
          { required: true, validator: validatePass, trigger: "blur" },
          { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
        ],
        idCard: [
          //身份证验证
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: "证件号码格式有误！",
            trigger: "blur"
          }
        ],
        tel: [
          //固定电话
          {
            pattern: /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
            message: "请输入正确的固定电话",
            trigger: "blur"
          }
        ],
        phone: [
          //手机号码
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        email: [
          //电子邮箱
          {
            pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
            message: "请输入正确电子邮箱",
            trigger: "blur"
          }
        ],
        deptName: [],
        ip: [
          //IP地址
          {
            pattern: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
            message: "请输入正确的IP",
            trigger: "blur"
          }
        ],
        remark: [
          //备注无需验证 写在此处是为了打开tialog时能统一清空表单
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur"
          }
        ]
      },
      rules2: {
        //修改密码
        passWord: [
          { required: true, validator: validatePassWord, trigger: "blur" }
        ],
        passWordCheck: [
          { required: true, validator: validatePassWordCheck, trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    pageNum: function() {
      this.getData();
    },
    pageSize: function() {
      this.getData();
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.getData(); //获取页面表格
      this.tokenBackend = sessionStorage.getItem("customertoken");
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
    //获取页面按钮
    getButton() {
      this.menuCode = this.$store.state.menuCode; //防止按钮下面还有权限 切换菜单时值会改变
      var params = new URLSearchParams();
      params = {
        USER_NAME: localStorage.getItem("ms_username"),
        MENU_CODE: this.menuCode,
        BUTTON_CODE: ""
      };
      this.$axios.post(this.$store.state.getButtonUrl, params).then(res => {
        if (0 == res.data.code) {
          //设置成功
          this.menuButtonList = res.data.data;
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    //查询
    searchForm() {
      var params = new URLSearchParams();
      params.append("unitName", this.formInline.unitName);
      params.append("pageSize", this.pageSize);
      params.append("pageNum", this.pageNum);
      params.append("tokenBackend", sessionStorage.getItem("customertoken"));
      this.$axios.defaults.headers.common["token"] = sessionStorage.getItem(
        "customertoken"
      );
      this.$axios.get(this.getDataUrl, { params }).then(res => {
        this.loading.close(); //关闭加载
        console.log(res.data);
        if (0 == res.data.code) {
          //新增成功
          this.tableData = res.data.data.list;
          this.$message({
            showClose: true,
            message: "查询成功",
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    //重置查询域
    resetForm(formInline) {
      this.$refs[formInline].resetFields();
    },
    //商品新增
    addUnit(addInfo) {
      this.dialogAdd = true;
      if (this.$refs[addInfo]) {
        //清空表单
        this.$refs[addInfo].resetFields();
      }
    },
    //确认新增
    addSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var params = new URLSearchParams();
          params.append("unitName", this.addInfo.unitName);
          params.append(
            "tokenBackend",
            sessionStorage.getItem("customertoken")
          );
          this.$axios.defaults.headers.common["token"] = sessionStorage.getItem(
            "customertoken"
          );
          this.openFullScreen(); //打开遮罩
          this.$axios.post(this.addUrl, params).then(res => {
            this.loading.close(); //关闭加载
            if (0 == res.data.code) {
              //新增成功
              this.getData();
              this.$message({
                showClose: true,
                message: "新增用户成功",
                type: "success"
              });
              this.dialogAdd = false; //隐藏dialo
            } else {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //取消新增，修改，修改密码
    cancelDialog() {
      this.dialogAdd = false; ////隐藏新增dialo
      this.dialogEdit = false; //隐藏修改dialo
      this.dialogInfo = false; //隐藏修改dialo
      if (this.$refs["editInfo"]) {
        //清空表单
        this.$refs["editInfo"].resetFields();
      }
      if (this.$refs["formInlinePost"]) {
        //清空表单
        this.$refs["formInlinePost"].resetFields();
      }
      this.dialogPwdEdit = false; //隐藏修改密码dialo
      this.dialogRole = false; //隐指派角色dialo
      this.dialogDeptSet = false; //设置部门dialo
      this.dialogPostSet = false; //设置岗位dialo
      if (1 != this.pageNumPost) {
        this.pageNumPost = 1; //每次查询从第一页开始
      }
    },
    //修改信息
    editNews(form) {
      if (this.editInfoBefore) {
        if (undefined != this.editInfoBefore.unitId) {
          this.dialogEdit = true;
          this.editInfo = JSON.parse(JSON.stringify(this.editInfoBefore));
        } else {
          this.$message({
            showClose: true,
            message: "请选择一条数据进行修改",
            type: "error"
          });
        }
      } else {
        this.$message({
          showClose: true,
          message: "请选择一条数据进行修改",
          type: "error"
        });
      }
    },
    //确认修改
    editSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          params.append("unitId", this.editInfo.unitId);
          params.append("unitName", this.editInfo.unitName);
          params.append("version", this.editInfo.version);
          params.append(
            "tokenBackend",
            sessionStorage.getItem("customertoken")
          );
          this.$axios.defaults.headers.common["token"] = sessionStorage.getItem(
            "customertoken"
          );
          this.openFullScreen(); //打开遮罩
          this.$axios.put(this.editUrl, params).then(res => {
            this.loading.close(); //关闭加载
            if (0 == res.data.code) {
              //修改成功
              this.getData();
              this.$message({
                showClose: true,
                message: "修改用户成功",
                type: "success"
              });
              this.dialogEdit = false; //隐藏dialo
            } else {
              this.$message({
                showClose: true,
                message: res.data.msg + "7777777777",
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //删除单位
    delUnit() {
      if (this.valnum==1) {
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            var params = new URLSearchParams();
            params.append("unitId", this.editInfoBefore.unitId);
            params.append(
              "tokenBackend",
              sessionStorage.getItem("customertoken")
            );
            this.$axios.defaults.headers.common[
              "token"
            ] = sessionStorage.getItem("customertoken");
            this.openFullScreen(); //打开遮罩
            this.$axios.put(this.delUrl, params).then(res => {
              this.loading.close(); //关闭加载
              if (0 == res.data.code) {
                //删除成功
                //还剩的条数>当前页数减一乘每页条数且 当前页数不是第一页
                if (
                  Number(this.dataSize) - Number(this.delNum) >
                    Number(Number(this.pageNum) - 1) * Number(this.pageSize) &&
                  Number(this.pageNum) > 1
                ) {
                  //如果页数*每页条数 大于之前总条数减去删除的条数 即还剩的条数 则继续请求 否者 当前页数减一
                  this.getData();
                } else {
                  this.pageNum--;
                }
                this.editInfo = {};
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.valnum='';
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "error"
                });
              this.valnum='';
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
            this.valnum='';
          });
      } else {
        this.$message({
          showClose: true,
          message: "请选择一条数据进行删除",
          type: "error"
        });
      }
    },
    //每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    //第几页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getData();
    },
    //每页条数
    handleSizeChangePost(val) {
      this.pageSizePost = val;
      this.getPostByDept();
    },
    //第几页
    handleCurrentChangePost(val) {
      this.pageNumPost = val;
      this.getPostByDept();
    },
    //选中checkbox，取消选中 此处返回的是以选中的val
    chooseOne(val) {
      this.valnum=val.length;
      if (1 == val.length) {
        //选中一条时将选中的值存起来 否则清空待修改
        this.editInfoBefore = JSON.parse(JSON.stringify(val[0]));
        this.getUserByUserCode(JSON.parse(JSON.stringify(val[0])).userCode);
      } else {
        this.editInfo = {};
        this.editInfoBefore = {};
      }
    },
    //全选
    chooseAll(val) {
      this.editInfo = {};
      this.editInfoBefore = {};
    },
    getData() {
      var list = [
        {
          unitId: "327393",
          unitName: "晨光",
          version: "1.0"
        },
        {
          unitId: "327393",
          unitName: "晨光",
          version: "1.0"
        },
        {
          unitId: "327393",
          unitName: "晨光",
          version: "1.0"
        },
        {
          unitId: "327393",
          unitName: "晨光",
          version: "1.0"
        }
      ];
      this.tableData = list;
      this.openFullScreen(); //打开遮罩
      var params = new URLSearchParams();
      params.append("tokenBackend", sessionStorage.getItem("customertoken"));
      this.$axios.defaults.headers.common["token"] = sessionStorage.getItem(
        "customertoken"
      );
      this.$axios.get(this.autogetDataUrl, { params }).then(res => {
        this.loading.close(); //关闭加载
        this.editInfoBefore = {};
        this.selectId = {};
        if (0 == res.data.code) {
          //查询成功
          this.tableData = res.data.data;
          this.dataSize = res.data.data.length; //总条数
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getUserByUserCode(userCode) {
      var params = new URLSearchParams();
      params.append("userCode", userCode);
      this.$axios.post(this.getUserByUserCodeUrl, params).then(res => {
        this.editInfoBefore = {};
        if (0 == res.data.code) {
          //查询成功
          this.editInfoBefore = res.data.data;
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.unit .edit-form {
  margin-top: 15px;
}
.unit .edit-content {
  /* width: 100%; */
  height: 140px;
  border: 1px solid #e6e6e6;
  border-top: none;
}
.unit .edit-row-one {
  height: 40px;
  background-color: #e6e6e6;
  margin-top: 20px;
}
.unit .edit-row-one_e {
  margin-top: 0px;
}
.unit .handle-box {
  margin-bottom: 20px;
}
.unit .mar_top_12 {
  margin-top: 12px;
}
.unit .roleStyle {
  width: 250px;
  height: 35px;
  line-height: 35px;
  float: left;
  text-align: center;
  border: 1px solid #d1dbe5;
}
.unit .topNoStyle {
  border-top: none;
}
.unit .rightNoStyle {
  border-right: none;
}
.unit .tdStyle {
  width: 250px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #d1dbe5;
  border-top: none;
  /* border-right:none */
}
.unit .el-form-item {
  margin-bottom: 15px;
}
</style>
<style>
.unit .el-dialog {
  margin-top: 2vh !important;
}
/* 此处强制优先级 */
.unit .autoWidth .el-dialog {
  width: 650px;
}
.unit .changePassword .inputWidth {
  width: 250px;
}
.unit .userDialog .el-form-item__error {
  padding: 0;
}
.unit .changePassword .el-form-item__error {
  padding: 0;
}
.unit .searchStyle .el-form-item__label {
  line-height: 30px;
}
.unit .searchStyle .el-form-item__content {
  line-height: 30px;
}
.unit .grid-content {
  padding: 0px 5px 0px 10px;
  line-height: 40px;
}
</style>