// pages/confirmOrder/chooseCar/chooseCar.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        allCar: [],
        host: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            allCar: app.globalData.carType,
            host: app.globalData.host
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
    chooseCar: function(e) {
        var selectCarId = e.currentTarget.id;
        var allCar = app.globalData.carType;
        var pages = getCurrentPages();
        var page = pages[pages.length - 2];
        var isShowPlate = false;
        var nowSize = [];

        var priceArray = page.data.priceArray;
        var priceArrayX = page.data.priceArrayX;

        var isAddWidth = page.data.isAddWidth;
        var isAddPlate = page.data.isAddPlate;


        priceArray["startPrice"] = allCar[selectCarId].startFare;
        priceArrayX["startPrice"] = (allCar[selectCarId].startFare * page.data.carNumber).toFixed(2);
        

        //判断是否已加宽
        if (!isAddWidth || allCar[selectCarId].isAddWidth == 0) {
            //未加宽 或 车没有加宽选项
            nowSize[1] = allCar[selectCarId].width;
        }else {
            //已加宽
            nowSize[1] = 23;

        }
        nowSize[0] = allCar[selectCarId].length;
        nowSize[2] = allCar[selectCarId].height;

        //判断是否加尾板
        if (allCar[selectCarId].coamingCar == 1) {
            isShowPlate = true;
        }else {
            //默认isShowPlate=false
            priceArray["addPlate"] = 0;
            priceArrayX["addPlate"] = 0;
            isAddPlate = false;
        }
        //判断是否加宽
        if(allCar[selectCarId].isAddWidth == 0) {
            priceArray["addWidth"] = 0;
            priceArrayX["addWidth"] = 0;
            isAddWidth = false;
        }

        
        var totalPrice = 0;
        var totalPriceX = 0;

        for (let item in priceArray) {
            totalPrice += parseFloat(priceArray[item]);
            totalPriceX += parseFloat(priceArrayX[item])
        }
        totalPriceX.toFixed(2);

        page.setData({
            selectCarId: selectCarId,
            car: allCar[selectCarId].truckName,
            isShowPlate: isShowPlate,
            nowSize: nowSize,
            priceArray: priceArray,
            totalPrice: totalPrice,
            priceArrayX: priceArrayX,
            totalPriceX: totalPriceX,
            isAddWidth: isAddWidth,
            isAddPlate: isAddPlate
        });

        
        wx.navigateBack({
            delta: 1
        });
    },
    //网络图片请求错误是执行代码
    onErrorSetImage: function (e) {
        var id = e.currentTarget.id;
        var allCar = this.data.allCar;
        allCar[id].carImg = "../../../images/42xiangche.png"
        this.setData({
            allCar: allCar
        });
    }
})