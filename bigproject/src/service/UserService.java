package service;

import utils.Page;

import entity.User;

public interface UserService {
	public void reg(String username,String password);
	public User findUser(String username,String password);
	public User findUser2(String username,String password);
	public Page<User> findUserList(Integer page, Integer rows);
}
