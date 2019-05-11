<template>
  <div class="collect">
		<div class="cut">
			<div class="cut-name" style="float:left">我的收藏</div>		
			<div class="searchbtn">
				<el-button type="primary" size="small" @click="searchCollect()">搜索</el-button>
			</div>
      <div class="searchinput">
				<el-input placeholder="请输入内容" v-model="search" size="small" style="width:280px" clearable>
				</el-input>
			</div>
		</div>

		<div class="concenter">
			<div class="collectbox">
				<div class="collectbox-title">
					<div style="width: 80px"></div>
					<div style="width: 400px">商品</div>
					<div style="width: 160px">价格</div>
					<div style="width: 160px">操作</div>
				</div>
				<div class="collectbox-content" v-for="(item,index) in collectList" :key="index">
					<div class="collectbox-content-item">
						<div style="width: 80px">
							<input type="checkbox" @click="chooseOne(item.commodityId,$event)" :id="item.commodityId" v-model="item.isCheckedOne">
						</div>
						<div class="collect-goods">
							<div class="collect-item-pic">
							<img :src="item.pictureAddress">
							</div>
							<div class="collect-item-name"><p>{{item.commodityName}}</p></div>
						</div>
						<div class="collect-price">￥{{item.commodityRetailPrice}}</div>
						<div class="collect-action"><span @click="cancelCollectOne(index)">取消关注</span></div>
					</div>
				</div>
				<div class="collectbox-chooseAll">
					<div class="chooseAllinput">
						<input type="checkbox"  @click="chooseAll($event)" :checked="isCheckedAll">
					</div>
					<div class="chooseAlltext">全选本页</div>
					<div class="chooseAllbtn"><span @click="cancelCollectMore()">取消关注所选商品</span></div>
				</div>
			</div>
		</div>
  </div>
</template>
 
