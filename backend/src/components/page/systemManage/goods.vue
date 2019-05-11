<template>
  <div class="goods">
    <!-- 查询模块 -->
    <div>
      <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline searchStyle" label-width="100px">
        <el-form-item label="一级类目" prop="categoryFirst">
          <!--prop 重置时用到  -->
          <el-input v-model="formInline.categoryFirst" clearable></el-input>
        </el-form-item>
        <el-form-item label="二级类目" prop="categorySecond">
          <el-input v-model="formInline.categorySecond" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="commodityId">
          <!--prop 重置时用到  -->
          <el-input v-model="formInline.commodityId" clearable></el-input>
        </el-form-item>
        <br>
        <el-form-item label="商品名称" prop="commodityName">
          <el-input v-model="formInline.commodityName" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否上架" prop="commodityIsSold">
          <!--prop 重置时用到  -->
          <el-input v-model="formInline.commodityIsSold" clearable></el-input>
        </el-form-item>

        <el-form-item label=" " label-width="40px">
          <el-button type="primary" @click="searchForm()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('formInline')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮组 -->
    <div class="handle-box">
      <el-button type="primary" icon="el-icon-edit" @click="editNews()">商品修改</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addShop('addInfo')">商品新增</el-button>
      <el-button type="primary" icon="el-icon-zoom-in" @click="lookInfo('editPwd')">商品查看</el-button>
      <el-button type="primary" icon="el-icon-delete" @click="delShop()">商品删除</el-button>
      <el-button type="primary" icon="el-icon-sort" @click="upStatu('editInfo')">上/下架</el-button>
      <!-- <el-button type="primary" icon="el-icon-download" @click="downStatu('editInfo')">下架</el-button> -->
    </div>
    <!-- 商品列表 -->
    <el-table :data="tableData" border stripe @select="chooseOne" @select-all="chooseAll" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="commodityId" label="商品id" fixed="left" sortable width="110"></el-table-column>
      <el-table-column prop="pictureAddress" label="商品首图" width="80">
        <template slot-scope="scope">
          <img :src="scope.row.pictureAddress" width="70" height="70">
        </template>
      </el-table-column>
      <el-table-column prop="commodityName" label=" 商品名称" width="300"></el-table-column>
      <el-table-column prop="categoryFirst" label="一级类目" width="100"></el-table-column>
      <el-table-column prop="categoryFirstName" label="一级类目名称" width="100"></el-table-column>
      <el-table-column prop="categorySecond" label="二级类目" width="100"></el-table-column>
      <el-table-column prop="categorySecondName" label="二级类目名称" width="100"></el-table-column>
      <el-table-column prop="commodityRetailPrice" label="零售价" width="80"></el-table-column>
      <el-table-column prop="commodityOriginalPrice" label="原价" width="80"></el-table-column>
      <el-table-column prop="commodityTotalCount" label="销量" width="80"></el-table-column>
      <el-table-column prop="commodityIsSold" label="是否上架" width="80"></el-table-column>
      <el-table-column prop="commodityColor" label="颜色" width="80"></el-table-column>
      <el-table-column prop="commodityIsRecommend" label="是否推荐" width="80"></el-table-column>
      <el-table-column prop="version" label="版本号" width="80"></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataSize"
      >
        <!-- pageNum 当前的页数 pageSize 每页显示的条目 total 总条目-->
      </el-pagination>
    </div>
    <!-- 各种按钮 模态框 开始-->
    <!-- 商品修改 模态框 -->
    <el-dialog width="65%" :inline="true" title="商品修改" :visible.sync="dialogEdit" :close-on-click-modal="false" class="userDialog" :before-close="cancelDialog">
      <el-row class="edit-row-one edit-row-one_e">
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">基本信息</div>
        </el-col>
      </el-row>
      <el-form :model="editInfo" class="edit-form" label-width="100px" :rules="rules" ref="editInfo" :inline="true" :label-position="'right'">
        <!-- <el-form  label-width="100px" :inline="true" :label-position="'right'"> -->
        <el-form-item label="商品id" prop="commodityId">
          <el-input v-model="editInfo.commodityId" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="commodityName">
          <el-input v-model="editInfo.commodityName" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="一级类目" prop="categoryFirst">
          <el-input v-model="editInfo.categoryFirst" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="二级类目" prop="categorySecond">
          <el-input v-model="editInfo.categorySecond" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="commodityRetailPrice">
          <el-input v-model="editInfo.commodityRetailPrice" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="原价" prop="commodityOriginalPrice">
          <el-input v-model="editInfo.commodityOriginalPrice" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="是否上架" prop="commodityIsSold">
          <el-select v-model="editInfo.commodityIsSold" class="inputWidth">
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库存" prop="commodityInventory">
          <el-input v-model="editInfo.commodityInventory" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="颜色" prop="commodityColor">
          <el-input v-model="editInfo.commodityColor" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="商品单位id" prop="commodityUnitId">
          <el-input v-model="editInfo.commodityUnitId" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="是否推荐" prop="commodityIsRecommend">
          <el-select v-model="editInfo.commodityIsRecommend" class="inputWidth">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="editInfo.version" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-row class="edit-row-one">
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">轮播图添加</div>
          </el-col>
        </el-row>
        <div class="edit-content">
          <!-- <img :src="imgurl" width="146px" height="146px"> -->
          <div class="picture">
            <el-upload
              :action="url"
              :headers="myHeaders"
              :data="uploaddata"
              list-type="picture-card"
              :file-list="fileList"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleAvatarSuccess"
              class="picture1"
              credentials="false"
            >
           <!-- on-preview:点击文件列表中已上传的文件时的钩子
                on-remove:文件列表移除文件时的钩子 
                on-success:文件上传成功时的钩子-->
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
        <el-row class="edit-row-one">
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">商品描述</div>
          </el-col>
        </el-row>
        <el-row>
          <quill-editor v-model="commodityDesc" ref="myQuillEditor" :options="editorOption"></quill-editor>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="editSure('editInfo')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 商品新增 模态框 -->
    <el-dialog width="60%" title="商品新增" :visible.sync="dialogShopAdd" :close-on-click-modal="false" class="userDialog">
      <el-form :model="addInfo" label-width="100px" :rules="rules" ref="addInfo" :inline="true" :label-position="'right'">
        <el-form-item label="商品名称" prop="commodityName">
          <el-input v-model="addInfo.commodityName" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="一级类目" prop="categoryFirst">
          <el-select v-model="addInfo.categoryFirst" class="inputWidth" @change="currentSelOne">
            <el-option
              v-for="item in CategoryNameListOne"
              :label="item.categoryName"
              :value="item.categoryId"
              :key="item.categoryName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级类目" prop="categorySecond">
          <el-select v-model="addInfo.categorySecond" class="inputWidth" @change="currentSelTwo">
            <el-option
              v-for="item in CategoryNameListTwo"
              :label="item.categoryName"
              :value="item.categoryId"
              :key="item.categoryName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="零售价" prop="commodityRetailPrice">
          <el-input v-model="addInfo.commodityRetailPrice" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="原价" prop="commodityOriginalPrice">
          <el-input v-model="addInfo.commodityOriginalPrice" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="是否上架" prop="commodityIsSold">
          <el-select v-model="addInfo.commodityIsSold" class="inputWidth">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库存" prop="commodityInventory">
          <el-input v-model="addInfo.commodityInventory" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="颜色" prop="commodityColor">
          <el-input v-model="addInfo.commodityColor" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="商品单位ID" prop="commodityUnitId">
          <el-select v-model="addInfo.commodityUnitId" class="inputWidth" @change="currentSelOne">
            <el-option
              v-for="item in CategoryUnitList"
              :label="item.unitName"
              :value="item.unitId"
              :key="item.unitName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否推荐" prop="commodityIsRecommend">
          <el-select v-model="addInfo.commodityIsRecommend" class="inputWidth">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-row class="edit-row-one">
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">轮播图添加</div>
          </el-col>
        </el-row>
        <div class="edit-content">
          <div class="picture">
            <el-upload
              :action="url"
              :headers="myHeaders"
              :data="uploaddata"
              list-type="picture-card"
              :file-list="fileList"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleAvatarSuccess"
              class="picture1"
            >
              <!-- on-preview:点击文件列表中已上传的文件时的钩子
                 on-remove:文件列表移除文件时的钩子 
              on-success:文件上传成功时的钩子-->
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
        <el-row class="edit-row-one">
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">商品描述</div>
          </el-col>
        </el-row>
        <el-row>
          <quill-editor v-model="commodityDesc" ref="myQuillEditor" :options="editorOption">
            <!-- @blur="onEditorBlur($event)" 
               @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"-->
          </quill-editor>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="addSure('addInfo')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看商品信息 模态框-->
    <el-dialog
      width="65%"
      :inline="true"
      title="商品信息"
      :visible.sync="dialogInfo"
      :close-on-click-modal="false"
      class="userDialog"
    >
      <el-form
        :model="getInfo"
        class="edit-form"
        label-width="100px"
        :rules="rules"
        ref="getInfo"
        :inline="true"
        :label-position="'right'"
      >
        <el-form-item label="商品名称" prop="commodityName">
          <el-input v-model="getInfo.commodityName" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="一级类目" prop="categoryFirst">
          <el-input v-model="getInfo.categoryFirst" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="一级类目名称" prop="categoryFirstName">
          <el-input v-model="getInfo.categoryFirstName" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="二级类目" prop="categorySecond">
          <el-input v-model="getInfo.categorySecond" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="二级类目名称" prop="categorySecondName">
          <el-input v-model="getInfo.categorySecondName" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="commodityRetailPrice">
          <el-input v-model="getInfo.commodityRetailPrice" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="原价" prop="commodityOriginalPrice">
          <el-input v-model="getInfo.commodityOriginalPrice" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="是否上架" prop="commodityIsSold">
          <el-select v-model="getInfo.commodityIsSold" class="inputWidth">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库存" prop="commodityInventory">
          <el-input v-model="getInfo.commodityInventory" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="颜色" prop="commodityColor">
          <el-input v-model="getInfo.commodityColor" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="商品单位id" prop="commodityUnitId">
          <el-input v-model="getInfo.commodityUnitId" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="是否推荐" prop="commodityIsRecommend">
          <el-select v-model="getInfo.commodityIsRecommend" class="inputWidth">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="getInfo.version" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-row class="edit-row-one">
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">轮播图查看</div>
          </el-col>
        </el-row>
        <div class="edit-content">
          <div class="picture">
            <el-upload list-type="picture-card" :file-list="fileList" class="picture1 picture2">
              <!-- on-preview:点击文件列表中已上传的文件时的钩子
                 on-remove:文件列表移除文件时的钩子 
              on-success:文件上传成功时的钩子-->
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
        <el-row class="edit-row-one">
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">商品描述</div>
          </el-col>
        </el-row>
        <el-row>
          <quill-editor v-model="commodityDesc" ref="myQuillEditor" :options="editorOption"></quill-editor>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 上架商品 模态框-->
    <el-dialog
      width="65%"
      :inline="true"
      title="商品上架"
      :visible.sync="dialogUp"
      :close-on-click-modal="false"
      class="userDialog"
      :before-close="cancelDialog"
    >
      <el-row class="edit-row-one edit-row-one_e">
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">基本信息</div>
        </el-col>
      </el-row>
      <el-form
        :model="editInfo"
        class="edit-form"
        label-width="100px"
        :rules="rules"
        ref="editInfo"
        :inline="true"
        :label-position="'right'"
      >
        <el-form-item label="商品id" prop="commodityId">
          <el-input v-model="editInfo.commodityId" clearable class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="上/下架" prop="commodityIsSold">
          <el-select v-model="addInfo.commodityIsSold" class="inputWidth">
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="版本号" prop="version">
          <el-input v-model="editInfo.version" clearable class="inputWidth"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="upSure('editInfo')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 各种按钮 模态框 结束-->
  </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor";
