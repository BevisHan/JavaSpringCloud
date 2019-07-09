package dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import entity.Touristinfo;


public interface InfosDao {
	  //信息列表
		public List<Touristinfo> selectinfosList();
		
		public List<Touristinfo> infosList();
	   
		public int createInfo(Touristinfo info);
			
		//通过id获取信息`
		public Touristinfo getInfoById(Integer id);
		//更新信息
		public int updateInfo(Touristinfo info);
		//删除信息
		public int deleteCate(Integer cate_id);
		public List<Touristinfo> queryInfosByName(@Param("sname") String spot);

}
