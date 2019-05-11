<template>
  <div class="classification">
    <!-- 菜单树 -->
    <div class="menuTreeLeft">
      <div class="MenuTreeTitle">
        <div class="left">菜单树</div>
        <div class="right pad-rig-10">
          <i class="el-icon-plus pad-rig-10" @click="addTree('addMenuList')"></i>
          <i class="el-icon-edit pad-rig-10" @click="editTree"></i>
          <i class="el-icon-delete pad-rig-10" @click="delTree"></i>
          <i class="el-icon-refresh pad-rig-10" @click="getData"></i>
        </div>
      </div>
      <el-tree
        :data="menuData"
        :props="defaultProps"
        :default-expand-all="true"
        :highlight-current="true"
        @node-click="handleNodeClick"
        style="height: 520px;overflow:auto;border:1px solid #d1dbe5;"
      ></el-tree>
    </div>
    <!-- 分类详情 -->
    <div class="menuTreeRight">
      <div class="menuTreeNews">
        <span>菜单信息</span>
      </div>
      <div class="mar-top-10">
        <el-form ref="menuDetail" :inline="true" :model="menuDetail" label-width="100px" class="form">
          <el-form-item label="分类ID">
            <el-input v-model="menuDetail.id" readonly></el-input>
          </el-form-item>
          <el-form-item label="分类名称">
            <el-input v-model="menuDetail.label" readonly></el-input>
          </el-form-item>
          <el-form-item label="上一级ID">
            <el-input v-model="menuDetail.categoryParentId" readonly></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 新增菜单分类 -->
    <el-dialog title="新增菜单" :visible.sync="dialogMenuAdd" width="30%" :close-on-click-modal="false">
      <el-form :model="addMenuList" :rules="rulesAddMenu" ref="addMenuList" label-width="100px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="addMenuList.categoryName" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="categoryRemark">
          <el-input v-model="addMenuList.categoryRemark" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortNo" class="mar-top-20">
          <el-input v-model="addMenuList.sortNo" clearable class="inputWidth"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="addMenuSure('addMenuList')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改菜单分类 -->
    <el-dialog title="修改菜单" :visible.sync="dialogMenuEdit" width="30%" :close-on-click-modal="false" :before-close="cancelDialog">
      <el-form :model="editMenuList" :rules="rulesAddMenu" ref="editMenuList" label-width="100px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="editMenuList.categoryName" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="分类编码" prop="categoryId" class="mar-top-20">
          <el-input v-model="editMenuList.categoryId" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="categoryRemark" class="mar-top-20">
          <el-input v-model="editMenuList.categoryRemark" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortNo" class="mar-top-20">
          <el-input v-model="editMenuList.sortNo" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="version" class="mar-top-20">
          <el-input v-model="editMenuList.version" clearable class="inputWidth"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="editMenuSure('editMenuList')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //表单验证非空去空格后
    var validatePass = (rule, value, callback) => {
      if (value.replace(/(^\s*)|(\s*$)/g, "") === "") {
        //前后去空格
        callback(new Error("请输入名称"));
      } else {
        callback();
      }
    };
    return {
      loading: "", //加载遮罩
      menuData: [], //菜单树
      menuDatalist: {},
      defaultProps: {
        ////菜单树配置选项
        children: "children", //指定子树为节点对象的某个属性值
        label: "label" //指定节点标签为节点对象的某个属性值
      },
      menuDetail: {}, //菜单详情
      chooseMenuId: "", //选中的菜单id下新增修改删除按钮时 刷新用到
      dialogMenuAdd: false, //新增菜单树默认hide
      dialogMenuEdit: false, //修改菜单树默认hide
      addMenuList: {
        //新增菜单的数据
      },
      editMenuList: {
        //修改菜单的数据
      },
      buttonList: [], //按钮树
      editButtonList: {
        //修改的按钮数据
      },
      rulesAddMenu: {
        //新增菜单
        id: [
          { required: true, validator: validatePass, trigger: "blur" },
          { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择所属部门", trigger: "change" }
        ],
        children: [
          { required: true, message: "排序不能为空" }, //
          {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: "请输入正确的正整数",
            trigger: "blur"
          }
        ],
        attributes: [
          { required: true, message: "方法不能为空", trigger: "blur" },
          { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
        ]
      },
      rulesAddButton: {
        //新增按钮
        buttonName: [
          { required: true, validator: validatePass, trigger: "blur" },
          { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
        ],
        children: [
          { required: true, message: "排序不能为空" }, //
          {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: "请输入正确的正整数",
            trigger: "blur"
          }
        ],
        buttonUrl: [
          { required: true, message: "方法不能为空" }, //
          { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
        ]
      },
      buttonChoose: [], //选中的按钮信息
      getattributes:
        this.$store.state.url + "/mall/backend/category/getCategory", //查询分类,
      delattributes:
        this.$store.state.url + "/mall/backend/category/deleteCategory", //删除菜单,
      addNewattributes:
        this.$store.state.url + "/mall/backend/category/addCategory", //新增菜单,
      getModifyattributes:
        this.$store.state.url + "/mall/backend/category/updateCategory" //修改菜单
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      this.getData();
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
    //选中一条菜单树
    handleNodeClick(data) {
      this.menuDetail = data;
      this.menuDetail.categoryParentId = this.menuDetail.attributes.categoryParentId;
      this.findButtonList(); //查询按钮信息
    },
    //新增菜单树
    addTree(addInfo) {
      // this.addMenuList = this.menuDetail;
      this.dialogMenuAdd = true;
      //清空表单
      if (this.$refs[addInfo]) {
        this.$refs[addInfo].resetFields();
      }
    },
    //确认新增
    addMenuSure(formName) {
      var params = new URLSearchParams();
      params.append("categoryName", this.addMenuList.categoryName);
      params.append("categoryParentId", this.menuDetail.attributes.categoryId);
      params.append("categoryRemark", this.addMenuList.categoryRemark);
      params.append("sortNo", this.addMenuList.sortNo);
      this.openFullScreen(); //打开遮罩
      params.append("tokenBackend", sessionStorage.getItem("customertoken"));
      this.$axios.defaults.headers.common["token"] = sessionStorage.getItem(
        "customertoken"
      );
      this.$axios.post(this.addNewattributes, params).then(res => {
        console.log(res.data);
        this.loading.close(); //关闭加载
        if (0 == res.data.code) {
          //新增成功
          this.getData();
          this.addMenuList = {};
          this.$message({
            showClose: true,
            message: "新增菜单成功",
            type: "success"
          });
          this.menuDetail = {};
          this.dialogMenuAdd = false; //隐藏dialo
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    //修改菜单树
    editTree() {
      if (this.menuDetail.id) {
        this.editMenuList = this.menuDetail.attributes;
        this.dialogMenuEdit = true;
      } else {
        this.$message({
          showClose: true,
          message: "请选择要修改的菜单",
          type: "error"
        });
      }
    },
    //确认修改
    editMenuSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var params = new URLSearchParams();
          params.append("categoryName", this.editMenuList.categoryName);
          params.append("categoryId", this.editMenuList.categoryId);
          params.append("categoryRemark", this.editMenuList.categoryRemark);
          params.append("sortNo", this.editMenuList.sortNo);
          params.append("version", this.editMenuList.version);
          params.append("tokenBackend",sessionStorage.getItem("customertoken"));
          this.$axios.defaults.headers.common["token"] = sessionStorage.getItem("customertoken");
          this.openFullScreen(); //打开遮罩
          this.$axios.put(this.getModifyattributes, params).then(res => {
            this.loading.close(); //关闭加载
            console.log(res.data);
            if (0 == res.data.code) {
              //修改成功
              this.getData();
              this.dialogMenuEdit = false;
              this.menuDetail = {};
              this.$message({
                showClose: true,
                message: "修改成功",
                type: "success"
              });
              this.dialogEdit = false; //隐藏dialo
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
    //删除菜单树
    delTree() {
      if (this.menuDetail.id) {
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            var params = new URLSearchParams();
            params.append("categoryId", this.menuDetail.attributes.categoryId);
            params.append(
              "tokenBackend",
              sessionStorage.getItem("customertoken")
            );
            this.$axios.defaults.headers.common[
              "token"
            ] = sessionStorage.getItem("customertoken");
            this.openFullScreen(); //打开遮罩
            this.$axios.put(this.delattributes, params).then(res => {
              this.loading.close(); //关闭加载
              console.log(res.data);
              if (0 == res.data.code) {
                //删除成功
                this.getData();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "error"
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          showClose: true,
          message: "请选择一条数据进行删除",
          type: "error"
        });
      }
    },
    //取消新增,修改...
    cancelDialog() {
      this.dialogMenuAdd = false; //隐藏dialo
      this.dialogMenuEdit = false; //隐藏dialo
      if (this.$refs["editMenuList"]) {
        //清空表单
        this.$refs["editMenuList"].resetFields();
      }
      if (this.$refs["editButtonList"]) {
        //清空表单
        this.$refs["editButtonList"].resetFields();
      }
    },
    //获取菜单树
    getData() {
      var listDemo = [];
      this.menuData = listDemo;
      this.menuDetail = {};
      this.openFullScreen(); //打开遮罩
      var params = new URLSearchParams();
      params.append("tokenBackend", sessionStorage.getItem("customertoken"));
      this.$axios.defaults.headers.common["token"] = sessionStorage.getItem(
        "customertoken"
      );
      this.$axios.get(this.getattributes, { params }).then(res => {
        this.loading.close(); //关闭加载
        if (0 == res.data.code) {
          //查询成功
          this.menuData = res.data.data; //外层数据
          this.menuDatalist = res.data.data.attributes; //attributes里的数据.
          this.menuDetail = {};
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
.classification .form {
  margin-top: 10px;
}
.classification .left {
  float: left;
}
.classification .right {
  float: right;
}
.classification .pad-rig-10 {
  padding-right: 10px;
}
.classification .mar-top-20 {
  margin-top: 20px;
}
.classification .mar-top-10 {
  margin-top: none;
}
.classification .menuTreeLeft {
  width: 30%;
  float: left;
}
.classification .menuTreeRight {
  width: 70%;
  float: right;
}
.classification .MenuTreeTitle {
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  background: #fbfdff;
  border: 1px solid #d1dbe5;
  border-bottom: none;
}
.classification .menuTreeNews {
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  background: #fbfdff;
  border: 1px solid #d1dbe5;
  border-left: none;
}
.classification .mar-top-10 {
  height: 520px;
  overflow: auto;
  border: 1px solid rgb(209, 219, 229);
  border-top: none;
  border-left: none;
  /* margin-top: 10px; */
}
.classification .el-form-item {
  margin-bottom: 10px;
}
.classification .buttonStyle {
  /* color: #fff; */
  /* background-color: #20a0ff; */
  border: 1px solid #d1dbe5;
  padding: 8px 12px;
  border-radius: 4px;
}
.classification .inputWidth {
  max-width: 200px;
}
</style>

