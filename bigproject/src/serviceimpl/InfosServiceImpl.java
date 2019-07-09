package serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import utils.Page;

import dao.InfosDao;
import entity.Touristinfo;
import service.InfosService;

@Service("infosService")
@Transactional
public class InfosServiceImpl implements InfosService {
	@Autowired
	private InfosDao infosDao;

	public List<Touristinfo> findInfosList() {
		List<Touristinfo> infos = infosDao.selectinfosList();
		return infos;
	}

	@Override
	public List<Touristinfo> queryInfosByName(String spot) {
		// 创建旅游信息对象
		List<Touristinfo> infos = infosDao.queryInfosByName(spot);
		return infos;
	}

	@Override
	public List<Touristinfo> infosList() {
		return infosDao.infosList();
	}

	@Override
	public int createInfo(Touristinfo info) {
		return infosDao.createInfo(info);
	}

	// 根据id获取信息
	@Override
	public Touristinfo getInfoById(Integer id) {
		Touristinfo touristinfo = infosDao.getInfoById(id);
		return touristinfo;
	}

	// 更新信息
	@Override
	public int updateInfo(Touristinfo touristinfo) {
		return infosDao.updateInfo(touristinfo);
	}

	// 删除商品分类信息
	@Override
	public int deleteCate(Integer id) {
		return infosDao.deleteCate(id);
	}

}
