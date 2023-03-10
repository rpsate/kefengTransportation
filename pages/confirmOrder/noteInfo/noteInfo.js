// pages/confirmOrder/noteInfo/noteInfo.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        noteInfo: "",
        countWords: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.note) {
            var noteInfo = options.note;
            var countWords = noteInfo.length;
           
            this.setData({
                noteInfo: noteInfo,
                countWords: countWords
            })
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
    noteInfoInput: function(e) {
        var noteInfo = app.filterEmoji(e.detail.value)
        this.setData({
            countWords: noteInfo.length,
            noteInfo: noteInfo
        });
    },
    addTip: function(e) {
        var tip = e.currentTarget.dataset.tip;

        if(this.data.noteInfo == "") {
            var noteinfo = tip;
        }else {
            var noteinfo = this.data.noteInfo + ";" + tip;
        }
        if(noteinfo.length>100) {
            return;
        }
        this.setData({
            noteInfo: noteinfo,
            countWords: noteinfo.length
        });
    },
    submit: function(e) {
        var pages = getCurrentPages();
        var page = pages[pages.length - 2];
        page.setData({
            note: this.data.noteInfo
        });
        wx.navigateBack({
            delta: 1,
        });
    }
})