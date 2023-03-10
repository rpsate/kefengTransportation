// pages/order/evaluate/evaluate.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rating: ["star_lg_yellow", "star_lg_yellow", "star_lg_yellow", "star_lg_yellow","star_lg_yellow"],
        ratingText: "非常满意，堪称完美",
        grade: 5,
        remark: "",
        orderId: "",
        driverId: "",
        apprid: "",
        pageFrom: "",
        //司机信息
        driverInfo: null,
        driverUrl: "../../../images/user_img_default.png"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.orderId && options.driverId && options.apprid) {
            this.setData({
                orderId: options.orderId,
                driverId: options.driverId,
                apprid:  options.apprid
            });
        }
        if(options.pageFrom) {
            this.setData({
                pageFrom: options.pageFrom
            });
            if (options.pageFrom == "orderDetail") {
                var pages = getCurrentPages();
                var page = pages[pages.length - 2];
                this.setData({
                    driverInfo: page.data.driverData[page.data.selectDriverId],
                    driverUrl: page.data.driverUrl[page.data.selectDriverId]
                });
            }
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
    setRating: function(e) {
        var length = parseInt(e.currentTarget.id) + 1;
        var rating = [];
        for(var n=0;n<length;n++) {
            rating.push("star_lg_yellow");
        }
        for(var n=length;n<5;n++) {
            rating.push("star_lg_grey");
        }
        
        var ratingText = "";
        switch(length) {
            case 1:
                ratingText = "特别不满意，特别失望";
                break;
            case 2: 
                ratingText = "不满意，有点失望";
                break;
            case 3: 
                ratingText = "一般，补补通通";
                break;
            case 4:
                ratingText = "比较满意，仍可改进";
                break;
            default: 
                ratingText = "非常满意，堪称完美";
                break;
        }
        this.setData({
            rating: rating,
            grade: length,
            ratingText: ratingText
        })
    },
    getText: function(e) {
        this.setData({
            remark: e.detail.value
        });
    },
    evaluate: function(e) {
        wx.request({
            url: app.globalData.host + '/ardOrd/setOrderAppraisewx',
            header: { "contentType": "application/json;charset=utf-8" },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: {
                loginToken: app.globalData.loginToken,
                userId: app.globalData.parameter.id,
                fid: "2",
                clientType: "3",
                orderId: this.data.orderId,
                driverId: this.data.driverId,
                apprid: this.data.apprid,
                grade: this.data.grade,
                remark: this.data.remark                
            },
            success: e => {
                if(e.data.code == 200) {
                    if (this.data.pageFrom =="orderDetail") {
                        var pages = getCurrentPages();
                        var page = pages[pages.length - 2];

                        var selectDriverId = page.data.selectDriverId;
                        var driverData = page.data.driverData;

                        driverData[selectDriverId].appraiseList = [{grade:"",remark:""}];
                        driverData[selectDriverId].appraiseList[0].grade = this.data.grade;
                        driverData[selectDriverId].appraiseList[0].remark = this.data.remark;
                        page.setData({
                            pageFrom: "evaluate",
                            driverData: driverData,
                            tipStatus: 4
                        });

                        wx.navigateBack({
                            delta: 1,
                        });
                    }
                }else if(e.data.code == -104){
                    wx.showModal({
                        title: '提示',
                        content: e.data.message,
                        showCancel: false,
                        confirmColor: '#0783e8',
                        success: function(e) {
                            if(e.confirm) {
                                wx.navigateBack({
                                    delta: 1,
                                });
                            }
                        }
                    });
                }else if (e.data.code == 888) {
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
                }
            }
        })
    },
    onErrorDriverImage: function(e) {
        this.setData({
            driverUrl:"../../../images/user_img_default.png"
        });
    }
})