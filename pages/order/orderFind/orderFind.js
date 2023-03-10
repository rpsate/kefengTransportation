// pages/order/orderFind/orderFind.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        timeMenu: ["active"],
        timeStartStamp: "",
        timeEndStamp: "",
        timeStart: "",
        timeEnd: "",

        nearlyMonthStamp: "",
        thisMonthStamp: "",
        lastMonthStamp: "",
        lastMonthEndStamp: "",
        nowStamp: "",
        nowDate: "",

        keyWords: "",

        orderData: null,
        isAndroid: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        wx.getSystemInfo({
            success: e => {
                if (e.platform == "ios") {
                    this.setData({
                        isAndroid: false
                    });
                }
            }
        });
        

        var time = new Date();
        var years = time.getFullYear();
        var months = time.getMonth()+1;
        var days = time.getDate();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();

        var nowDate = years+"-"+months+"-"+days;//选择器最大选择日期
        var timeEnd = years+"."+months+"."+days;//默认截止时间
        
        

        var nowStamp = time.getTime();
        var nearlyMonthStamp = parseInt(new Date().getTime()) - parseInt(30 * 24 * 60 * 60 * 1000);
        
        if(this.data.isAndroid) {
            var thisMonthStamp = new Date(years + "-" + months + "-1 00:00:00").getTime();
        }else {
            var thisMonthStamp = new Date(years + "/" + months + "/1 00:00:00").getTime();

        }
        //求上一个月时间戳
        var lastMonth = parseInt(months) - 1;
        var lastMonthYear = years;
        if (lastMonth == 0) {
            lastMonth = 12;
            lastMonthYear -= 1;
        }
        
        if(this.data.isAndroid) {
            var lastMonthStamp = new Date(lastMonthYear + "-" + lastMonth + "-1 00:00:00").getTime();
        }else {
            var lastMonthStamp = new Date(lastMonthYear + "/" + lastMonth + "/1 00:00:00").getTime();
        }

        //求上月结时的时间戳
        var lastMaxDay = 30;
        switch(lastMonth) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                lastMaxDay = 31;
                break;
            case 2:
                lastMaxDay = 28;
        }

        if (this.data.isAndroid) {
            var lastMonthEndStamp = new Date(lastMonthYear + "-" + lastMonth + "-" + lastMaxDay+" 23:59:59").getTime();
        } else {
            var lastMonthEndStamp = new Date(lastMonthYear + "/" + lastMonth + "/" + lastMaxDay+" 23:59:59").getTime();
        }
        

        //设置默认起始时间
        var nearlyMonth = new Date(nearlyMonthStamp);
        var timeStart = nearlyMonth.getFullYear() + "." + (parseInt(nearlyMonth.getMonth())+1)+"."+nearlyMonth.getDate();

        this.setData({
            thisMonthStamp: thisMonthStamp,
            nearlyMonthStamp: nearlyMonthStamp,
            lastMonthStamp: lastMonthStamp,
            lastMonthEndStamp: lastMonthEndStamp,
            nowStamp: nowStamp,
            nowDate: nowDate,
            timeEnd: timeEnd,
            timeStart: timeStart,
            timeStartStamp: nearlyMonthStamp,
            timeEndStamp: nowStamp
        });

        //设置picker

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
    selectTime: function(e) {
        var id = e.currentTarget.id;
        var timeMenu = [];
        timeMenu[id] = "active";

        var timeStartStamp = "";
        var timeEndStamp = "";
        var timeStart = "";
        var timeEnd = "";

        var date = null;

        var nowStamp = new Date().getTime();

        if (id == "0") {
            timeStartStamp = this.data.nearlyMonthStamp;
            timeEndStamp = nowStamp;
        }else if(id == "1") {
            timeStartStamp = this.data.thisMonthStamp;
            timeEndStamp = nowStamp;
        }else {
            timeStartStamp = this.data.lastMonthStamp;
            timeEndStamp = this.data.lastMonthEndStamp;
        }

        //起始时间
        date = new Date(timeStartStamp);
        timeStart = date.getFullYear() + "." + (parseInt(date.getMonth()) + 1) + "." + date.getDate();

        //终止时间
        date = new Date(timeEndStamp);
        timeEnd = date.getFullYear() + "." + (parseInt(date.getMonth()) + 1) + "." + date.getDate();

        this.setData({
            timeMenu: timeMenu,
            timeStartStamp: timeStartStamp,
            timeEndStamp: timeEndStamp,
            timeStart: timeStart,
            timeEnd: timeEnd,
        });
    },
    setTimeStart: function(e) {
        var time = e.detail.value;
        if(!this.data.isAndroid) {
            time = time.replace("-", "/");
            time = time.replace("-", "/");
        }
        time += " 00:00:00";
        
        var date = new Date(time);
        var timeStamp = date.getTime();
        var timeStart = date.getFullYear() + "." + (parseInt(date.getMonth()) + 1) + "." + date.getDate();
        this.setData({
            timeStartStamp: timeStamp,
            timeStart: timeStart
        });
    },
    setTimeEnd: function(e) {
        var time = e.detail.value;

        if (!this.data.isAndroid) {
            time = time.replace("-", "/");
            time = time.replace("-", "/");
        }

        time += " 23:59:59";
        var date = new Date(time);
        var timeStamp = date.getTime();
        var timeEnd = date.getFullYear() + "." + (parseInt(date.getMonth()) + 1) + "." + date.getDate();
        this.setData({
            timeEndStamp: timeStamp,
            timeEnd: timeEnd
        });
    },
    getKeyWords: function(e) {
        var keyWords = e.detail.value;
        this.setData({
            keyWords: keyWords
        });
    },
    search: function(e) {
        if (this.data.timeStartStamp > this.data.timeEndStamp) {
            wx.showToast({
                title: '结束时间必须大于起始时间',
                icon: 'none'
            });
            return;
        }

        wx.showLoading({
            title: '正在查询',
            mask: true
        });

        wx.request({
            url: app.globalData.host + '/ardOrd/getOrderLsitBystatwx',
            method: 'POST',
            header: { "contentType": "application/json;charset=utf-8" },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: {
                loginToken: app.globalData.loginToken,
                fid: "2",
                clientType: "3",
                creator: app.globalData.parameter.id,
                mobile: app.globalData.parameter.mobile,
                strDate: this.data.timeStartStamp,
                endDate: this.data.timeEndStamp,
                search: this.data.keyWords
            },
            success: e => {
                wx.hideLoading();
                if (e.data.code == 200) {
                    var isHaveDate = 0;
                    if (e.data.parameter.length > 0) {
                        isHaveDate = 1;
                    }
                    this.setData({
                        orderData: e.data.parameter
                    });
                    wx.navigateTo({
                        url: '../orderFindResult/orderFindResult?isHaveDate=' + isHaveDate
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
                    wx.showToast({
                        title: '系统正在更新，暂停服务！',
                        icon: 'none'
                    });
                }
            },
            fail: e => {
                wx.hideLoading();
                wx.showToast({
                    title: '连接服务器出错，请检查网络！',
                    icon: 'none'
                });
            }
        });
    }
})