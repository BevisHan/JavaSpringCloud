<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<script src="${pageContext.request.contextPath}/js/jquery.min.js"></script>
<link href="${pageContext.request.contextPath}/css/bootstrap.min.css"
	rel="stylesheet" type="text/css" media="all" />
<script src="${pageContext.request.contextPath}/js/bootstrap.min.js"></script>
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
	<a href="${pageContext.request.contextPath }/logout.action">退出登陆</a>
	<table>
		<thead>
			<tr>
				<th>编号</th>
				<th>用户名</th>
				<th>密码</th>
				<th>权限</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach items="${page.rows}" var="row">
				<tr>
					<td>${row.user_id}</td>
					<td>${row.user_name}</td>
					<td>${row.user_pass}</td>
					<td>${row.user_rank }</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</body>
</html>