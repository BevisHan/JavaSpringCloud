package serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import utils.Page;

import dao.UserDao;
import entity.User;
import service.UserService;
@Service("userService")
@Transactional
public class UserServiceImpl implements UserService {
	@Autowired
	private UserDao userDao;
	@Override
	public void reg(String username, String password) {
		this.userDao.reg(username, password);
	}
	@Override
	public User findUser(String username,String password) {
		return this.userDao.findUser(username,password);
	}
	@Override
	public User findUser2(String username,String password) {
		return this.userDao.findUser2(username,password);
	}
	@Override
	public Page<User> findUserList(Integer page, Integer rows){
		
		// 创建商品对象
        User user = new User();

		// 当前页
		user.setStart((page-1) * rows) ;
		// 每页数
		user.setRows(rows);
		// 查询商品列表
		List<User> users = 
                           userDao.selectUserList(user);
		// 查询商品列表总记录数
		Integer count = userDao.selectUserListCount(user);
		// 创建Page返回对象
		Page<User
		> result = new Page<>();
		result.setPage(page);
		result.setRows(users);
		result.setSize(rows);
		result.setTotal(count);
		return result;
		
	}
}
