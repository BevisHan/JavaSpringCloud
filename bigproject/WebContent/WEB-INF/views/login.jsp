<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>登陆页面</title>
<link href="${pageContext.request.contextPath}/css/style.css"
	type=text/css rel=stylesheet>
<!-- Bootstrap Core CSS -->
<link href="${pageContext.request.contextPath}/css/bootstrap.min.css"
	rel="stylesheet" />
<script src="${pageContext.request.contextPath}/js/jquery-1.11.3.min.js">
	
</script>
<script>
	// 判断是登录账号和密码是否为空
	function check() {
		var username = $("#username").val();
		var password = $("#password").val();
		if (username == "" || password == "") {
			$("#message").text("账号或密码不能为空！");
			return false;
		}
		return true;
	}
</script>
</head>
<body>
	<div ALIGN="center">
		<table border="0" width="100%" cellspacing="0" cellpadding="0"
			id="table1">
			<tr>
				<td height="40"></td>
				<td></td>
			</tr>
			<tr>
				<fieldset style="width: 70%; margin: 0px auto;">
					<legend>
						<font style="font-size: 25px" face="宋体"> 欢迎使用旅游管理系统 </font>
					</legend>
					<font color="red"> <%-- 提示信息--%> <span id="message">${msg}</span>
					</font>
					<form action="${pageContext.request.contextPath }/login.action"
						method="post" onsubmit="return check()" class="form-horizontal">
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br /> <br /> 账&nbsp;号：<input
							id="username" type="text" name="username" /> <br /> <br />密&nbsp;码：<input
							id="password" type="password" name="password" /> <br /> <br />
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="submit"
							value="登录" />
					</form>
					</td>
			</tr>
		</table>
		<a href='${pageContext.request.contextPath }/reg.action'>-----注册-----</a>
		</fieldset>
	</div>
</body>
</html>