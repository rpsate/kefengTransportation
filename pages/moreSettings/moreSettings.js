// pages/moreSettings/moreSettings.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        feedbackCount: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.feedbackCount) {
            this.setData({
                feedbackCount: parseInt(options.feedbackCount)
            });
        }
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

    },
    gotoProtocol: function(e) {
        wx.navigateTo({
            url: '../moreSettings/userProtocol/userProtocol'
        });
    },
    gotoPriceDetail: function(e) {
        wx.navigateTo({
            url: '../moreSettings/priceDetail/priceDetail'
        }); 
    },
    gotoFeedback: function(e) {
        wx.navigateTo({
            url: '../moreSettings/feedback/feedback?feedbackCount='+this.data.feedbackCount
        });
    },
    logout: function(e) {
        wx.setStorageSync("parameter", "");
        app.globalData.parameter = "";
        app.globalData.loginToken = "";
        app.globalData.isLogin = false;
        app.globalData.isSwitchAccount = [true, true, true, true]
        wx.navigateBack({
            delta: 1,
        });
    }
})