export default {
  data() {
    return {
      valnum:'',
      myHeaders: {
        // token:'2'
        token: sessionStorage.getItem("customertoken")
      },
      uploaddata: {
        tokenBackend: sessionStorage.getItem("customertoken")
      },
      url: this.$store.state.url + "/mall/backend/goods/uploadFile",
      // myHeaders:{'tokenBackend':sessionStorage.getItem('customertoken')},
      tokenBackend: "",
      commodityDesc: "", //富文本内容
      editorOption: {}, //富文本参数
      loading: "", //加载遮罩
      data: [], //部门菜单

      tableData: [],
      dataSize: 0, //获取的当前页的总条数
      dataSizePost: 0, //获取的当前列表里的总条数
      pageNum: 1, //默认当前页数
      pageNumPost: 1, //默认当前页数
      pageSize: 10, //每页显示条目个数，支持 .sync 修饰符
      pageSizePost: 10, //每页显示条目个数，支持 .sync 修饰符
      menuCode: "", //取store中的值
      menuButtonList: [], //菜单按钮列表
      formData: {}, //查询条件传值

      dialogEdit: false, //修改框默认隐藏
      dialogShopAdd: false, //新增框默认隐藏
      dialogInfo: false, //商品信息默认隐藏
      dialogUp: false, //上架框默认隐藏
      dialogDown: false, //下架框默认隐藏

      editUrl: this.$store.state.url + "/mall/backend/goods/updateGoods", //修改URL
      addUrl: this.$store.state.url + "/mall/backend/goods/addGoods", //新增URL
      getDataUrl: this.$store.state.url + "/mall/backend/goods/getGoodsList", //自动&&手动查询
      lookDataUrl: this.$store.state.url + "/mall/backend/goods/getGoodsDetail", //查看商品详情
      delUrl: this.$store.state.url + "/mall/backend/goods/deleteGoods", //删除
      upUrl: this.$store.state.url + "/mall/backend/goods/updateGoodsIsSell", //上架URL
      upload: this.$store.state.url + "/mall/backend/goods/uploadFile", //上传图片
      getCategoryNameUrl:
        "http://39.105.73.110:8082/front/commodity/getClassifyList", //二级联动URL
      autogetDataUrl:
        this.$store.state.url +
        "/mall/backend/commodityUnit/getCommodityUnitList", //自动查询
      formInline: {
        //快捷查询
      },
      formInlinePost: {
        //快捷查询-设置岗位
      },
      getInfo: {},
      addInfo: {},
      editInfo: {}, //需要修改的信息
      rules: {
        //表单验证
      },
      fileList: [], //新增图片列表
      fileurlarr: [],
      CategoryNameListOne: [], //二级联动数组
      CategoryNameListTwo: [], //二级联动数组
      CategoryUnitList: [] //二级联动数组
    };
  },
  watch: {
    pageNum: function() {
      this.getData();
    },
    pageSize: function() {
      this.getData();
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.getData(); //获取页面表格
      this.tokenBackend = sessionStorage.getItem("customertoken");
    });
  },
  methods: {
    // 商品单位ID
    getunit() {
      this.CategoryUnitList = [];
      var params = new URLSearchParams();
      params.append("tokenBackend", sessionStorage.getItem("customertoken"));
      this.$axios.defaults.headers.common["token"] = sessionStorage.getItem(
        "customertoken"
      );
      this.$axios.get(this.autogetDataUrl, { params }).then(res => {
        if (0 == res.data.code) {
          //查询成功
          for (var i = 0; i < res.data.data.length; i++) {
            this.CategoryUnitList.push({
              unitId: res.data.data[i].unitId,
              unitName: res.data.data[i].unitName
            });
          }
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    //新增二级联动----------------------------------------------------------
    currentSelOne(selVal) {
      // selVal为option中value中的值。
      this.addInfo.categoryFirst = selVal; //添加确认请求时使用。
      var params = { categoryParentId: selVal };
      this.$axios.get(this.getCategoryNameUrl, { params }).then(res => {
        if (0 == res.data.code) {
          //新增成功
          this.CategoryNameListTwo = res.data.data;
          this.$message({
            showClose: true,
            message: "查询成功",
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
          return; //如果联动请求错误返回错误信息并不进入模态框。
        }
      });
    },
    currentSelTwo(selVal) {
      this.addInfo.categorySecond = selVal;
    },
    getCategoryName() {
      var params = {
        categoryParentId: 0
      };
      this.$axios.get(this.getCategoryNameUrl, { params }).then(res => {
        if (0 == res.data.code) {
          //新增成功
          this.CategoryNameListOne = res.data.data;
          this.$message({
            showClose: true,
            message: "查询成功",
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
          return; //如果联动请求错误返回错误信息并不进入模态框。
        }
      });
    },
    // 文件上传-------------------------------------------------------------
    //文件移除
    handleRemove(file, fileList) {
      // file里包括文件名(name),文件大小(size),文件id(uid)
      this.fileList = fileList;
    },
    //文件响应函数
    handleAvatarSuccess(response, file, fileList) {
      this.fileList = fileList;
      // 获得返回的图片名字，然后存到fileurlarr中
      if (response.code == 0) {
        this.$message({
          showClose: true,
          message: "图片上传成功",
          type: "success"
        });
      } else {
        this.fileList.pop();
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //打开加载
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: "操作中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    //查询
    searchForm() {
      var params = new URLSearchParams();
      params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        commodityIsSold: this.formInline.commodityIsSold,
        categoryFirst: this.formInline.categoryFirst,
        categorySecond: this.formInline.categorySecond,
        commodityId: this.formInline.commodityId,
        commodityName: this.formInline.commodityName,
        tokenBackend: this.tokenBackend
      };
      this.$axios.defaults.headers.common["token"] = this.tokenBackend;
      this.$axios.get(this.getDataUrl, { params }).then(res => {
        this.loading.close(); //关闭加载
        if (0 == res.data.code) {
          //新增成功
          this.tableData = res.data.data.list;
          this.$message({
            showClose: true,
            message: "查询成功",
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
      if (1 != this.pageNum) {
        this.pageNum = 1; //每次查询从第一页开始
      } else {
        this.getData();
      }
    },
    //重置查询域
    resetForm(formInline) {
      this.$refs[formInline].resetFields();
    },
    //商品新增
    addShop(addInfo) {
      this.getCategoryName(); //二级联动请求函数
      this.getunit(); //商品单位id查询
      this.dialogShopAdd = true;

      if (this.$refs[addInfo]) {
        //清空表单
        this.$refs[addInfo].resetFields();
      }
    },
    //确认新增
    addSure(formName) {
      for (var i = 0; i < this.fileList.length; i++) {
        if (i == 0) {
          this.fileurlarr.push({
            pictureAddress: this.fileList[i].response.data,
            pictureIsFistPicture: 1
          });
        } else {
          this.fileurlarr.push({
            pictureAddress: this.fileList[i].response.data,
            pictureIsFistPicture: 0
          });
        }
      }
      var params = new URLSearchParams();
      params = {
        commodityName: this.addInfo.commodityName,
        categoryFirst: this.addInfo.categoryFirst,
        categorySecond: this.addInfo.categorySecond,
        commodityRetailPrice: this.addInfo.commodityRetailPrice,
        commodityOriginalPrice: this.addInfo.commodityOriginalPrice,
        commodityIsSold: this.addInfo.commodityIsSold,
        commodityInventory: this.addInfo.commodityInventory,
        commodityColor: this.addInfo.commodityColor,
        commodityUnitId: this.addInfo.commodityUnitId,
        commodityIsRecommend: this.addInfo.commodityIsRecommend,
        commodityDesc: this.commodityDesc,
        pictureList: this.fileurlarr,
        tokenBackend: this.tokenBackend
      };
      this.openFullScreen(); //打开遮罩
      this.$axios.defaults.headers.common["token"] = this.tokenBackend;
      this.$axios.post(this.addUrl, params).then(res => {
        this.loading.close(); //关闭加载
        if (0 == res.data.code) {
          //新增成功
          this.getData();
          this.commodityDesc = "";
          this.$message({
            showClose: true,
            message: "新增用户成功",
            type: "success"
          });
          this.dialogShopAdd = false; //隐藏dialo
          this.fileurlarr = [];
          this.fileList = [];
          this.commodityDesc = "";
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    //模态框中的取消按键
    cancelDialog() {
      this.dialogEdit = false; //修改框默认隐藏
      this.dialogShopAdd = false; //新增框默认隐藏
      this.dialogInfo = false; //商品信息默认隐藏
      this.dialogUp = false; //上架框默认隐藏
      this.dialogDown = false; //下架框默认隐藏
      this.fileList = [];
      this.fileListDetail = [];
      if (this.$refs["editInfo"]) {
        //清空表单
        this.$refs["editInfo"].resetFields();
      }
      if (1 != this.pageNumPost) {
        this.pageNumPost = 1; //每次查询从第一页开始
      }
    },
    //修改信息
    editNews(form) {
      if (this.editInfoBefore) {
        if (undefined != this.editInfoBefore.commodityId) {
          this.dialogEdit = true;
          this.fileList.push({ url: this.editInfoBefore.pictureAddress });
          this.commodityDesc = this.editInfoBefore.commodityDesc;
          this.editInfo = this.editInfoBefore;
          if (this.editInfo.commodityIsRecommend == 1) {
            this.editInfo.commodityIsRecommend = "是";
          } else {
            this.editInfo.commodityIsRecommend = "否";
          }
          if (this.editInfo.commodityIsSold == 1) {
            this.editInfo.commodityIsSold = "上架";
          } else {
            this.editInfo.commodityIsSold = "下架";
          }
        } else {
          this.$message({
            showClose: true,
            message: "请选择一条数据进行修改",
            type: "error"
          });
        }
      } else {
        this.$message({
          showClose: true,
          message: "请选择一条数据进行修改",
          type: "error"
        });
      }
    },
    //确认修改
    editSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var params = new URLSearchParams();
          for (var i = 0; i < this.fileList.length; i++) {
            if (this.fileList[0].response == undefined) {
              if (i == 0) {
                this.fileurlarr.push({
                  pictureAddress: this.fileList[i].url,
                  pictureIsFistPicture: 1
                });
              } else {
                this.fileurlarr.push({
                  pictureAddress: this.fileList[i].url,
                  pictureIsFistPicture: 0
                });
              }
            } else {
              if (i == 0) {
                this.fileurlarr.push({
                  pictureAddress: this.fileList[i].response.data,
                  pictureIsFistPicture: 1
                });
              } else {
                this.fileurlarr.push({
                  pictureAddress: this.fileList[i].response.data,
                  pictureIsFistPicture: 0
                });
              }
            }
          }
          if (this.editInfo.commodityIsSold == "上架") {
            this.editInfo.commodityIsSold = 1;
          } else {
            this.editInfo.commodityIsSold = 0;
          }
          if (this.editInfo.commodityIsRecommend == "是") {
            this.editInfo.commodityIsRecommend = 1;
          } else {
            this.editInfo.commodityIsRecommend = 0;
          }
          params = {
            commodityId: this.editInfo.commodityId,
            commodityRetailPrice: this.editInfo.commodityRetailPrice,
            commodityOriginalPrice: this.editInfo.commodityOriginalPrice,
            commodityInventory: this.editInfo.commodityInventory,
            commodityIsSold: this.editInfo.commodityIsSold,
            categoryFirst: this.editInfo.categoryFirst,
            categorySecond: this.editInfo.categorySecond,
            commodityId: this.editInfo.commodityId,
            commodityName: this.editInfo.commodityName,
            commodityColor: this.editInfo.commodityColor,
            commodityUnitId: this.editInfo.commodityUnitId,
            commodityIsRecommend: this.editInfo.commodityIsRecommend,
            version: this.editInfo.version,
            pictureList: this.fileurlarr,
            tokenBackend: this.tokenBackend
          };
          this.openFullScreen(); //打开遮罩
          this.$axios.defaults.headers.common["token"] = this.tokenBackend;
          this.$axios.put(this.editUrl, params).then(res => {
            this.loading.close(); //关闭加载
            if (0 == res.data.code) {
              //修改成功
              this.getData();
              this.commodityDesc = "";
              this.$message({
                showClose: true,
                message: "修改用户成功",
                type: "success"
              });
              this.dialogEdit = false; //隐藏dialo
              this.fileList = [];
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
    //查看信息
    lookInfo(form) {
      this.fileList = [];
      if (this.editInfoBefore) {
        if (undefined != this.editInfoBefore.commodityId) {
          var params = new URLSearchParams();
          params = {
            commodityId: this.editInfoBefore.commodityId,
            tokenBackend: this.tokenBackend
          };
          this.openFullScreen(); //打开遮罩
          this.$axios.defaults.headers.common["token"] = this.tokenBackend;
          this.$axios.get(this.lookDataUrl, { params }).then(res => {
            this.loading.close(); //关闭加载
            if (0 == res.data.code) {
              //上架成功
              this.getInfo = JSON.parse(JSON.stringify(res.data.data));
              // 对上架下架以及是否推荐的参数做一层处理，以满足用户的阅读效果。
              if (this.getInfo.commodityIsRecommend == 1) {
                this.getInfo.commodityIsRecommend = "是";
              } else {
                this.getInfo.commodityIsRecommend = "否";
              }
              if (this.getInfo.commodityIsSold == 1) {
                this.getInfo.commodityIsSold = "上架";
              } else {
                this.getInfo.commodityIsSold = "下架";
              }
              for (var i = 0; i < res.data.data.pictureList.length; i++) {
                this.fileList.push({
                  url: res.data.data.pictureList[i].pictureAddress
                });
              }
              this.commodityDesc = this.editInfoBefore.commodityDesc;
              // 把得到的信息返回到getinfo中,让查看模态框调用.
              this.dialogInfo = true; //打开模态框
            } else {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: "error"
              });
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: "请选择一条数据进行查看",
            type: "error"
          });
        }
      } else {
        this.$message({
          showClose: true,
          message: "请选择一条数据进行查看",
          type: "error"
        });
      }
    },
    // 上架操作
    upStatu(form) {
      if (this.editInfoBefore) {
        if (undefined != this.editInfoBefore.commodityId) {
          this.dialogUp = true;
          this.editInfo = this.editInfoBefore;
          if (this.editInfo.commodityIsSold == 1) {
            this.editInfo.commodityIsSold = "上架";
          } else {
            this.editInfo.commodityIsSold = "下架";
          }
        } else {
          this.$message({
            showClose: true,
            message: "请选择一条数据进行上架",
            type: "error"
          });
        }
      } else {
        this.$message({
          showClose: true,
          message: "请选择一条数据进行上架",
          type: "error"
        });
      }
    },
    // 确认上架
    upSure(formName) {
      var params = new URLSearchParams();
      if (this.editInfo.commodityIsSold == "上架") {
        this.editInfo.commodityIsSold = 1;
      } else {
        this.editInfo.commodityIsSold = 0;
      }
      params.append("commodityId", this.editInfo.commodityId);
      params.append("commodityIsSold", this.editInfo.commodityIsSold);
      params.append("version", this.editInfo.version);
      params.append("tokenBackend", this.tokenBackend);
      this.openFullScreen(); //打开遮罩
      this.$axios.defaults.headers.common["token"] = this.tokenBackend;
      this.$axios.put(this.upUrl, params).then(res => {
        this.loading.close(); //关闭加载
        if (0 == res.data.code) {
          //上架成功
          this.getData();
          this.$message({
            showClose: true,
            message: "商品上架成功",
            type: "success"
          });
          this.dialogUp = false; //隐藏dialo
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    //删除商品
    delShop() {
      if (this.valnum==1) {
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            var params = new URLSearchParams();
            params.append("commodityId", this.editInfoBefore.commodityId); //把商品id传过去
            params.append("tokenBackend", this.tokenBackend); //把商品token传过去
            this.openFullScreen(); //打开遮罩
            this.$axios.defaults.headers.common["token"] = this.tokenBackend;
            this.$axios.put(this.delUrl, params).then(res => {
              this.loading.close(); //关闭加载
              if (0 == res.data.code) {
                this.getData();
                this.editInfo = {};
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.valnum='';
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "error"
                });
                this.valnum='';
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
            this.valnum='';
          });
      } else {
        this.$message({
          showClose: true,
          message: "请选择一条数据进行删除",
          type: "error"
        });
        this.valnum='';
      }
    },
    //每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    //第几页
    handleCurrentChange(val) {
      this.pageNum = val;
      // console.log(this.pageNum)
      this.getData();
    },
    //选中checkbox，取消选中 此处返回的是以选中的val
    chooseOne(val) {
      this.valnum=val.length;
      if (1 == val.length) {
        //选中一条时将选中的值存起来 否则清空待修改
        // this.editInfoBefore = JSON.parse(JSON.stringify(val[0]));
        this.editInfoBefore = JSON.parse(JSON.stringify(val[0]));
        this.editInfoBefore.commodityInventory = "10";
      } else {
        this.editInfo = {};
        this.editInfoBefore = {};
      }
    },
    //全选
    chooseAll(val) {
      var shopCode = [];
      for (var i = 0; i < val.length; i++) {
        shopCode.push(val[i].shopCode);
      }
      this.delNum = shopCode.length;
      this.selectId = shopCode; //将选中的id存起来
      this.editInfo = {}; //将选中的信息存起来。
      this.editInfoBefore = {};
    },
    getData() {
      var list = [];
      this.tableData = list;
      var params = new URLSearchParams();
      params.append("pageSize", this.pageSize);
      params.append("pageNum", this.pageNum);
      params.append("tokenBackend", sessionStorage.getItem("customertoken"));
      this.openFullScreen(); //打开遮罩
      this.$axios.defaults.headers.common["token"] = sessionStorage.getItem(
        "customertoken"
      );
      this.$axios.get(this.getDataUrl, { params }).then(res => {
        this.loading.close(); //关闭加载
        this.editInfoBefore = {}; //控制checkBox一条信息，操作。
        // this.checkinfo = {}; //控制checkBox多条信息，操作。
        this.selectId = {}; //控制
        if (0 == res.data.code) {
          //查询成功
          this.tableData = res.data.data.list;
          // console.log(this.tableData)
          this.dataSize = res.data.data.totalRecords; //总条数
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
.goods .edit-form {
  margin-top: 15px;
}
.goods .edit-content {
  /* width: 100%; */
  height: 150px;
  border: 1px solid #e6e6e6;
  border-top: none;
  display: flex;
}
.goods .edit-row-one {
  height: 40px;
  background-color: #e6e6e6;
  margin-top: 20px;
}
.goods .edit-row-one_e {
  margin-top: 0px;
}
.goods .handle-box {
  margin-bottom: 20px;
}
.goods .goods .mar_top_12 {
  margin-top: 12px;
}
.goods .roleStyle {
  width: 250px;
  height: 35px;
  line-height: 35px;
  float: left;
  text-align: center;
  border: 1px solid #d1dbe5;
}
.goods .topNoStyle {
  border-top: none;
}
.goods .rightNoStyle {
  border-right: none;
}
.goods .tdStyle {
  width: 250px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #d1dbe5;
  border-top: none;
  /* border-right:none */
}
.goods .el-form-item {
  margin-bottom: 15px;
}
</style>
<style>
.goods .el-dialog {
  margin-top: 2vh !important;
}
/* 此处强制优先级 */
.goods .autoWidth .el-dialog {
  width: 650px;
}
.goods .changePassword .inputWidth {
  width: 250px;
}
.goods .userDialog .el-form-item__error {
  padding: 0;
}
.goods .changePassword .el-form-item__error {
  padding: 0;
}
.goods .searchStyle .el-form-item__label {
  line-height: 30px;
}
.goods .searchStyle .el-form-item__content {
  line-height: 30px;
}
.goods .grid-content {
  padding: 0px 5px 0px 10px;
  line-height: 40px;
}
.goods .el-select .el-input {
  width: 150px;
}
.goods .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.goods .picture {
  width: 250px;
}
.goods .picture1 {
  display: flex;
}
.goods .el-upload-list--picture-card {
  margin: 0;
  display: inline;
  vertical-align: top;
  display: flex;
}
.goods .el-upload--picture-card {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 4px;
  box-sizing: border-box;
  width: 30px;
  height: 148px;
  line-height: 146px;
  vertical-align: top;
}
.goods .el-select .el-input {
  width: 220px;
}
.goods .picture2:nth-child(2) {
  display: none;
}
</style>