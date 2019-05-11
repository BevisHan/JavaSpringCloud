<template>
    <div class="repass">
       <div class="cutrepass">
           <p>修改密码</p>
        </div>
       <div class="conrepass">
         <div class="form">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
               <el-form-item label="当前登陆密码：" prop="customerPassword" >
                     <el-col :span="12" >   
                        <el-input v-model="ruleForm.customerPassword" placeholder="请输入原密码" type="password" id="customerPassword" clearable></el-input>               
                    </el-col>
               </el-form-item>
               <el-form-item label="新的登录密码：" prop="customerNewPassword" autocomplete="off">
                  <el-col :span="18">
                    <el-input v-model="ruleForm.customerNewPassword" placeholder="请输入新密码" id="customerNewPassword" type="password"   @focus="show()" @blur="show()" clearable></el-input>
                    <div class="passhidden" v-show="la">
                          <div id="p">密码强度：</div>
                          <div id="level" class="pw-strength">
                            <div class="pw-bar"></div> 
                            <div class="pw-bar-on"></div> 
                            <div class="pw-txt">
                            <span>弱</span> 
                            <span>中</span> 
                            <span>强</span> 
                            </div>
                          </div>
                     </div>
                  </el-col>
               </el-form-item>
               <el-form-item label="确认新的密码：" prop="checkPass" autocomplete="off" >
                  <el-col :span="12">   
                      <el-input v-model="ruleForm.checkPass" placeholder="请再次输入新密码" id='checkPass' type="password" clearable></el-input>
                  </el-col>
                </el-form-item>   
              </el-form>
                
              <div class="grid-content bg-purple" style="margin-left:59px;margin-top:50px;">
                <el-button type="primary"  @click="submitForm('ruleForm')" class="elbt">提交</el-button>
                <el-button @click="resetForm('ruleForm')" class="elbt">重置</el-button>
              </div>
         </div>
       </div>
    </div>
</template>

<script>
import { checkStrong } from "../../assets/js/checkpassStrong.js";
export default {
  name: "repass",
  components: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.customerNewPassword !== "") {
          this.$refs.ruleForm.validateField("customerNewPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.customerNewPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      la: false,
      tokenFront: "",
      customerId: "3952693a23b6478eb32d37e3afeb462f",
      ruleForm: {
        customerPassword: "",
        customerNewPassword: "",
        checkPass: ""
      },
      rules: {
        customerPassword: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        customerNewPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      },
      editPwdUrl:
        "http://" + this.$store.state.url + "/front/account/updatePassWord" //修改密码
    };
  },
  mounted() {
    this.tokenFront = sessionStorage.getItem("customertoken"),
    document.getElementsByClassName("orderTitleContent")[3].style.color =
        "#006cd9";
    document.getElementsByClassName("orderTitleContent")[3].style.fontWeight =
      "bold";
  },
  methods: {
    // 打开加载
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: "操作中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var params = new URLSearchParams();
          params.append("tokenFront", this.tokenFront);
          params.append("customerPassword", this.ruleForm.customerPassword);
          params.append(
            "customerNewPassword",
            this.ruleForm.customerNewPassword
          );
          this.openFullScreen(); //打开遮罩
          this.$axios.defaults.headers.common["token"] = this.tokenFront;
          this.$axios.put(this.editPwdUrl, params).then(res => {
            this.loading.close(); //关闭加载
            if (0 == res.data.code) {
              //修改成功
              console.log(res);
              this.$message({
                showClose: true,
                message: "修改密码成功",
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    show() {
      this.la = !this.la;
      console.log("aaaa");
    }
  },
};
</script>

<style scoped>
.cutrepass {
  width: 100%;
  height: 45px;
  line-height: 45px;
  background: white;
  text-align: left;
}
.cutrepass p {
  margin-left: 24px;
}
.conrepass {
  width: 957px;
  height: 630px;
  background: white;
  margin-top: 15px;
  padding: 20px;
}
.form {
  width: 67%;
  margin: 30px auto;
  margin-left: 25%;
}
.passhidden {
  width: 248px;
  height: 35px;
  margin-top: 10px;
  float: right;
  display: flex;
  justify-content: space-between;
}
.passhidden #p {
  font-size: 13px;
  color: red;
  margin-right: 3px;
}
#level {
  height: 35px;
  margin-top: 3px;
  overflow: hidden;
}

.pw-strength {
  clear: both;
  position: relative;
}
.pw-bar {
  background: url(../../assets/img/pwd-1.png) no-repeat;
  position: relative;
  top: 1px;
  height: 14px;
  overflow: hidden;
  width: 179px;
  background-size: 150px;
}
.pw-bar-on {
  background: url(../../assets/img/pwd-2.png) no-repeat;
  width: 0px;
  height: 14px;
  position: absolute;
  top: 1px;
  left: 2px;
  transition: width 0.5s ease-in;
  -moz-transition: width 0.5s ease-in;
  -webkit-transition: width 0.5s ease-in;
  -o-transition: width 0.5s ease-in;
  background-size: 150px;
}
.pw-weak .pw-defule {
  width: 0px;
}
.pw-weak .pw-bar-on {
  width: 50px;
}
.pw-medium .pw-bar-on {
  width: 100px;
}
.pw-strong .pw-bar-on {
  width: 168px;
}
.pw-txt {
  padding-top: 2px;
  width: 180px;
  overflow: hidden;
}
.pw-txt span {
  color: #707070;
  float: left;
  font-size: 12px;
  text-align: center;
  width: 48px;
}
</style>

<style>
.repass .elbt {
  width: 100px;
}
.repass .el-input {
  width: 200px;
}
.repass .el-form-item__content {
  line-height: 20px;
}
.repass .el-form-item__error {
  margin-left: 130px;
}
.repass .el-form-item {
  height: 50px;
}
</style>

