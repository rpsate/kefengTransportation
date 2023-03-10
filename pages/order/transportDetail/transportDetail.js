// pages/order/transportDetail/transportDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        driverInfo: [],
        driverUrl: "",
        orderString: "",
        orderStringTip: "",
        tipStatus: "",
        //评价信息
        gradeBar: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.driverId) {
            var pages = getCurrentPages();
            var page = pages[pages.length - 2];
            var driverInfo = page.data.driverData[options.driverId];
            var driverUrl = page.data.driverUrl[options.driverId];

            if(driverInfo.appraiseList.length > 0) {
                //已评价
                var grade = driverInfo.appraiseList[0].grade;
                var gradeBar = [];
                for (var n = 0; n < grade; n++) {
                    gradeBar.push("star_lg_yellow");
                }
                for (var n = grade; n < 5; n++) {
                    gradeBar.push("star_lg_grey");
                }
                this.setData({
                    gradeBar: gradeBar,
                });
            }

            //设置操作时间显示格式
            driverInfo = this.setOperat(driverInfo);
            
            //获取状态
            var tipStatus = page.data.tipStatus;
            //设置评价信息
            this.setData({
                tipStatus: tipStatus,
                driverInfo: driverInfo,
                orderString: page.data.orderString,
                orderStringTip: page.data.orderStringTip,
                driverUrl: driverUrl
            });
        }else {
            wx.showModal({
                title: '提示',
                content: '无司机信息！',
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
    //联系Ta
    contact: function(e) {
        wx.makePhoneCall({
            phoneNumber: this.data.driverInfo.driverMobile
        })
    },
    //设置操作信息
    setOperat: function (driverInfo) {
        var operatList = driverInfo.operatList;
        //循环司机操作
        for (var i = 0; i < operatList.length; i++) {
            var date = new Date(operatList[i].createDat);
            operatList[i].monthDay = (parseInt(date.getMonth()) + 1) + "-" + date.getDate();
            operatList[i].hourMinuate = date.getHours() + ":" + date.getMinutes();
        }
        driverInfo.operatList = operatList;
        return driverInfo;
    },
    onErrorSetImage: function(e) {
        this.setData({
            driverUrl: '../../../images/user_img_default.png'
        });
    }
});