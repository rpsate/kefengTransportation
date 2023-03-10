// pages/pay/screeningResult/screeningResult.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sortIcon: ["ic_paixu1"],

        collectMoney: 0,
        payMoney: 0,
        totalPrice: 0,
        payData: [],
        timeStart: "",
        timeEnd: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var pages = getCurrentPages();
        var page = pages[pages.length - 2];

        //订单号显示渲染
        var payData = page.data.payData;
        payData = this.setOrderNo(payData);

        this.sortDate(payData);

        //标题栏时间显示数据获取
        var timeStart = page.data.timeStart;
        var timeEnd = page.data.timeEnd;

        this.setData({
            collectMoney: page.data.collectMoney,
            payMoney: page.data.payMoney,
            totalPrice: page.data.totalPrice,
            timeStart: timeStart,
            timeEnd: timeEnd
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

    },
    resetScreening: function (e) {
        wx.navigateBack({
            delta: 1,
        })
    },
    //查看详情
    payDetail: function (e) {
        wx.navigateTo({
            url: '../payDetail/payDetail?id=' + e.currentTarget.id
        })

    },
    selectSort: function (e) {
        var id = e.currentTarget.id;
        var sortIcon = [];
        sortIcon[id] = "ic_paixu1";
        if(id == 0) {
            this.sortDate(this.data.payData);
        }else if(id == 1) {
            this.sortCellectMoney(this.data.payData);
        }else {
            this.sortPayMoney(this.data.payData);
        }
        this.setData({
            sortIcon: sortIcon
        });
    },
    //排序
    //按时间排序
    sortDate: function (payData) {
        var length = payData.length;
        if (length > 1) {
            var index, temp;
            for (var i = 0; i < length - 1; i++) {
                index = i;
                for (var j = i + 1; j < length; j++) {
                    if (payData[index].finDate < payData[j].finDate) {
                        index = j;
                    }
                }
                temp = payData[i];
                payData[i] = payData[index];
                payData[index] = temp;
            }
        }
        this.setData({
            payData: payData
        });
    },
    //按待收款排序
    sortCellectMoney: function (payData) {
        var length = payData.length;
        if (length > 1) {
            var index, temp;
            for (var i = 0; i < length - 1; i++) {
                index = i;
                for (var j = i + 1; j < length; j++) {
                    if (payData[index].dshk < payData[j].dshk) {
                        index = j;
                    }
                }
                temp = payData[i];
                payData[i] = payData[index];
                payData[index] = temp;
            }
        }
        this.setData({
            payData: payData
        });
    },
    //按待支出排序
    sortPayMoney: function (payData) {
        var length = payData.length;
        if (length > 1) {
            var index, temp;
            for (var i = 0; i < length - 1; i++) {
                index = i;
                for (var j = i + 1; j < length; j++) {
                    if (payData[index].yfhj < payData[j].yfhj) {
                        index = j;
                    }
                }
                temp = payData[i];
                payData[i] = payData[index];
                payData[index] = temp;
            }
        }
        this.setData({
            payData: payData
        });
    },
    //订单号显示渲染
    setOrderNo: function (payData) {
        for (var i = 0; i < payData.length; i++) {
            payData[i].orderNoLeft = payData[i].orderNo.substr(0, 8);
            payData[i].orderNoRight = payData[i].orderNo.substr(8);
        }
        return payData;
    },
})