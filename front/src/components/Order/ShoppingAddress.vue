<template>
  <div class="ShoppingAddress">
    <div class="cut">
      <p>收货地址</p>
    </div>
    <div class="concenter">
      <div class="oldaddress">
        <p>已有收货地址</p>
      </div>
      <div class="oldaddlist">
        <div class="oldaddlist-title">
          <div style="width:80px;">收货人</div>
          <div style="width:440px;">收货地址</div>
          <div style="width:120px;">联系电话</div>
          <div style="width:80px;">操作</div>
          <div style="width:120px;">设为默认</div>
        </div>
        <div class="oldaddlist-content"  v-for="(item,index) in addressList">
          <div class="oldaddlist-content-item">
            <div style="width:80px;">{{item.receiveContact}}</div>
            <div style="width:440px;">{{item.regionProvinceName}} {{item.regionCityName}} {{item.regionCountyName}} {{item.receiveDetailedAddress}}</div>
            <!-- <div style="width:440px;">{{item.receiveAllAddress}}</div> -->
            <div style="width:120px;">{{item.receiveTel}}</div>
            <div style="width:80px;"><span class="editbtn" @click="editAddress(index)">编辑</span><span style="margin: 0 5px">|</span><span class="delbtn" @click="delAddress(index)">删除</span></div>
            <div style="width:120px;">
              <span v-if="item.receiveIsDefault==1" :class="[item.receiveIsDefault == '1' ? 'IsDefault' : 'setDefault']">默认地址</span>
              <span v-else :class="[item.receiveIsDefault == '1' ? 'IsDefault' : 'setDefault']" @click="setDefault(index)">设为默认</span>
            </div>
          </div>
        </div>
      </div>

      <div class="oldaddress" style="margin-top:50px">
          <p>新增收货地址</p>
      </div>
      <div class="addAddress">
        <el-form ref="formAdd" :model="formAdd" label-width="80px" :rules="rules">
          <el-form-item label="收货人" prop="receiveContact">
            <el-input v-model="formAdd.receiveContact" style="width:250px" placeholder="收货人姓名"></el-input>
          </el-form-item>
          <el-form-item label="地区" prop="regionCounty">
            <el-select v-model="formAdd.regionProvince" @change="choseProvince($event)" placeholder="省" style="width:160px">
              <el-option v-for="item in sheng" :key="item.regionId" :label="item.regionName" :value="item.regionId"></el-option>
            </el-select>
            <el-select v-model="formAdd.regionCity" @change="choseCity($event)" placeholder="市" style="width:160px">
              <el-option v-for="item in shi" :key="item.regionId" :label="item.regionName" :value="item.regionId"></el-option>
            </el-select>
            <el-select v-model="formAdd.regionCounty" placeholder="区" style="width:160px">
              <el-option v-for="item in qu" :key="item.regionId" :label="item.regionName" :value="item.regionId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="详细地址" prop="receiveDetailedAddress">
              <el-input type="textarea" :rows="2" placeholder="请在此处填写您的详细地址" v-model="formAdd.receiveDetailedAddress" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="receiveTel">
            <el-input v-model="formAdd.receiveTel" style="width:250px" placeholder="请填写您的手机号码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addSure('formAdd')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 修改模态框 -->
      <div class="address-edit">
        <el-dialog width="50%" title="收货地址" :visible.sync="dialogEditVisible">
          <el-form ref="formEdit" :model="formEdit"  :inline="true" :rules="rules">
            <el-form-item label="收货人" prop="receiveContact">
              <el-input v-model="formEdit.receiveContact" style="width:460px"></el-input>
            </el-form-item>
            <el-form-item label="收货地区"  prop="regionCounty">
              <el-select v-model="formEdit.regionProvince" v-bind:label="formEdit.regionProvinceName" @change="choseProvince($event);clearCC()" placeholder="省" style="width:150px">
                <el-option v-for="item in sheng" :key="item.regionId" :label="item.regionName" :value="item.regionId"></el-option>
              </el-select>
              <el-select v-model="formEdit.regionCity" v-bind:label="formEdit.regionCityName" @change="choseCity($event);clearC()" placeholder="市" style="width:150px">
                <el-option v-for="item in shi" :key="item.regionId" :label="item.regionName" :value="item.regionId"></el-option>
              </el-select>
              <el-select v-model="formEdit.regionCounty" v-bind:label="formEdit.regionCountyName" placeholder="区" style="width:150px">
                <el-option v-for="item in qu" :key="item.regionId" :label="item.regionName" :value="item.regionId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="详细地址"  prop="receiveDetailedAddress">
              <el-input type="textarea" v-model="formEdit.receiveDetailedAddress"  style="width:460px"></el-input>
            </el-form-item>
            <el-form-item label="联系电话"  prop="receiveTel">
              <el-input v-model="formEdit.receiveTel"  style="width:460px"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelDialog()">取 消</el-button>
            <el-button type="primary" @click="editSure('formEdit')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ShoppingAddress",
    components: {},
    
    data() {
      //表单验证飞控去空格后非空
      //收货人姓名
      var validateName = (rule, value, callback) => {
        if ( value.replace(/(^\s*)|(\s*$)/g, "") === '') {//前后去空格
          callback(new Error('请输入收货人姓名'));
        }else {
          callback();
        }
      };
      //地区
      var validateCounty = (rule, value, callback) => {
        if ( value.replace(/(^\s*)|(\s*$)/g, "") === '') {//前后去空格
          callback(new Error('请选择您所在的地区'));
        }else {
          callback();
        }
      };
      //详细地址
      var validateAddress = (rule, value, callback) => {
        if ( value.replace(/(^\s*)|(\s*$)/g, "") === '') {//前后去空格
          callback(new Error('请输入您的详细地址'));
        }else {
          callback();
        }
      };
      //电话
      var validateTel = (rule, value, callback) => {
        if ( value.replace(/(^\s*)|(\s*$)/g, "") === '') {//前后去空格
          callback(new Error('请输入您的手机号码'));
        }else {
          callback();
        }
      };
      
      return {
        addressList:[],

        formEdit: {},
        formEditBefore: {},   //存放当前修改地址的信息
        deleteid: '',         //删除当前地址的id
        dialogEditVisible: false,


        formAdd: {
          receiveContact: '',
          receiveDetailedAddress: '',
          receiveTel: '',
          regionProvince: '',
          regionCity: '',
          regionCounty: '',                   
        },
        shi: [],
        qu: [],
        sheng: [],

        tokenFront: '',
        customerId: '',

        rules: {
          receiveContact: [
            { required: true, validator: validateName, trigger: 'blur' },
          ],
          receiveDetailedAddress: [
            { required: true,  validator: validateAddress, trigger: 'blur' },
          ],
          receiveTel: [
            { required: true,  validator: validateTel, trigger: 'blur' },
            { pattern: /^[1][3,4,5,7,8][0-9]{9}$/,  message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          regionCounty: [
            { required: true, validator: validateCounty, trigger: 'blur' }
          ]
        },

        getDataUrl: 'http://'+this.$store.state.url+'/front/receive/getReceiveList',
        addUrl: 'http://'+this.$store.state.url+'/front/receive/addReceive',
        editUrl: 'http://'+this.$store.state.url+'/front/receive/updateReceive',
        delUrl: 'http://'+this.$store.state.url+'/front/receive/deleteReceive',
        setDefaultUrl: 'http://'+this.$store.state.url+'/front/receive/updateReceiveByDefault',
        getRegionUrl: 'http://'+this.$store.state.url+'/front/receive/getRegion',
      };
    },
    mounted: function () {
      this.$nextTick(function () {
        this.customerId=sessionStorage.getItem('customerId');
        this.tokenFront=sessionStorage.getItem('customertoken');

        this.getAddressData(); //获取地址列表
        this.getProvinceData();  //获取省信息
        
        document.getElementsByClassName("orderTitleContent")[2].style.color="#006cd9";
        document.getElementsByClassName("orderTitleContent")[2].style.fontWeight="bold";
      })
    },

    methods: {
      getAddressData(){
        this.$axios.defaults.headers.common['token']=this.tokenFront;
        this.$axios.get(this.getDataUrl+"?tokenFront="+this.tokenFront).then(res =>  {
          this.formEditBefore= {};
          this.deleteid= '';
          if(0==res.data.code){//查询成功
            console.log(res.data.data)
            this.addressList=res.data.data;
            console.log(this.addressList)
          }else{
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error'
            });
          }
        })
      },

      //确认增加
      addSure(formname){
        this.$refs[formname].validate((valid) => {
          if(valid){
            var params=new URLSearchParams();
            params.append('receiveContact',this.formAdd.receiveContact);
            params.append('regionProvince',this.formAdd.regionProvince);
            params.append('regionCity',this.formAdd.regionCity);
            params.append('regionCounty',this.formAdd.regionCounty);
            params.append('receiveDetailedAddress',this.formAdd.receiveDetailedAddress);
            params.append('receiveTel',this.formAdd.receiveTel);
            params.append('tokenFront',this.tokenFront);
            params.append('customerId',this.customerId);
            this.$axios.defaults.headers.common['token']=this.tokenFront;
            this.$axios.post(this.addUrl,params).then(res => {
              console.log(res.data.code)
              if(res.data.code==0){
                this.getAddressData();        //重新获取列表数据
                this.formAdd={};              //清空表单
                this.clearValidate('formAdd'); // 清除增加表单的校验
                this.$message({
                  showClose: true,
                  message: '增加收货地址成功',
                  type: 'success'
                });
              }else{
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'error'
                })
              }
            })
          }else{
            return false;
          }
        })
      },

      //修改模态框
      editAddress(index){       
        this.formEditBefore=this.addressList[index];    //将该条地址所有信息存在变量中
        this.dialogEditVisible=true;
        this.formEdit=this.formEditBefore;              //加载存在变量中的地址信息
        this.choseProvince(this.formEdit.regionProvince);
        this.choseCity(this.formEdit.regionCity);
      },

      //确认修改
      editSure(formname){
        this.$refs[formname].validate((valid) => {
          if(valid){
            var params=new URLSearchParams();
            params.append('receiveId',this.formEdit.receiveId);
            params.append('receiveContact',this.formEdit.receiveContact);
            params.append('regionProvince',this.formEdit.regionProvince);
            params.append('regionCity',this.formEdit.regionCity);
            params.append('regionCounty',this.formEdit.regionCounty);
            params.append('receiveDetailedAddress',this.formEdit.receiveDetailedAddress);
            params.append('receiveTel',this.formEdit.receiveTel);
            params.append('version',this.formEdit.version);
            params.append('tokenFront',this.tokenFront);
            this.$axios.defaults.headers.common['token']=this.tokenFront;
            this.$axios.put(this.editUrl,params).then(res => {
              if(res.data.code==0){
                this.getAddressData();         //重新加载列表
                this.$message({
                  showClose: true,
                  message: '修改此条收货地址成功',
                  type: 'success'
                });
                this.$refs[formname].clearValidate();     //清除表单验证
                this.dialogEditVisible = false;           //关闭修改模态框
              }else{
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'error'
                })
              }
            })
          }else{
            return false;
          }
        })
      },

      //删除
      delAddress(index){
        this.deleteid=this.addressList[index].receiveId; //将该条地址的id存在变量中
        this.$confirm('此操作将永久删除该条收货地址，是否继续?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params=new URLSearchParams();
          params.append('receiveId',this.deleteid);
          params.append('tokenFront',this.tokenFront);
          this.$axios.defaults.headers.common['token']=this.tokenFront;
          this.$axios.put(this.delUrl,params).then(res => {
            if(res.data.code==0){
              this.getAddressData();      //重新加载列表
              this.deleteid='';           //重置变量
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            }else{
              this.$message({
                showClose: true,
                type: 'error',
                message: res.data.msg
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },

      //设为默认地址
      setDefault(index){
        if(this.addressList[index].receiveIsDefault==0){          
          var params=new URLSearchParams();
          params.append('receiveId',this.addressList[index].receiveId);
          params.append('version',this.addressList[index].version);
          params.append('tokenFront',this.tokenFront);
          this.$axios.defaults.headers.common['token']=this.tokenFront;
          this.$axios.put(this.setDefaultUrl,params).then(res => {
            if(res.data.code==0){
              this.getAddressData();
              this.$message({
                showClose: true,
                message: '设置默认地址成功',
                type: 'success'
              });
            }else{
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: 'error'
              });
            }
          })
        }
      },

      //取消编辑
      cancelDialog(){
        this.clearC();
        this.clearCC();
        this.dialogEditVisible=false;
      },

      //清除表单验证
      clearValidate(formName){
        this.$refs[formName].clearValidate();
      },

      //获取省信息
      getProvinceData(){
        this.$axios.defaults.headers.common['token']=this.tokenFront;
        this.$axios.get(this.getRegionUrl+"?parentRegionID=0"+'&tokenFront='+this.tokenFront).then(res => {
          if(res.data.code==0){
            this.sheng=res.data.data;
          }else{
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error'
            });
          }
        })
      },

      //选中省后获取市
      choseProvince(e){
        this.$axios.defaults.headers.common['token']=this.tokenFront;
        this.$axios.get(this.getRegionUrl+"?parentRegionID="+e+'&tokenFront='+this.tokenFront).then(res => {
          if(res.data.code==0){
            this.formAdd.regionCity='';
            this.formAdd.regionCounty='';
            this.shi=res.data.data;
          }else{
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error'
            });
          }
        })
      },

      //选中市后获取区
      choseCity(e){
        this.$axios.defaults.headers.common['token']=this.tokenFront;
        this.$axios.get(this.getRegionUrl+"?parentRegionID="+e+'&tokenFront='+this.tokenFront).then(res => {
          if(res.data.code==0){
            this.formAdd.regionCounty='';
            this.qu=res.data.data;
          }else{
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error'
            });
          }
        })
      },

      //重置市区
      clearCC(){
        this.formAdd.regionCity="";
        this.formAdd.regionCounty="";
        this.formEdit.regionCity="";
        this.formEdit.regionCounty="";
      },

      //重置区
      clearC(){
        this.formAdd.regionCounty="";
        this.formEdit.regionCounty="";
      }
    },
  };

</script>


<style>
@import '../../assets/css/shoppingAddress.css'
</style>
