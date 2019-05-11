<template>
  <div class="login">
    <div class="LoginBody">
      <div class="LoginTop">
        <p>合约客户频道</p>
        <p>欢迎登陆</p>
      </div>
      <div class="LoginCenter">
        <div class="Picture">
          <img :src="LoginLogo">
          <div class="Login">
            <div class="VIPLogin">会员登陆</div>
            <div class="VIPLogin-From">
              <li>
                <img :src="VIPLoginLight">
                <p>公共场所不建议自动登陆，以防账号丢失</p>
              </li>
              <li>
                <img :src="LoginUsername">
                <input
                  type="text"
                  name="uid"
                  class="UserName"
                  placeholder="请输入您的账号"
                  v-model="customerNumber"
                  required
                >
              </li>
              <li>
                <img :src="LoginPaaword">
                <input
                  type="password"
                  name="pass"
                  class="UserPassword"
                  placeholder="请输入您的密码"
                  v-model="customerPassword"
                  required
                >
              </li>
              <li>
                <input
                  type="text"
                  name="self"
                  class="SelfNumber"
                  placeholder="输入验证码"
                  v-model="SelfNumber"
                  required
                >
                <img :src="selfPicture">
              </li>
              <li>
                <input type="button" name="Login" class="toLogin" value="登陆" @click="LogintoShouYe">
              </li>
              <li>
                <p @click="toRegister">注册</p>
                <p>忘记密码?</p>
              </li>
            </div>
          </div>
        </div>
      </div>
      <div class="LoginBottom">
        <p>浙ICP备13002655号-1，Cropyright 2016 ZJMI EC ALL rights reserved.</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      customerNumber: "",
      customerPassword: "",
      SelfNumber: "",
      selfPicture: require("../assets/img/SelfNumber.jpg"),
      LoginLogo:require("../assets/img/Login-logo.png"),
      VIPLoginLight:require("../assets/img/VIPLogin-light.jpg"),
     LoginUsername:require("../assets/img/Login-username.png"),
     LoginPaaword:require("../assets/img/Login-Paaword.png"),
      userLoginUrl: "http://" + this.$store.state.url + "/front/account/userLogin"
    };
  },

  methods: {
    //登陆
    LogintoShouYe() {
      if (this.customerNumber == "") {
        this.$message({
          message: "请输入账号",
          type: "warning"
        });
      } else if (this.customerPassword == "") {
        this.$message({
          message: "请输入密码",
          type: "warning"
        });
      } else if (this.SelfNumber == "") {
        this.$message({
          message: "请输入验证码",
          type: "warning"
        });
      } else {
        var params = new URLSearchParams();
        params.append("customerNumber", this.customerNumber);
        params.append("customerPassword", this.customerPassword);
        this.$axios.post(this.userLoginUrl, params).then(res => {
          if (0 == res.data.code) {
            this.bus.$emit("customerPassword", res.data.customerPassword);
            console.log(res);
            sessionStorage.setItem("customerId", res.data.data[1]);
            sessionStorage.setItem("customertoken", res.data.data[0]);
            this.$router.push("/shouye");
          } else if (res.code != 0) {
            this.$message({
              message: "密码错误，请修改密码",
              type: "warning"
            });
            this.customerNumber = "";
            this.customerPassword = "";
            this.SelfNumber = "";
          }
        });
      }},
    //跳转注册页面
    toRegister() {
      this.$router.push("/register");
    }
  }
};
</script>
<style>
.login h1,h2,h3,h4,h5,h6,ul,p,body,form,dl,dd,dt,img {
  padding: 0;
  margin: 0;
}
.login ul,li {
  list-style: none;
}
.login a {
  color: black;
  text-decoration: none;
}
.login img {
  display: block;
  border: none;
}
.login .LoginBody {
  width: 100%;
  height: 100vh;
  min-height: 800px;
  min-width: 1200px;
  background: #1a83f8;
}
.LoginTop{
    z-index:0;
    width: 100%;
    height:40px;
    position: fixed;
      top: 0;
    background: #F4F4F4;

}
.login .LoginBottom {
  z-index: 2222;
  width: 100%;
  height: 5vh;
  position: fixed;
  bottom: 0;
  background: #f4f4f4;
}
.login .LoginTop p {
  height: 40px;
  line-height: 40px;
  float: left;
  margin-left: 20px;
  font-size: 20px;
  letter-spacing: 1px;
  font-weight: 600;
  color: red;
  font-family: inherit;
}
.login .LoginTop p:first-child {
  font-size: 25px;
  color: #00a0ff;
  font-family: inherit;
  font-weight: 800;
  line-height: 40px;
  letter-spacing: 2px;
  margin-left: 5%;
}
.login .LoginBottom p {
  width: 1200px;
  margin: auto;
  height: 5vh;
  text-align: center;
  line-height: 5vh;
  font-size: 12px;
  font-weight: 400;
}
.login .LoginCenter {
  z-index: 0;
  position: relative;
  width: 1200px;
  height: 90vh;
  margin: 0 auto;
}
.login .LoginCenter > .Picture {
  width: 100%;
  height: 525px;

  position: absolute;
  top: 15vh;
}
.login .LoginCenter > .Picture > img {
  display: block;
  width: 640px;
  height: 470px;
  float: left;
}
.login .Login {
  float: right;
  margin-right: 25px;
  width: 420px;
  height: 435px;
  background: white;
}
.login .VIPLogin {
  width: 100%;
  height: 75px;
  line-height: 75px;
  text-align: center;
  box-sizing: border-box;
  border-bottom: 2px solid #f1f1f1;
  font-size: 20px;
  letter-spacing: 3px;
  font-weight: 800;
  color: #0064be;
}
.login .VIPLogin-From {
  width: 360px;
  height: 325px;
  margin: auto;
  margin-top: 20px;
}
.login .VIPLogin-From > li:first-child {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: #fff5d3;
  box-sizing: border-box;
  border: 2px solid #faf5a3;
}
.login .VIPLogin-From > li:first-child > img {
  float: left;
  width: 25px;
  height: 23px;
  margin: 2px auto;
}
.login .VIPLogin-From > li:first-child > p {
  float: left;
  height: 30px;
  line-height: 30px;
  padding-left: 5px;
  font-size: 10px;
}
.login .VIPLogin-From > li {
  margin-top: 10px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  background: white;
  border: 2px solid #f2f2f2;
}
.login .VIPLogin-From > li > img {
  width: 46px;
  height: 46px;
  float: left;
  border: 2px solid #f2f2f2;
  box-sizing: border-box;
}
.login .UserName,
.UserPassword {
  float: left;
  width: 310px;
  height: 100%;
  line-height: 100%;
  border: none;
  box-sizing: border-box;
  padding: 10px;
}
.login .VIPLogin-From > li:nth-child(4) {
  border: none;
}
.login .VIPLogin-From > li:nth-child(4) > input {
  float: left;
  width: 125px;
  height: 80%;
  line-height: 80%;
  margin-top: 5px;
  border: none;
  box-sizing: border-box;
  border: 2px solid #f2f2f2;
  padding: 10px;
}
.login .VIPLogin-From > li:nth-child(4) > img {
  width: 85px;
  height: 80%;
  float: left;
  border: 2px solid #f2f2f2;
  box-sizing: border-box;
  margin-left: 20px;
  margin-top: 5px;
}
.login .VIPLogin-From > li:nth-child(5) > input {
  width: 100%;
  height: 100%;
  border: none;
  background: #0064be;
  color: white;
  letter-spacing:5px;
  cursor:pointer;
}
.login .VIPLogin-From > li:last-child {
  border: none;
}
.login .VIPLogin-From > li:last-child > p:first-child {
  height: 20px;
  line-height: 20px;
  float: left;
  font-size: 12px;
  margin-left: 10px;
  cursor:pointer;
}
.login .VIPLogin-From > li:last-child > p:last-child {
  height: 20px;
  line-height: 20px;
  float: right;
  font-size: 12px;
  margin-right: 10px;
  cursor:pointer;
}
</style>
