<template>
    <div>
        <div class="footer">
            <div class="footerTop">
                <div class="footerTop-item">
                    <div class="footerTop-item-ico"><img :src="footerZhengpin"></div>
                    <div class="footerTop-item-name">正品保障</div>
                </div>
                <div class="fengexian"></div>
                <div class="footerTop-item">
                    <div class="footerTop-item-ico"><img :src="footerWuliu"></div>
                    <div class="footerTop-item-name">极速物流</div>
                </div>
                <div class="fengexian"></div>
                <div class="footerTop-item">
                    <div class="footerTop-item-ico"><img :src=" footerShouhou"></div>
                    <div class="footerTop-item-name">无忧售后</div>
                </div>
                <div class="fengexian"></div>
                <div class="footerTop-item">
                    <div class="footerTop-item-ico"><img :src="LoginFooterFuwu"></div>
                    <div class="footerTop-item-name">特色服务</div>
                </div>
                <div class="fengexian"></div>
                <div class="footerTop-item">
                    <div class="footerTop-item-ico"><img :src="footerBangzhu"></div>
                    <div class="footerTop-item-name">帮助中心</div>
                </div>
            </div>
            <div class="footerMid">
                <div class="fmlist">
                    <p class="fmlist-title">购物指南</p>
                    <p class="fmlist-content">导购演示</p>
                    <p class="fmlist-content">免费注册</p>
                    <p class="fmlist-content">会员等级</p>
                    <p class="fmlist-content">常见问题</p>
                    <p class="fmlist-content">品牌大全</p>
                </div>
                <div class="fmlist">
                    <p class="fmlist-title">支付方式</p>
                    <p class="fmlist-content">网银支付</p>
                    <p class="fmlist-content">快捷支付</p>
                    <p class="fmlist-content">分期付款</p>
                    <p class="fmlist-content">货到付款</p>
                </div>
                <div class="fmlist">
                    <p class="fmlist-title">物流配送</p>
                    <p class="fmlist-content">免运费政策</p>
                    <p class="fmlist-content">配送服务承诺</p>
                    <p class="fmlist-content">签收验货</p>
                    <p class="fmlist-content">物流查询</p>
                </div>
                <div class="fmlist">
                    <p class="fmlist-title">售后服务</p>
                    <p class="fmlist-content">换退货政策</p>
                    <p class="fmlist-content">换退货流程</p>
                    <p class="fmlist-content">购买延保服务</p>
                    <p class="fmlist-content">退款说明</p>
                    <p class="fmlist-content">退换货申请</p>
                    <p class="fmlist-content">维修/保养</p>
                </div>
                <div class="fmlist">
                    <p class="fmlist-title">商家服务</p>
                    <p class="fmlist-content">商家入驻</p>
                    <p class="fmlist-content">培训中心</p>
                    <p class="fmlist-content">广告服务</p>
                    <p class="fmlist-content">商家帮助</p>
                    <p class="fmlist-content">服务市场</p>
                </div>
                <div class="fm-fengexian"></div>
                <div class="fm-right">
                    <h3>400-100-5678</h3>
                    <p>周一至周日 8:00-18:00</p>
                    <p>（仅收市话费）</p>
                    <div class="fm-right-btn">
                        <span>24小时在线客服</span>
                    </div>
                </div>
            </div>
       
        </div>
      <div class="footerFinal">
                版权所有 © 2001-2018 东软集团股份有限公司
            </div>
    </div>    
    
</template>
<script>
export default {
    data () {
        return {
           footerZhengpin:require("../../assets/img/footer-zhengpin.png"),
           footerWuliu:require("../../assets/img/footer-wuliu.png"),
           footerShouhou:require("../../assets/img/footer-shouhou.png"),
           LoginFooterFuwu:require("../../assets/img/Login-footer-fuwu.png"),
           footerBangzhu:require("../../assets/img/footer-bangzhu.png"),
        }
    }
    
}
</script>

<style>
 .footerFinal{
            width: 100%;
            height: 80px;
            background: rgb(245,245,245);
            text-align: center;
            line-height: 80px;
            font-size: 14px;
            color: rgb(110,110,110);
       
        }

</style>
