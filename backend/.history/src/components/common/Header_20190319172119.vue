<template>
  <div class="header">
    <div class="logo">后台管理系统</div>
    <div class="user-info">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <img class="user-logo" src="../../../static/img/img.jpg">
          {{username}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="changePsw">修改密码</el-dropdown-item>
          <el-dropdown-item command="loginout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="headerSur">
      <el-tabs v-model="activeName" @tab-click="chooseFirstLeave">
        <el-tab-pane v-for="(x,i) in firstLeave" :label="x.label" :key="i" :name="x.id"></el-tab-pane>
      </el-tabs>
    </div>
    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogChangePsw"
      width="25%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="changePswList"
        :rules="rulesChangePsw"
        ref="changePswList"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="userPwd">
          <el-input type="password" v-model="changePswList.userPwd" clearable class="wid160"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword" class="mar-top-20">
          <el-input type="password" v-model="changePswList.newPassword" clearable class="wid160"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="changePswSure('changePswList')">确 定</el-button>
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
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      name: "cwg",
      activeName: "",
      firstLeave: [],
      changePswList: {
        userPwd: "",
        newPassword: ""
      },
      dialogChangePsw: false, //隐藏dialo
      getFirstleave: this.$store.state.url + "webauth/menu/listUserMenus", //获取一级菜单,
      changePassword: this.$store.state.url + "system/user/updatePwd", //修改密码,
      rulesChangePsw: {
        //新增菜单
        userPwd: [
          { required: true, validator: validatePass, trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        newPassword: [
          { required: true, validator: validatePass, trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    username() {
      let username = localStorage.getItem("ms_username");
      return username ? username : this.name;
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.getFirstLeaveData();
    });
  },
  methods: {
    handleCommand(command) {
      if (command == "loginout") {
        localStorage.removeItem("ms_username");
        this.$router.push("/login");
        this.$store.state.options = []; //推出时清空导航栏
      } else if (command == "changePsw") {
        this.dialogChangePsw = true;
      }
    },
    //获取一级菜单
    getFirstLeaveData() {
      var params = new URLSearchParams();
      params.append("USER_NAME", localStorage.getItem("ms_username"));
      var listDemo = [
        {
          children: Array(0),
          disabled: false,
          id: "2018033010092412205",
          index: "",
          label: "系统管理",
          pid: "0",
          type: "menu"
        }
      ];
      this.firstLeave =listDemo
       this.chooseFirstLeave(list, ""); //默认选中首页（第一个一级菜单）
    //   this.$axios.post(this.getFirstleave, params).then(res => {
    //     if (0 == res.data.code) {
    //       console.log(res.data.data);
    //      this.firstLeave = res.data.data;
    //      this.activeName=this.firstLeave[0].id;//默认选中一级菜单第一个
    //      let list = {
    //         name:this.firstLeave[0].id
    //       };
    //       this.chooseFirstLeave(list, ""); //默认选中首页（第一个一级菜单）
    //     } else if (0 == res.data.code) {
    //       this.$message({
    //         showClose: true,
    //         message: res.data.msg,
    //         type: "error"
    //       });
    //       this.$store.commit("toLogin");
    //     } else {
    //       this.$message({
    //         showClose: true,
    //         message: res.data.msg,
    //         type: "error"
    //       });
    //     }
    //   });
    },
    //点击一级菜单 header-home-sidebar
    chooseFirstLeave(tab, event) {
      this.$emit("menus", tab.name, ""); //传值给父组件
    },
    //工作台跳转时 重新选中对应的一级菜单
    // selectMenu(val) {
    //     alert(val.id)
    //   this.activeName = val.id;
    //   this.$store.state.subMenuName = [];
    //   this.$store.state.subMenuName.push(val.name);
    // },
    //取消修改密码
    cancelDialog() {
      this.dialogChangePsw = false; //隐藏dialo
    },
    //确认修改密码
    changePswSure(formName) {
      var params = new URLSearchParams();
      params.append("OLD_USER_PWD", this.changePswList.userPwd);
      params.append("USER_PWD", this.changePswList.newPassword);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post(this.changePassword, params).then(res => {
            if (0 == res.data.code) {
              //修改成功
              this.$message({
                showClose: true,
                message: "修改密码成功",
                type: "success"
              });
              this.dialogChangePsw = false; //隐藏dialo
              this.handleCommand("loginout"); //退出登陆
            } else if (0 == res.data.code) {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: "error"
              });
              this.$store.commit("toLogin");
            } else {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: "error"
              });
            }
          });
          this.dialogMenuAdd = false; //隐藏dialo
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.headerSur {
  width: 90%;
}
.header {
  position: relative;
  box-sizing: border-box;
  /* width: 100%; */
  height: 50px;
  font-size: 22px;
  line-height: 46px;
  color: #fff;
  /* display: inline-block; */
}
.header .logo {
  float: left;
  width: 250px;
  text-align: center;
}
.user-info {
  float: right;
  padding-right: 50px;
  font-size: 16px;
  color: #fff;
}
.user-info .el-dropdown-link {
  position: relative;
  display: inline-block;
  padding-left: 50px;
  color: #fff;
  cursor: pointer;
  vertical-align: middle;
}
.user-info .user-logo {
  position: absolute;
  left: 8px;
  top: 8px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
}
.el-dropdown-menu__item {
  text-align: center;
  font-size: 12px;
  line-height: 24px;
}
</style>
<style>
.headerSur .el-tabs__nav-wrap::after {
  background-color: initial;
}
.wid160 {
  width: 160px !important;
}
/*覆写一级菜单样式*/
.el-tabs__header {
  margin: 0;
  margin-right: 10px;
}
.el-tabs__nav-wrap::after {
  height: 0;
}
.el-tabs__active-bar {
  height: 0;
}
.el-tabs__item {
  color: white;
  height: 50px;
  line-height: 50px;
}
.el-tabs__item.is-active {
  color: white;
  background: #007b5e;
}

.el-tabs__nav {
  margin-top: 0px;
  /* float: right; */
}
.el-tabs__nav-prev {
  line-height: 50px;
}
.el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
.el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
.el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 20px;
}
.el-tabs--bottom .el-tabs__item.is-bottom:last-child,
.el-tabs--bottom .el-tabs__item.is-top:last-child,
.el-tabs--top .el-tabs__item.is-bottom:last-child,
.el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 20px;
}
.el-tabs__item:hover {
  /* color: white; */
}
</style>

