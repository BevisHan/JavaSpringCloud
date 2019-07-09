<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>旅游信息管理</title>
<!-- 引入css样式文件 -->
<!-- Bootstrap Core CSS -->
<link href="<%=basePath%>css/bootstrap.min.css" rel="stylesheet" />
<!-- MetisMenu CSS -->
<link href="<%=basePath%>css/metisMenu.min.css" rel="stylesheet" />
<!-- DataTables CSS -->
<link href="<%=basePath%>css/dataTables.bootstrap.css" rel="stylesheet" />
<!-- Custom CSS -->
<link href="<%=basePath%>css/sb-admin-2.css" rel="stylesheet" />
<!-- Custom Fonts -->
<link href="<%=basePath%>css/font-awesome.min.css" rel="stylesheet"
	type="text/css" />
<link href="<%=basePath%>css/boot-crm.css" rel="stylesheet"
	type="text/css" />
</head>
<body>
	<div>
		<ul>
			<li><a
				href="${pageContext.request.contextPath }/user/list.action"> <i></i>
					用户管理
			</a></li>
			<li><a
				href="${pageContext.request.contextPath }/infos/list.action"> <i></i>
					旅游信息管理
			</a></li>
		</ul>
	</div>
	<a href="#" class="btn btn-primary" data-toggle="modal"
		data-target="#newinfoDialog" onclick="cleargood()">新建</a>
	<div>用户：${USER_SESSION.user_name}</div>
	<a href="${pageContext.request.contextPath }/logout.action">退出登陆</a>
	<div class="panel panel-default">
		<div class="panel-body">
			<form class="form-inline" method="get"
				action="${pageContext.request.contextPath }/info/query.action">
				<div class="form-group">
					<label for="Spot">景点名称</label> <input type="text"
						class="form-control" id="Spot" value="" name="spot" />
				</div>
				<button type="submit" class="btn btn-primary">查询</button>
			</form>
		</div>
	</div>
<%-- 	<c:if test="${!empty rows }"> --%>
		<table>
			<thead>
				<tr>
					<th>编号</th>
					<th>城市</th>
					<th>省份</th>
					<th>级别</th>
					<th>景名</th>
					<th>地址</th>
					<th>建议游玩时间</th>
					<th>类型</th>
					<th>开园时间</th>
					<th>联系方式</th>
					<th>官网</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody>
				<c:forEach items="${scenes}" var="row">
					<tr>
						<td>${row.id}</td>
						<td>${row.city}</td>
						<td>${row.province}</td>
						<td>${row.grade}</td>
						<td>${row.spot}</td>
						<td>${row.addr}</td>
						<td>${row.visittime}</td>
						<td>${row.type}</td>
						<td>${row.opentime}</td>
						<td>${row.tel}</td>
						<td>${row.url}</td>
						<td><a href="#" class="btn btn-primary btn-xs"
							data-toggle="modal" data-target="#infoEditDialog"
							onclick="editinfo(${row.id})">修改</a> <a href="#"
							class="btn btn-danger btn-xs" onclick="deleteinfo(${row.id})">删除</a></td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	<%-- </c:if> --%>
<%-- 	<c:if test="${empty rows}">
		<h4>无类似景点信息</h4>
	</c:if> --%>
	<!-- 创建商品分类模态框 -->
	<div class="modal fade" id="newinfoDialog" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">新建景点信息</h4>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="new_info"
						enctype="multipart/form-data">
						<div class="form-group">
							<label for="edit_city" class="col-sm-2 control-label">
								景点城市 </label>
							<div class="col-sm-10">
								<input type="text" class="form-control" placeholder="景点城市"
									name="city" />
							</div>
						</div>

						<div class="form-group">
							<label for="edit_province" class="col-sm-2 control-label">景点省份</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" placeholder="景点省份"
									name="province" />
							</div>
						</div>
						<div class="form-group">
							<label for="edit_spot" class="col-sm-2 control-label">景点名</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" placeholder="景点名"
									name="spot" />
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
					<button type="button" class="btn btn-primary"
						onclick="createinfo()">创建</button>
				</div>
			</div>
		</div>
	</div>
	<!-- 修改商品模态框 -->
	<div class="modal fade" id="infoEditDialog" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">修改景点信息</h4>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="edit_info">
						<input type="hidden" id="edit_id" name="id" />
						<div class="form-group">
							<label for="edit_city" class="col-sm-2 control-label">
								景点城市 </label>
							<div class="col-sm-10">
								<input type="text" class="form-control" id="edit_city"
									placeholder="景点城市" name="city" />
							</div>
						</div>

						<div class="form-group">
							<label for="edit_province" class="col-sm-2 control-label">景点省份</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" id="edit_province"
									placeholder="景点省份" name="province" />
							</div>
						</div>
						<div class="form-group">
							<label for="edit_spot" class="col-sm-2 control-label">景点名</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" id="edit_spot"
									placeholder="景点名" name="spot" />
							</div>
						</div>

					</form>

				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
					<button type="button" class="btn btn-primary"
						onclick="updateinfo()">保存修改</button>
				</div>
			</div>
		</div>
	</div>
	<!-- 编写js代码 -->
	<script type="text/javascript">
	// 创建商品分类
	function cleargood() {
	}
		// 创建商品分类
		function createinfo() {
		$.post("${pageContext.request.contextPath}/info/create.action",			
		$("#new_info").serialize(),function(data){
		        if(data =="OK"){
		            alert("创建成功！");
		            window.location.reload();
		        }else{
		            alert("创建失败！");
		            window.location.reload();
		        }
		        
		    });
		}
		// 通过id获取修改信息
		function editinfo(id) {
			$.post("${pageContext.request.contextPath}/info/getInfoById.action",{"id":id},function(data){
				 $("#edit_id").val(data.id);
		         $("#edit_city").val(data.city);
		         $("#edit_province").val(data.province);
		         $("#edit_spot").val(data.spot);       
			});
		}
	    // 执行修改操作
		function updateinfo() {	
			$.post("${pageContext.request.contextPath}/info/update.action",$("#edit_info").serialize(),function(data){
				if(data =="OK"){
					alert("景点信息更新成功！");
					window.location.reload();
				}else{
					alert("景点信息更新失败！");
					window.location.reload();
				}
			});
		}
		// 删除商品分类
		function deleteinfo(id) {
		    if(confirm('确实要删除该旅游信息吗?')) {
		$.post("${pageContext.request.contextPath}/info/delete.action",{"id":id},
		function(data){
		            if(data =="OK"){
		                alert("删除成功！");
		                window.location.reload();
		            }else{
		                alert("删除失败！");
		                window.location.reload();
		            }
		        })}}
</script>
	<%@include file="/WEB-INF/footer.jsp"%>