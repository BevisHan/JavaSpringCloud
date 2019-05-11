<template>
  <div class="login-wrap">
    <div class="ms-title">后台管理系统</div>
    <div class="ms-login">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0px"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      deviceId: "", //设备id
      imgUrl: "", //图片路径
      ruleForm: {
        username: "",
        password: ""
      },
      loginUrl:"http://39.105.73.110:8080/admin/backend/login/userLogin", //登陆
        // loginUrl:this.$store.state.url+"backend/login/userLogin", //提交订单
      // loading:'',//加载遮罩
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]}
    };
  },
  methods: {
//登陆
     submitForm() {
      this.openFullScreen();
      var params = new URLSearchParams();
      params.append("userAccount",this.ruleForm.username);
      params.append("userPwd", this.ruleForm.password);
      this.$axios.post(this.loginUrl, params).then(res => {
        if (0 == res.data.code) {
          this.loading.close(); //关闭加载
          sessionStorage.setItem("customertoken", res.data.data);  
          this.$router.push("/home");
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          });
          this.ruleForm.password = "";
          this.ruleForm.validateCode = "";
        }
      });
    },
//遮罩
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: "登录中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.ms-title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -230px;
  text-align: center;
  font-size: 30px;
  color: #fff;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 200px;
  margin: -150px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  background: #fff;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
}
.code-width {
  width: 50%;
}
.code-img-width {
  width: 40%;
  margin-left: 5%;
  vertical-align: middle;
}
</style>
