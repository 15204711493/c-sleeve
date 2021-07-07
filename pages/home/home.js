import {Theme} from "../../models/theme";
import {Banner} from "../../models/banner";
import {Category} from "../../models/category";
import {Activity} from "../../models/Activity";
import {SpuPaging} from "../../models/spu-paging";
import {CouponCenterType} from "../../core/enum";

Page({

    /**
     * 页面的初始数据
     */
    data: {
         themeA:null,
         bannerB:null,
         grid:[],
         activityD:null,
         themeE:null,
         themeESpu:[],
         themeF:null,
         bannerG:null,
         themeH:null,
         spuPaging:null,
         loadingType: 'loading'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
          this.initAllData()
          this.initBottomSpuList()


    },

    async initBottomSpuList(){
          const paging = SpuPaging.getLatestPaging();
          this.data.spuPaging = paging

          const data =  await paging.getMoreData();
          if(!data){
              return
        }
          wx.lin.renderWaterFlow(data.items)


    },

    async initAllData() {

        const theme = new Theme();
        await theme.getThemes();
        const themeA =  await theme.getHomeLocationA();
        const themeE =  await theme.getHomeLocationE();
        let themeESpu = []
        if(themeE.online){
            const data = await Theme.getHomeLocationESpu();
            if(data){
              themeESpu = data.spu_list.slice(0,8)
            }
        }
        const themeF =  await theme.getHomeLocationF();

        const bannerB = await Banner.getHomeLocationB();
        const grid = await Category.getHomeLocationC();
        console.log(grid);
        const activityD =await Activity.getHomeLocationD();
        console.log(activityD);


        const bannerG = await Banner.getHomeLocationG();
        const themeH = await theme.getHomeLocationH();
        this.setData({
            themeA,
            bannerB,
            grid,
            activityD,
            themeE,
            themeESpu,
            themeF,
            bannerG,
            themeH
        })

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: async function () {
      const data = await this.data.spuPaging.getMoreData();
      if(!data){
          return
      }

      wx.lin.renderWaterFlow(data.items)

        if(!data.moreData){
            console.log("sss")
            this.setData({
                loadingType: 'end'
            })
        }
    },

    onGOToCoupons(event) {
        const name = event.currentTarget.dataset.aname
        wx.navigateTo({
            url: `/pages/coupon/coupon?name=${name}&type=${CouponCenterType.ACTIVITY}`
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },



    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})