package dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import entity.User;

public interface UserDao {
	public void reg(@Param("username") String username, @Param("password") String password);

	public User findUser(@Param("username") String username, @Param("password") String password);
	public User findUser2(@Param("username") String username, @Param("password") String password);
	// 用户列表
	public List<User> selectUserList(User user);

	// 用户数
	public Integer selectUserListCount(User user);
}
