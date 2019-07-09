package action;

import java.io.File;
import java.util.Calendar;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;



import utils.Page;
import entity.Touristinfo;

import service.InfosService;

@Controller
public class InfoAction {
	// 依赖注入
	@Autowired
	private InfosService infosService;

	/**
	 * 列表
	 */
	@RequestMapping(value = "/infos/list.action")
	public String list(Model model) {
		// 所有列表
		List<Touristinfo> scenes = infosService.findInfosList();
		model.addAttribute("scenes", scenes);
		return "info_list";
	}
	@RequestMapping("/info/query.action")
	public String querySceneByName(String spot,Model model) {
		List<Touristinfo> infos1=infosService.queryInfosByName(spot);
		model.addAttribute("scenes",infos1);
		return "info_list";
	}
	@RequestMapping(value = "/info/create.action", method = RequestMethod.POST)
	@ResponseBody
	public String create(Touristinfo info,HttpSession session) {
		int rows = infosService.createInfo(info);
		if(rows > 0){
			System.out.println("创建成功");
	        return "OK";
	    }else{
	    	System.out.println("创建失败");
	        return "FAIL";
	    }
	}
	public String getUniqueName() {
		String fileName="uploadfiles_";
		Calendar calendar=Calendar.getInstance();
		fileName=fileName+"y"+calendar.get(Calendar.YEAR)+"m"+(calendar.get(Calendar.MONTH)+1)+"d"+calendar.get(Calendar.DAY_OF_MONTH)+"h"+calendar.get(Calendar.HOUR_OF_DAY)+"m"+calendar.get(Calendar.MINUTE)+"s"+calendar.get(Calendar.SECOND);
		System.out.println(fileName);
		return fileName;
	}
	/**
	 * 通过id获取商品分类信息
	 */
	@RequestMapping("/info/getInfoById.action")
	@ResponseBody
	public Touristinfo getInfoById(Integer id) {
		Touristinfo info = infosService.getInfoById(id);
		return info;
	}

	/**
	 * 更新景点信息
	 */
	@RequestMapping("/info/update.action")
	@ResponseBody
	public String update(Touristinfo info) {	
	    int rows = infosService.updateInfo(info);
	    if(rows > 0){
	        return "OK";
	    }else{
	        return "FAIL";
	    }
	}
	
	/**
	 * 删除信息
	 */
	@RequestMapping("/info/delete.action")
	@ResponseBody
	public String cateDelete(Integer id) {
		int rows = infosService.deleteCate(id);
		if (rows > 0) {
			return "OK";
		} else {
			return "FAIL";
		}
	}
}
