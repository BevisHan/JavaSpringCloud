<template>
  <div>
    <!-- 增删改查按钮 -->
    <div class="menuTreeLeft">
      <div class="MenuTreeTitle">
        <div class="left">菜单树</div>
        <div class="right pad-rig-10">
          <!-- <i class="el-icon-plus pad-rig-10" @click="addTree('addMenuList')"></i>
        <i class="el-icon-edit pad-rig-10" @click="editTree"></i>
        <i class="el-icon-delete pad-rig-10" @click="delTree"></i>
          <i class="el-icon-refresh pad-rig-10" @click="getData"></i>-->
          <i class="el-icon-plus pad-rig-10" @click="addTree"></i>
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
    <!-- 菜单树 -->
    <div class="menuTreeRight">
      <div class="menuTreeNews">
        <span>菜单信息</span>
      </div>
      <div class="mar-top-10">
        <el-form ref="menuDetail" :inline="true" :model="menuDetail" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="menuDetail.menuName" readonly></el-input>
          </el-form-item>
          <!-- <el-form-item label="类型">
              <el-input v-model="menuDetail.type" readonly></el-input>
          </el-form-item>-->
          <el-form-item label="类型" prop="type">
            <el-select v-model="menuDetail.menuType" disabled class="a1">
              <el-option label="菜单" value="2"></el-option>
              <el-option label="目录" value="1"></el-option>
            </el-select>
          </el-form-item>
         <el-form-item
          label="方法"
          prop="menuUrl"
          :rules="[{required: true,  message: '名字不能为空', trigger: 'blur' },{ min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' } ]"
          class="mar-top-20"
          v-if="menuDetail.menuType=='1'||editMenuList.menuType==='目录'"
        >
            <el-input v-model="menuDetail.menuUrl" readonly></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="menuDetail.sortNo" readonly></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="menuDetail.menuComments" readonly></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 新增菜单 -->
    <el-dialog title="新增菜单" :visible.sync="dialogMenuAdd" width="30%" :close-on-click-modal="false">
      <el-form :model="addMenuList" ref="addMenuList" label-width="100px">
        <el-form-item
          label="名称"
          prop="menuName"
          :rules="[{required: true,  message: '名字不能为空', trigger: 'blur' },{ min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' } ]"
        >
          <el-input v-model="addMenuList.menuName" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" class="mar-top-20">
          <el-select v-model="addMenuList.type" class="inputWidth" placeholder="请选择菜单类型">
            <el-option label="菜单" value="2"></el-option>
            <el-option label="目录" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="方法"
          prop="menuUrl"
          :rules="[{required: true,  message: '方法不能为空', trigger: 'blur' },{ min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' } ]"
          class="mar-top-20"
          v-if="addMenuList.type==='1'"
        >
          <el-input v-model="addMenuList.menuUrl" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item
          label="排序"
          prop="sortNo"
          :rules="[{ required: true, message: '排序不能为空'},{pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入正确的正整数' , trigger: 'blur'}]"
          class="mar-top-20"
        >
          <el-input v-model="addMenuList.sortNo" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" class="mar-top-20">
          <el-input v-model="addMenuList.remark" clearable class="inputWidth"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog(addMenuList)">取 消</el-button>
        <el-button type="primary" @click="addMenuSure('addMenuList')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改菜单 -->
    <el-dialog
      title="修改菜单"
      :visible.sync="dialogMenuEdit"
      width="30%"
      :close-on-click-modal="false"
      :before-close="cancelDialog">
      <el-form :model="editMenuList" :rules="rulesAddMenu" ref="editMenuList" label-width="100px">
        <el-form-item
          label="名称"
          prop="menuName"
          :rules="[{required: true,  message: '名字不能为空', trigger: 'blur' },{ min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' } ]"
        >
          <el-input v-model="editMenuList.menuName" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="editMenuList.menuType" disabled class="a1">
            <el-option label="菜单" value="2"></el-option>
            <el-option label="目录" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="方法"
          prop="menuUrl"
          :rules="[{required: true,  message: '名字不能为空', trigger: 'blur' },{ min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' } ]"
          class="mar-top-20"
          v-if="editMenuList.menuType=='1'||editMenuList.menuType==='目录'"
        >
          <el-input v-model="editMenuList.menuUrl" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item
          label="排序"
          prop="sortNo"
          :rules="[{ required: true, message: '排序不能为空'},{pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入正确的正整数' , trigger: 'blur'}]"
          class="mar-top-20"
        >
          <el-input v-model="editMenuList.sortNo" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" class="mar-top-20">
          <el-input v-model="editMenuList.menuComments" clearable class="inputWidth"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog('editMenuList')">取 消</el-button>
        <el-button type="primary" @click="editMenuSure('editMenuList')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      getlistMenuUrl:
        this.$store.state.url + "/admin/admin/backend/menu/listMenus", //查询菜单,
      getdeleteMenuUrl:
        this.$store.state.url + "/admin/admin/backend/menu/deleteMenu", //删除菜单,
      getinsertMenuUrl:
        this.$store.state.url + "/admin/admin/backend/menu/insertMenu", //新增菜单,
      getupdateMenuUrl:
        this.$store.state.url + "/admin/admin/backend/menu/updateMenu", //修改菜单
      rulesAddMenu: {},
      tokenBackend: "",
      authCode: "1",
      menuDetail: {},
      editMenuList: {},
      menuData: [],
      addMenuList: [],
      dialogMenuAdd: false,
      dialogMenuEdit: false,
      defaultProps: {
        ////菜单树配置选项
        children: "children", //指定子树为节点对象的某个属性值
        label: "label" //指定节点标签为节点对象的某个属性值
      }
    };
  },
  mounted() {
    this.tokenBackend = sessionStorage.getItem("customertoken");
    this.getData();
  },
  methods: {
   // 选定菜单
    handleNodeClick(data) {
      this.menuDetail = data.attributes;
      },
  //删除菜单
    delTree() {
      if (this.menuDetail.menuName) {
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            var params = new URLSearchParams();
            params.append("tokenBackend", this.tokenBackend);
            params.append("authCode", this.menuDetail.authCode);
            params.append("parentMenuId", this.menuDetail.parentMenuId);
            // this.openFullScreen();//打开遮罩
            this.$axios.defaults.headers.common["token"] = this.tokenBackend;
            this.$axios.put(this.getdeleteMenuUrl, params).then(res => {
              // this.loading.close(); //关闭加载
              console.log(res);
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
  //判断只能在目录下新建
    addTree() {
      if (this.menuDetail.menuType === undefined) {
        this.menuDetail.menuId = 0;
      } else if (
        "菜单" == this.menuDetail.menuType ||
        2 == this.menuDetail.menuType
      ) {
        this.$message({
          showClose: true,
          message: "只能在目录下新建！",
          type: "error"
        });
        return;
      }
      this.dialogMenuAdd = true;
      this.addMenuList = {
        menuName: "", //名称
        type: "1", //类型 1是目录 2是菜单
        menuUrl: "", //方法
        sortNo: "", //排序
        remark: "" //备注
        // categoryParentId:'',//上级分类编码
      };
    },
    //判断表单完整性
    addMenuSure()  {if(this.addMenuList.type==1){
     if (
        this.addMenuList.menuName == "" ||
        this.addMenuList.menuUrl == "" ||
        this.addMenuList.sortNo == "" ||
        this.addMenuList.remark == ""
      ) {
           this.$message({
          showClose: true,
          message: "请完善信息",
          type: "error"
        });
      }else{
        this.chooseAddMenuSure();
      }
          }
      else if(this.addMenuList.type==2){
      if (
        this.addMenuList.menuName == "" ||
        this.addMenuList.sortNo == "" ||
        this.addMenuList.remark == ""
      ){ this.$message({
          showClose: true,
          message: "请完善信息",
          type: "error"
        });
      }else{
        this.chooseAddMenuSure();
      }}},
    //请求数据，接口
    chooseAddMenuSure(){ 
        var params = new URLSearchParams();
        params.append("tokenBackend", this.tokenBackend);
        params.append("menuName", this.addMenuList.menuName);
        params.append("menuUrl", this.addMenuList.menuUrl);
        params.append("sortNo", this.addMenuList.sortNo);
        params.append("menuComments", this.addMenuList.remark);
        params.append("parentAuthCode", this.menuDetail.parentMenuId);
        params.append("parentMenuId", this.menuDetail.menuId);
        params.append("menuType", this.addMenuList.type);
        // this.openFullScreen();//打开遮罩
        this.$axios.defaults.headers.common["token"] = this.tokenBackend;
        this.$axios.post(this.getinsertMenuUrl, params).then(res => {
          // this.loading.close(); //关闭加载
          if (0 == res.data.code) {
            //新增成功
            this.getData();
            this.$message({
              showClose: true,
              message: "新增菜单成功",
              type: "success"
            });
            this.menuDetail = {};
            this.$refs["addMenuList"].resetFields();
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
    //修改选定菜单
   editTree()
      {
      if (this.menuDetail.menuName) {
        this.editMenuList = this.menuDetail;
        this.dialogMenuEdit = true;
      } else {
        this.$message({
          showClose: true,
          message: "请选择要修改的菜单",
          type: "error"
        });
      }
   },
     //确认修改选定菜单信息 
    editMenuSure() {
      var type = "";
      if (
        "菜单" == this.editMenuList.menuType ||
         2 == this.editMenuList.menuType
      ) {
        type = 2;
      } else if (
        "目录" == this.editMenuList.menuType ||
        1 == this.editMenuList.menuType
      ) {
        type = 1;
      }
      if (
        this.editMenuList.menuName == "" ||
         this.editMenuList.sortNo == "" ||
        this.editMenuList.remark == ""
      ) {
        this.$message({
          showClose: true,
          message: "请按提示修改信息",
          type: "error"
        });
      } else {
        var params = new URLSearchParams();
        params.append("tokenBackend", this.tokenBackend);
        params.append("menuName", this.editMenuList.menuName);
        params.append("menuUrl", this.editMenuList.menuUrl);
        params.append("sortNo", this.editMenuList.sortNo);
        params.append("menuComments", this.editMenuList.menuComments);
        params.append("menuId", this.editMenuList.menuId);
        // console.log(params.menuId);
        this.$axios.defaults.headers.common["token"] = this.tokenBackend;
        this.$axios.post(this.getupdateMenuUrl, params).then(res => {
          // this.loading.close(); //关闭加载
          if (0 == res.data.code) {
            //修改成功
            this.getData();
            this.dialogMenuEdit = false;
            // this.menuDetail={};
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success"
            });
            this.$refs["editMenuList"].resetFields();
            this.dialogEdit = false; //隐藏dialo
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
    cancelDialog() {
      this.dialogMenuAdd = false; //隐藏dialo

      this.dialogMenuEdit = false; //隐藏dialo
      if (this.$refs["editMenuList"]) {
        //清空表单
        this.$refs["editMenuList"].resetFields();
      }
      if (this.$refs["addMenuList"]) {
        //清空表单
        this.$refs["addMenuList"].resetFields();
      }
    },
   //初始化页面获取数据
    getData() {
      var params = {
        tokenBackend: this.tokenBackend
      };
      this.$axios.defaults.headers.common["token"] = this.tokenBackend;
      this.$axios.post(this.getlistMenuUrl, params).then(res => {
        if (0 == res.data.code) {
          //查询成功
          this.menuData = res.data.data;
          // console.log(this.menuData);
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
.form {
  margin-top: 10px;
}
.left {
  float: left;
}
.right {
  float: right;
}
.pad-rig-10 {
  padding-right: 10px;
}
.mar-top-20 {
  margin-top: 20px;
}
.el-input--suffix .el-input__inner {
  padding-right: 13px;
}

.mar-top-10 {
  margin-top: none;
}
.menuTreeLeft {
  width: 30%;
  float: left;
}
.menuTreeRight {
  width: 70%;
  float: right;
}
.MenuTreeTitle {
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  background: #fbfdff;
  border: 1px solid #d1dbe5;
  border-bottom: none;
}
.menuTreeNews {
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  background: #fbfdff;
  border: 1px solid #d1dbe5;
  border-left: none;
}
.mar-top-10 {
  height: 520px;
  overflow: auto;
  border: 1px solid rgb(209, 219, 229);
  border-top: none;
  border-left: none;
  /* margin-top: 10px; */
}
.el-form-item {
  margin-bottom: 10px;
}
.buttonStyle {
  /* color: #fff; */
  /* background-color: #20a0ff; */
  border: 1px solid #d1dbe5;
  padding: 8px 12px;
  border-radius: 4px;
}
.inputWidth {
  max-width: 200px;
}
.a1 {
  width: 200px;
}
.el-form-item::after,
.el-form-item::before {
  display: table;
  content: "";
  margin-top: 10px;
}
.el-form--inline .el-form-item {
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
  margin-top: 10px;
}
</style>

