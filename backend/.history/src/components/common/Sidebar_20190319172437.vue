<template>
    <div class="sidebar" :class="{ shortLength: isShortLength}">
      <div @click="letShort()" style="text-align:center;height:6%">
          <img class="closeOpen" :src="imgSrc" style="width:20px">
        </div>
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" :collapse="isCollapse" theme="dark" router>
            <template v-for="item in items">
                <template v-if="item.children.length > 0">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                          <i class="el-icon-menu"></i>
                          <span slot="title">{{ item.label }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.children" :key="i" :index="subItem.index" @click="getMenuCode(subItem)">
                          <i class="el-icon-tickets" ></i>
                          {{subItem.label}}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.label"  @click="getMenuCode(item)">
                        <!-- <i :class="item.icon"></i> -->
                        <i class="el-icon-tickets" ></i>
                        <span slot="title">{{ item.label }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: false,
      isShortLength:false,
      openeds:[],
      imgSrc:'../../../static/img/close.png',//收缩展示图片切换 默认
      items: [],
     // url: './static/datamenu.json',
      url:this.$store.state.url+'webauth/menu/listUserMenus',//查询左侧菜单,
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
    options () {
        return this.$store.state.options;
      },
  },
  mounted: function() {
    this.$nextTick(function() {
     // this.getMenu();//一进页面开始加载左侧菜单
      //此处改为刷新页面是返回首页 关闭其他tab
      this.$router.push('/home');
      this.$store.commit('add_tabs', {index: '/home' , name: '首页' });
      this.$store.commit('set_active_index', this.$route.path);
      this.$store.state.menuList = [];
       // 刷新时以当前路由做为tab加入tabs
      // if (this.$route.path !== '/' ) {//&& this.$route.path.indexOf('userInfo') == -1
      //   this.$store.commit('add_tabs', {index: this.$route.path , name: this.$route.name });
      //   this.$store.commit('set_active_index', this.$route.path);
      // } else {
      //   this.$store.commit('set_active_index', '/');
      //   this.$router.push('/');
      // }
    });
  },
  methods: {
    //获取菜单列表
    // getMenu() {
    //   var params = new URLSearchParams();
    //   params.append('USER_NAME',localStorage.getItem('ms_username'));
    //   //params.append('authCode', '2018033010092412205');
    //   this.$axios.post(this.url,params).then(res =>  {
    //       if(0==res.data.code){//查询成功
    //         this.items=res.data.data;
    //       }else{
    //       this.$message({
    //         showClose: true,
    //         message: res.data.msg,
    //         type: 'error'
    //       });
    //       }
    //     })
    // },
    getMenuCode(item){//获取菜单code 查询按钮权限时用到
     this.$store.state.menuCode=item.id;//给菜单code放到全局变量
     this.$store.state.menuCodeList["/"+item.index]=item.id//目的是为了浏览器返回时查询按钮的menucode发生改变 bycwg
    },
    letShort(){
      this.isCollapse=!this.isCollapse;
      if(true==this.isCollapse){
        this.imgSrc='../../../static/img/open.png'
       // this.imgSrc='./static/img/open.png'//测试服务器
        this.isShortLength=true;
        this.$emit('tools',1);
      }else{
       // this.imgSrc='./static/img/close.png'//测试服务器
        this.imgSrc='../../../static/img/close.png'
        this.isShortLength=false;
        this.$emit('tools',2);
      }
    },
    //header-home-sideber 根据头部传过来的一级菜单 查询左侧菜单
    findLeftMenu(e,flag) {
      this.isCollapse=true;
      this.letShort();
      this.getLeftMenuData(e,flag);//获取左侧菜单
    },
    //获取左侧菜单
    getLeftMenuData(val,flag){
       var params = new URLSearchParams();
       params.append('authCode',val);
        this.$axios.post(this.url,params).then(res =>  {
          console.log(res.data.data);
            if(0==res.data.code){
                this.items=res.data.data;
                this.$store.state.menuList =  this.$store.state.menuList.concat(res.data.data);
                this.$emit('barName');
            }else if(0==res.data.code){
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: 'error'
                });
                this.$store.commit("toLogin");
            }else{
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: 'error'
                });
            }
        })
    },
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  width: 250px;
  left: 0;
  top: 50px;
  bottom: 0;
  background: #242f42;
}
.sidebar > ul {
  height: 100%;
}
.shortLength{
  width:5%;
}
</style>
<style>
 .sidebar .el-dropdown-menu__item--divided:before,
 .sidebar .el-menu, 
 .sidebar .el-menu--horizontal>.sidebar .el-menu-item:not(.is-disabled):focus, 
 .sidebar .el-menu--horizontal>.sidebar .el-menu-item:not(.is-disabled):hover,
 .sidebar .el-menu--horizontal>.sidebar .el-submenu .el-submenu__title:hover{
  background-color: #242f42;
}
 .sidebar .el-menu-item{
  color: #fff;
}
 .sidebar .el-submenu__title{
  color: #fff;
  padding: 0 15px;
}
 .sidebar .el-menu-item, .el-submenu__title{
  line-height: 40px;
  height: 40px;
}
 .sidebar .el-submenu__title:hover{
  background-color: #242f42;
  color: #fff;
}
.sidebar .el-menu-item:focus, .el-menu-item:hover{
  background-color: #242f42;
  color: #fff;
}
.sidebar .el-menu-item.is-active{
  color: #409eff;
  /* background-color: #409eff; */
}
.el-menu-item,.el-submenu__title{
  height: 40px;
  line-height:40px;
}
</style>
