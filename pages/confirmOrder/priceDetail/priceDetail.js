// pages/confirmOrder/priceDetail/priceDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        prices: [],        
        priceArrayX: [],
        totalPriceX: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var pages = getCurrentPages();
        var page = pages[pages.length - 2];

        var priceArrayX = page.data.priceArrayX;
        var totalPriceX = page.data.totalPriceX;

 
        //获取里程数
        var totalKilometre = 0;
        if (page.data.priceData.totalKilometre) {
            totalKilometre = page.data.priceData.totalKilometre
        }

        var prices = [];
        prices[0] = priceArrayX['startPrice'];
        prices[1] = priceArrayX['addWidth'];
        prices[2] = priceArrayX['addPlate'];
        
        this.setData({
            prices: prices,
            totalKilometre: totalKilometre,
            priceArrayX: priceArrayX,
            totalPriceX: totalPriceX
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})