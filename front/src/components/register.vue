<template>
  <div class="register">
    <div class="LoginBody">
      <div class="LoginTop">
        <p>合约客户频道</p>
        <p>欢迎注册</p>
      </div>
      <div class="LoginCenter">
        <div class="Picture">
          <img :src="RegisterLogo">
          <div class="Login">
            <div class="VIPLogin">欢迎注册</div>
            <el-form
              :model="ruleForm2"
              status-icon
              :rules="rules2"
              ref="ruleForm2"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="用户姓名" prop="customerName">
                <el-input v-model="ruleForm2.customerName"></el-input>
              </el-form-item>
              <el-form-item label="用户账号" prop="customerNumber">
                <el-input v-model="ruleForm2.customerNumber"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="customerPassword">
                <el-input type="password" v-model="ruleForm2.customerPassword" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkcustomerPassword">
                <el-input
                  type="password"
                  v-model="ruleForm2.checkcustomerPassword"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm1" class="Register">注册</el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>
              </el-form-item>
            </el-form>
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
    var checkNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      }
    };
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("姓名不能为空"));
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.checkcustomerPassword) {
        console.log(value);
        console.log(this.ruleForm2.checkcustomerPassword);
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registeredUrl:
        "http://" + this.$store.state.url + "/front/account/registered", //注册接口地址
      selfPicture: require("../assets/img/SelfNumber.jpg"),
       RegisterLogo:require("../assets/img/Login-logo.png"),
      ruleForm2: {
        customerPassword: "",
        checkcustomerPassword: "",
        customerName: "",
        customerNumber: ""
      },
      rules2: {
        customerPassword: [{ validator: validatePass, trigger: "blur" }],
        checkcustomerPassword: [{ validator: validatePass2, trigger: "blur" }],
        customerName: [{ validator: checkName, trigger: "blur" }],
        customerNumber: [{ validator: checkNumber, trigger: "blur" }]
      }
    };
  },
  methods: {
//请求接口
    submitForm() {
      var params = new URLSearchParams();
      params.append("customerName", this.ruleForm2.customerName);
      params.append("customerNumber", this.ruleForm2.customerNumber);
      params.append("customerPassword", this.ruleForm2.customerPassword);
      this.$axios.post(this.registeredUrl, params).then(res => {
        if (0 == res.data.code) {
          this.$router.push("/");
        } else if (3 == res.data.code) {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
//判断表单信息，确认注册
    submitForm1() {
      if (
        this.ruleForm2.customerName == "" ||
        this.ruleForm2.customerNumber == "" ||
        this.ruleForm2.customerNumber == "" ||
        this.ruleForm2.checkcustomerPassword == ""
      ) {
        this.$message({
          message: "请完善信息",
          type: "warning"
        });
      } else if (
        this.ruleForm2.customerPassword !== this.ruleForm2.checkcustomerPassword
      ) {
        this.$message({
          message: "两次密码不一致",
          type: "warning"
        });
      } else {
        this.ruleForm2.customerName = this.ruleForm2.customerName.replace(
          /(^\s*)|(\s*$)/g,
          ""
        );
        this.submitForm();
      }
    },
//清空列表
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style>
.register h1,h2,h3,h4,h5,h6,ul,p,body,form,dl,dd,dt,img {
  padding: 0;
  margin: 0;
}
.register ul,
li {
  list-style: none;
}
.register a {
  color: black;
  text-decoration: none;
}
.register img {
  display: block;
  border: none;
}
.register .Register {
  margin: auto;
}
.register .el-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 80%;
  /* float: left; */
}
.register .el-form-item {
  margin-bottom: 15px;
  /* height: 50px; */
}
.register .LoginBody {
  width: 100%;
  height: 100vh;
  min-height: 800px;
  min-width: 1200px;
  background: #1a83f8;
}
.LoginTop {
  z-index: 1;
  width: 100%;
  height: 40px;
  position: fixed;
  top: 0;
  background: #f4f4f4;
}
.register .LoginBottom {
  z-index: 2222;
  width: 100%;
  height: 5vh;
  position: fixed;
  bottom: 0;
  background: #f4f4f4;
}

.register .LoginTop p {
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
.register .LoginTop p:first-child {
  font-size: 25px;
  color: #00a0ff;
  font-family: inherit;
  font-weight: 800;
  line-height: 40px;
  letter-spacing: 2px;
  margin-left: 5%;
}
.register .LoginBottom p {
  width: 1200px;
  margin: auto;
  height: 5vh;
  line-height: 5vh;
  font-size: 12px;
  text-align: center;
  font-weight: 400;
}
.register .LoginCenter {
  position: relative;
  width: 1200px;
  height: 90vh;

  margin: 0 auto;
}
.register .LoginCenter > .Picture {
  width: 100%;
  height: 525px;

  position: absolute;
  top: 15vh;
}
.register .LoginCenter > .Picture > img {
  display: block;
  width: 640px;
  height: 470px;
  float: left;
}
.register .Login {
  float: right;
  margin-right: 25px;
  width: 420px;
  height: 435px;
  background: white;
}
.register .VIPLogin {
  width: 100%;
  height: 75px;
  line-height: 75px;
  text-align: center;
  margin-bottom: 20px;
  box-sizing: border-box;
  border-bottom: 2px solid #f1f1f1;
  font-size: 20px;
  letter-spacing: 3px;
  font-weight: 800;
  color: #0064be;
}

.register .UserName,
.UserPassword {
  float: left;
  width: 310px;
  height: 100%;
  line-height: 100%;
  border: none;
  box-sizing: border-box;
  padding: 10px;
}
</style>
