// pages/pay/payDetail/payDetail.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        payData: null,
        timeStr: "",
        orderNo: "",
        driverData: [],
        collectMoney: "",
        payMoney: "",
        totalPrice: "",
        addressData: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.id) {
            var pages = getCurrentPages();
            var page = pages[pages.length - 2];

            var payItem = page.data.payData[options.id];

            //设置显示时间
            this.setTime(payItem.finDate);
            
            var collectMoney = parseInt(payItem.dshk);
            var payMoney = parseInt(payItem.yfhj);
            var totalPrice = collectMoney - payMoney;

            this.setData({
                orderNo: payItem.orderNo,
                collectMoney: collectMoney,
                payMoney: payMoney,
                totalPrice: totalPrice
            });


            var orderId = page.data.payData[options.id].orderId;
            wx.showLoading({
                title: '正在加载',
                mask: true
            });

            wx.request({
                url: app.globalData.host + '/cordController/getFinMassagewx',
                method: 'POST',
                header: { "contentType": "application/json;charset=utf-8" },
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                data: {
                    loginToken: app.globalData.loginToken,
                    fid: "2",
                    clientType: "3",
                    orderId: orderId,
                },
                success: e => {
                    wx.hideLoading();
                    if (e.data.code == 200) {
                        this.setPriceData(e.data.parameter.finlist);
                        this.setData({
                            payData: e.data.parameter,
                            addressData: e.data.parameter.addressList
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
                                        url: '../login/login'
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

            //请求信息
        }else {
            wx.showModal({
                title: '提示',
                content: '无订单数据',
                showCancel: false,
                confirmColor: '#0783e8',
                success: function(e) {
                    wx.navigateBack({
                        delta: 1,
                    });
                }
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
    setTime(time) {
        var date = new Date(time);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if (parseInt(hours)<10) {
            hours = "0" + hours;
        }
        if (parseInt(minutes)<10) {
            minutes = "0" + minutes;
        }
        var str = date.getFullYear() + "-" + (parseInt(date.getMonth())+ 1) + "-" + date.getDate() + " " + hours + ":" + minutes;
        this.setData({
            timeStr: str
        });
    },
    setPriceData: function(driverData) {
        var drivers = driverData;
        for(var i=0;i<driverData.length;i++) {
            var selectMoneyStr = [];
            var payMoneyStr = [];
            if (driverData[i].jbyf != null && driverData[i].jbyf != undefined && driverData[i].jbyf > 0) {
                payMoneyStr.push("里程费 ￥" + driverData[i].jbyf);
            }
            if (driverData[i].ysf != null && driverData[i].ysf != undefined && driverData[i].ysf > 0) {
                payMoneyStr.push("延时费 ￥" + driverData[i].ysf);
            }
            if (driverData[i].zxf != null && driverData[i].zxf != undefined && driverData[i].zxf >0) {
                payMoneyStr.push("装卸费 ￥" + driverData[i].zxf);
            }
            if (driverData[i].dff != null && driverData[i].dff != undefined && driverData[i].dff >0) {
                payMoneyStr.push("垫付费 ￥" + driverData[i].dff);
            }
            if (driverData[i].sj != null && driverData[i].sj != undefined && driverData[i].sj >0) {
                payMoneyStr.push("税 金 ￥" + driverData[i].sj);
            }
            if (driverData[i].dshk != null && driverData[i].dshk != undefined && driverData[i].dshk>0) {
                selectMoneyStr.push("待 收 ￥"+driverData[i].dshk);
            }
            drivers[i].selectMoneyStr = selectMoneyStr,
            drivers[i].payMoneyStr = payMoneyStr
        }
        this.setData({
            driverData: drivers
        });
    }
})