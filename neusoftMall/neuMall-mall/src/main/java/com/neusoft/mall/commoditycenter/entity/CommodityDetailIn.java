package com.neusoft.mall.commoditycenter.entity;

import com.neusoft.common.entity.BaseEntity;
import lombok.Data;

/**
 * @ClassName: CommodityDetailIn
 * @Description:
 * @Author: Steven
 * @Date: 2019/4/17
 */
@Data
public class CommodityDetailIn extends BaseEntity {
    private String customerId;
    private String commodityId;
    private String tokenFront;
}