<script>
export default {
  data () {
    return {
			search: '',
			tokenFront: '',
			collectList: [],
			chooseList: [],
			isCheckedAll: false,

			getCollectListUrl: 'http://'+this.$store.state.url+'/front/commodityCenter/commodityCollectionList',
			cancelCollectUrl: 'http://'+this.$store.state.url+'/front/commodityCenter/commodityCollection',
    }
  },
	mounted() {
		this.$nextTick(function () {
			this.tokenFront=sessionStorage.getItem('customertoken');
			this.getCollectData(); //获取收藏列表
			
			document.getElementsByClassName("orderTitleContent")[1].style.color="#006cd9";
            document.getElementsByClassName("orderTitleContent")[1].style.fontWeight="bold";
		})
	},
  methods:{
		//收藏列表
		getCollectData(){
			// var list=[
			// 	{
			// 		id: '12313256',
			// 		pictureAddress: 'https://img14.360buyimg.com/n7/jfs/t11449/362/795069270/205746/abc003f3/59f88dabNb51f3203.jpg',
			// 		commodityName: 'Curewe Kerein钱包男士款新品 多功能短款钱夹 横款多卡位休闲皮夹 黑色',
			// 		commodityRetailPrice: '99.00',
			// 		isCheckedOne:false
			// 	},
			// 	{
			// 		id: '2656565659',
			// 		pictureAddress: 'https://img14.360buyimg.com/n7/jfs/t11449/362/795069270/205746/abc003f3/59f88dabNb51f3203.jpg',
			// 		commodityName: '1Curewe Kerein钱包男士款新品 多功能短款钱夹 横款多卡位休闲皮夹 黑色',
			// 		commodityRetailPrice: '199.00',
			// 		isCheckedOne:false

			// 	},
			// 	{
			// 		id: '3568916615',
			// 		pictureAddress: 'https://img14.360buyimg.com/n7/jfs/t11449/362/795069270/205746/abc003f3/59f88dabNb51f3203.jpg',
			// 		commodityName: '2Curewe Kerein钱包男士款新品 多功能短款钱夹 横款多卡位休闲皮夹 黑色',
			// 		commodityRetailPrice: '299.00',
			// 		isCheckedOne:false

			// 	}
			// ];
			// this.chooseList=[];
			// this.collectList=list
			// return;

			var params=new URLSearchParams();
			params.append('tokenFront',this.tokenFront);
			this.$axios.defaults.headers.common['token']=this.tokenFront;
			this.$axios.post(this.getCollectListUrl,params).then(res => {
				if(res.data.code==0){
					this.chooseList=[];
					this.collectList=res.data.data;
				  //  console.log(this.collectList);
					for(var i=0;i<this.collectList.length;i++){
						var col={'isCheckedOne': 'false'};
						this.collectList[i].isCheckedOne=false;
						var checkboxDo=document.getElementById(this.collectList[i].commodityId);
						// console.log(checkboxDo)
						checkboxDo.checked=false;
					} 
					
					
					
				}else if(res.data.code==4){
					this.chooseList=[];
					this.collectList=[];
					this.$message({
						showClose: true,
						message: '您没有收藏信息',
						type: 'warning'
					});
				}else{
					this.$message({
						showClose: true,
						message: res.data.msg,
						type: 'error'
					});
				}
			})
		},


		//搜索
		searchCollect(){
			if(this.search==""){
				this.getCollectData();
			}else{
				var params=new URLSearchParams();
			  params.append('tokenFront',this.tokenFront);
				params.append('commodityName',this.search);
				this.$axios.defaults.headers.common['token']=this.tokenFront;
				this.$axios.post(this.getCollectListUrl,params).then(res => {
					if(res.data.code==0){
						this.chooseList=[];
						this.collectList=res.data.data;
						for(var i=0;i<this.collectList.length;i++){
							var col={'isCheckedOne': 'false'};
							this.collectList[i].isCheckedOne=false;
						}
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

		//取消收藏单个
		cancelCollectOne(index){
			var cancelOne=[];

			var collectionList=[{'commodityId':this.collectList[index].commodityId, 'collectFlag':'0'}];
			var parms={'tokenFront':this.tokenFront,'collectionList':collectionList};
			// console.log(collectionList);
			this.$axios.defaults.headers.common['token']=this.tokenFront;
			this.$axios.post(this.cancelCollectUrl,parms).then(res => {
				if(res.data.code==0){
					this.getCollectData();
					// location.reload();
					this.$message({
						showClose: true,
						message: '取消收藏成功',
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
		},

		//选择单个
		chooseOne(index,e){
			if(e.target.checked){
				this.chooseList.push(index)
			}else{
				this.chooseList.splice(this.chooseList.indexOf(index),1)
			}
			// console.log(this.chooseList);

			if(this.chooseList.length == this.collectList.length){
				this.isCheckedAll=true;
			}else{
			  this.isCheckedAll=false;
			}
		},

		//全选
		chooseAll(e){
			this.chooseList=[];
			if(this.isCheckedAll==false){
				this.isCheckedAll=true;
				for(var i=0;i<this.collectList.length;i++){
					this.collectList[i].isCheckedOne=true;
					this.chooseList.push(this.collectList[i].commodityId);
				}
			}else{
				this.isCheckedAll=false;
				for(var i=0;i<this.collectList.length;i++){
					this.collectList[i].isCheckedOne=false;
				}
				this.chooseList=[];
			}
			// console.log(this.chooseList);

		},

		//取消收藏所选
		cancelCollectMore(){
			var cancelMore=[];
			if(this.chooseList.length==0){
				alert("请选择至少一条取消收藏");
			}else{
				for(var i=0;i<this.chooseList.length;i++){
					var cols={'commodityId':this.chooseList[i], 'collectFlag':'0'};
					cancelMore.push(cols);
				}
				var parms={'tokenFront':this.tokenFront,'collectionList':cancelMore};
				this.$axios.defaults.headers.common['token']=this.tokenFront;
				this.$axios.post(this.cancelCollectUrl,parms).then(res => {
					if(res.data.code==0){
						this.getCollectData();
						this.$message({
							showClose: true,
							message: '取消收藏成功',
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
		
  }
}
</script>



<style>
@import '../../assets/css/collect.css'

</style>