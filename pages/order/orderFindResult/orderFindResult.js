// pages/order/orderFindResult/orderFindResult.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderData: [],
        isHaveData: false,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //判读是否有数据
        if (options.isHaveDate) {
            var isHaveData = false;
            if(options.isHaveDate == 1) {
                isHaveData = true;
            }

            //获取订单信息
            var pages = getCurrentPages();
            var page = pages[pages.length - 2];
            var orderData = page.data.orderData;
            //加入数据
            for (var i = 0; i < orderData.length; i++) {
                //时间              
                orderData[i].createDateName = this.getDateName(orderData[i].createDat);
                //状态
                //三参数（订单状态码，订单取消标记,订单是否评价标记）
                orderData[i].ordStatusName = this.getorderStatusNmae(orderData[i].ordStatus, orderData[i].deleted, orderData[i].appraise);
            }
            this.setData({
                isHaveData: isHaveData,
                orderData: orderData,
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
    resetFind: function(e) {
        wx.navigateBack({
            delta: 1,
        });
    },
    goLogistics: function (e) {
        var orderId = e.currentTarget.id;
        wx.navigateTo({
            url: '../orderDetail/orderDetail?orderId=' + orderId + '&type=0'
        });
    },
    goDetail: function (e) {
        var orderId = e.currentTarget.id;
        wx.navigateTo({
            url: '../orderDetail/orderDetail?orderId=' + orderId + '&type=1'
        });
    },
    //公共函数部分
    //时间显示格式标准化函数
    //更具时间戳获取显示时间
    getDateName: function (e) {
        var date = new Date(e);
        var dateString = "";
        var month = parseInt(date.getMonth()) + 1;
        var days = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        dateString = month + "月" + days + "日 " + hours + ":" + minutes;
        return dateString;
    },
    //根据状态码获取状态提示(状态码，是否取消，评价是否)
    getorderStatusNmae: function (status, delStatus, appraise) {
        var orderString = "";
        if (delStatus == 1) {
            orderString = "已取消"
        } else {
            if (appraise == 0 && status == 200) {
                orderString = "未评价"
            } else if (appraise == 1 && status == 200) {
                orderString = "已评价"
            } else {
                switch (status) {
                    case 100:
                        orderString = "等待配送";
                        break;
                    case 110:
                        orderString = "等待配送";
                        break;
                    case 111:
                        orderString = "等待配送";
                        break;
                    case 112:
                        orderString = "等待配送";
                        break;
                    case 130:
                        orderString = "等待配送";
                        break;
                    case 131:
                        orderString = "等待配送";
                        break;
                    case 132:
                        orderString = "等待配送";
                        break;
                    case 150:
                        orderString = "配送中";
                        break;
                    case 200:
                        orderString = "订单已完成";
                        break;
                    default:
                        orderString = "未获取订单信息";
                }
            }

        }
        return orderString;
    },
})