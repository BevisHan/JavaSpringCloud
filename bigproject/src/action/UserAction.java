package action;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import utils.Page;

import entity.User;
import service.UserService;



@Controller
public class UserAction {
	@Autowired
	private UserService userService;
	@RequestMapping(value = "/login.action", method = RequestMethod.GET)//跳到登陆界面
	public String toLogin() {
	    return "login";
	}
	@RequestMapping(value = "/reg.action", method = RequestMethod.GET) //跳到注册页面
	public String toreg() {
	    return "register";
	}
	
	@RequestMapping(value = "/reg.action", method = RequestMethod.POST)//提交注册信息 成功后跳到登陆界面
	public String reg(String username,String password) {
		userService.reg(username, password);
		return "login";
	}
	@RequestMapping(value = "/login.action", method = RequestMethod.POST)//提交登陆信息 成功后跳到界面
	public String login(String username,String password, Model model, 
                                                          HttpSession session) {
		// 通过账号和密码查询用户
		User user = userService.findUser(username, password);
		User user2 = userService.findUser2(username, password);
		if(user != null){		
			// 将用户对象添加到Session
			session.setAttribute("USER_SESSION", user);
			// 跳转到主页面
			return "redirect:user/list.action";
		}
		if(user2 != null){		
			// 将用户对象添加到Session
			session.setAttribute("USER_SESSION", user2);
			// 跳转到主页面
			return "home";
		}
		if(user==null||user2==null) {
		model.addAttribute("msg", "账号或密码错误，请重新输入！");
		}
         // 返回到登录页面
		return "login";
	}
	@RequestMapping(value = "/user/list.action")//用戶列表
	public String list(@RequestParam(defaultValue="1")Integer page,
			@RequestParam(defaultValue="10")Integer rows, Model model) {
		// 所有用户列表
		Page<User> user = userService.findUserList(page, rows);
		model.addAttribute("page", user);	
	
		return "user_list";
	}
	@RequestMapping(value = "/logout.action")//退出登录
	public String logout(HttpSession session) {
	    // 清除Session
	    session.invalidate();
	    // 重定向到登录页面的跳转方法
	    return "redirect:login.action";
	}
}
