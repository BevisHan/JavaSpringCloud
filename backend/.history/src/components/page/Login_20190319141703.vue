<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名" ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input class="code-width" placeholder="验证码" v-model="ruleForm.validateCode" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                    <img v-bind:src="imgUrl" @click="getValidateCode" class="code-img-width">
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        data: function(){
            return {
                deviceId: '',//设备id
                imgUrl: '',//图片路径
                ruleForm: {
                    username: '',
                    password: '',
                    validateCode: ''
                },
                loginUrl: this.$store.state.url + 'uaa/auth/form',//登陆
                validateCodeUrl: this.$store.state.url + 'uaa/auth/code/image',//获取验证码
                loading:'',//加载遮罩
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    validateCode: [
                        { required: true, message: '请输入验证码', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted: function () {
            this.getValidateCode();
        },
        methods: {
            submitForm(formName) {
                                    this.$router.push('/home');
                             //       localStorage.setItem('ms_username',this.ruleForm.username);
              //  return;
                this.$store.state.options=[];
              //  Loading.service(options);
              this.openFullScreen();
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (valid) {
                            var params = new URLSearchParams();
                            params.append('username', this.ruleForm.username);
                            params.append('password', this.ruleForm.password);
                            params.append('imageCode', this.ruleForm.validateCode);
                            params.append('deviceId', this.deviceId);

                            // var params = {
                            //     'deviceId': this.deviceId,
                            //     'username': this.ruleForm.username,
                            //     'password': this.ruleForm.password,
                            //     'imageCode': this.ruleForm.validateCode
                            // };
                            this.$axios.post(this.loginUrl,params).then(res =>  {
                                this.loading.close(); //关闭加载
                                if(0==res.data.code){//登陆成功
                                    
                                   // this.$store.state.access_token=res.data.data.access_token
                                    //this.$store.state.refresh_token=res.data.data.refresh_token
                                    sessionStorage.setItem('access_token',res.data.data.access_token);
                                    sessionStorage.setItem('refresh_token',res.data.data.refresh_token);
                                    localStorage.setItem('ms_username',self.ruleForm.username);
                                    self.$router.push('/home');
                                }else{
                                    this.$message({
                                    type: 'error',
                                    message: res.data.msg
                                    });
                                    this.getValidateCode();//重新获取验证码
                                    this.ruleForm.password = '';
                                    this.ruleForm.validateCode = '';
                                }
                            })
                        } else {
                            return false;
                        }
                    } else {
                        this.loading.close(); //关闭加载
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //打开加载
            openFullScreen() {
                this.loading = this.$loading({
                lock: true,
                text: '登录中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
                });
            },
            // 获取验证码
            getValidateCode() {
                this.$axios.post(this.validateCodeUrl).then(res =>  {
                    if(0==res.data.code){//成功
                        var data = res.data.data;
                        this.deviceId = data.deviceId;
                        this.imgUrl = "data:image/jpg;base64," + data.image;
                    }else{
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
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
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
    .code-width{
        width:50%;
    }
    .code-img-width{
        width:40%;
        margin-left:5%;
        vertical-align: middle;
    }
    
</style>
