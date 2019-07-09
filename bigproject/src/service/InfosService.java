package service;

import utils.Page;

import java.util.List;



import entity.Touristinfo;

public interface InfosService {
	// 查询信息列表
	public List<Touristinfo> findInfosList();

	// 得到所有旅游信息
	public List<Touristinfo> infosList();

	// 创建分类
	public int createInfo(Touristinfo info);

	// 通过id获取商品分类信息
	public Touristinfo getInfoById(Integer id);

	// 更新商品分类
	public int updateInfo(Touristinfo info);

	// 删除商品分类信息
	public int deleteCate(Integer id);
	public List<Touristinfo> queryInfosByName(String spot);
}
