// pages/me/usuallyAddress/usuallyAddress.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageFrom: null,
        addressData: [],
        addressDataItem: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAddress();
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
        if (this.data.pageFrom == "addAddress") {
            this.getAddress();
        }
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
    addAddress: function (e) {
        wx.navigateTo({
            url: '../addAddress/addAddress'
        });
    },
    //删除常用路线
    removeAddress: function (e) {
        var id = e.currentTarget.id;
        var title = e.currentTarget.dataset.title;
        var myId = e.currentTarget.dataset.myid;
        wx.showModal({
            title: '提醒',
            content: '确定要删除' + title + '吗？',
            confirmColor: '#0783e8',
            success: e => {
                this.deleteAddress(myId);
            }
        });
    },
    //编辑常用路线
    editAddress: function (e) {
        var id = e.currentTarget.id;
        var myId = e.currentTarget.dataset.myid;
        var addressDataItem = this.data.addressData[id];
        this.setData({
            addressDataItem: addressDataItem
        });
        wx.navigateTo({
            url: '../addAddress/addAddress?mode=edit&myid=' + myId
        });
    },
    postOrder: function (e) {
        var id = e.currentTarget.id;
        var addressDataItem = this.data.addressData[id];
        this.setData({
            addressDataItem: addressDataItem
        });
        wx.navigateTo({
            url: '../../confirmOrder/confirmOrder/confirmOrder'
        });
    },
    //获取地址
    getAddress: function(e) {
        wx.request({
            url: app.globalData.host + '/cordController/selMyTrend',
            method: 'POST',
            header: { "contentType": "application/json;charset=utf-8" },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: {
                loginToken: app.globalData.loginToken,
                fid: 2,
                clientType: "3",
                userId: app.globalData.parameter.id,
            },
            success: e => {
                if (e.data.code == 200) {
                    var addressData = e.data.parameter;
                    this.setData({
                        addressData: addressData
                    });
                } else if (e.data.code == 888) {
                    wx.showModal({
                        title: '提示',
                        content: '登录已过期，请重新登录！',
                        showCancel: true,
                        cancelText: '取消',
                        confirmText: '确认',
                        confirmColor: '#0783e8',
                        success: function (e) {
                            if (e.confirm) {
                                wx.navigateTo({
                                    url: '../../login/login'
                                });
                            }
                        }
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        content: e.data.message,
                        showCancel: false,
                        confirmColor: '#0783e8',
                        success: function (e) {
                            if (e.confirm) {
                                wx.navigateBack({
                                    delta: 1,
                                });
                            }
                        }
                    })
                }
            },
            fail: function (e) {
                wx.hideLoading();
                wx.showToast({
                    title: '连接服务器出错，请检查网络！',
                    icon: 'none'
                });
            }
        });
    },
    //删除地址
    deleteAddress: function(myId) {
        wx.request({
            url: app.globalData.host + '/cordController/delMyTrend',
            method: 'POST',
            header: { "contentType": "application/json;charset=utf-8" },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: {
                loginToken: app.globalData.loginToken,
                fid: 2,
                clientType: "3",
                userId: app.globalData.parameter.id,
                myId: myId
            },
            success: e => {
                if (e.data.code == 200) {
                    wx.showToast({
                        title: '删除成功',
                        icon: 'none',
                        image: '',
                        success: e => {
                            this.getAddress();
                        }
                    })
                } else if (e.data.code == 888) {
                    wx.showModal({
                        title: '提示',
                        content: '登录已过期，请重新登录！',
                        showCancel: true,
                        cancelText: '取消',
                        confirmText: '确认',
                        confirmColor: '#0783e8',
                        success: function (e) {
                            if (e.confirm) {
                                wx.navigateTo({
                                    url: '../../login/login'
                                });
                            }
                        }
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        content: e.data.message,
                        showCancel: false,
                        confirmColor: '#0783e8',
                        success: function (e) {
                            if (e.confirm) {
                                wx.navigateBack({
                                    delta: 1,
                                });
                            }
                        }
                    })
                }
            },
            fail: function (e) {
                wx.hideLoading();
                wx.showToast({
                    title: '连接服务器出错，请检查网络！',
                    icon: 'none'
                });
            }
        });
    }
})