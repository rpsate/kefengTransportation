// pages/confirmOrder/comfirmOrder/comfirmOrder.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //服务器地址
        //时间
        time: [],
        timeStr: "",
        picker: [],
        selectPicker: [],
        nowTime: [],
        maxDay: "",
        selectDayId: 0,
        //车型
        carType: [],
        car: "请选择车型",
        selectCarId: -1,
        isShowPlate: false,
        nowSize: [],
        //车辆数量
        carNumber: 1,
        tempCarNumber: 1,
        isShowCarNumberModel: false,
        //尾板加宽
        isAddPlate: false,
        isAddWidth: false,
        //地址
        positionStart: {
            isGetPostion: false,
            name: "",
            address: "",
            district: "",
            houseNumber: "",
            person: "",
            phoneNumber: "",
            location: {
                latitude: "",
                longitude: ""
            }
        },
        positionEnd: {
            isGetPostion: false,
            name: "",
            address: "",
            district: "",
            houseNumber: "",
            person: "",
            phoneNumber: "",
            location: {
                latiude: "",
                longitude: ""
            }
        },
        positionPassby: [],
        //备注
        note: "",
        personNote: "",
        tempPersonNote: "",
        isShowPersonNoteModel: false,
        //货物名称
        goodsName: "",
        tempGoodsName: "",
        isShowNameModel: false,
        //尺寸
        goodsSize: [],
        tempGoodsSize: [],
        isShowSizeModel: false,
        isOverflow: false,
        //货物包装
        packages: ["纸箱","木箱","木架","纤袋"],
        selectPackage: "纸箱",
        selectPackageId: 1,
        //货物重量和货物件数
        packagesWeight: "",
        packagesNumber: "",
        tempPackagesWeight: "",
        tempPackagesNumber: "",
        isPackagesWeight: false,
        isPackagesNumber: false,
        //选择付款方式
        isShowSheet: false,
        radio: [false,false,false],
        btnDisabled: "btn-disabled",
        payMethod: null,
        //价格
        priceData: null,//获取的基本价格数据集合
        priceArray: [],
        totalPrice: 0,
        priceArrayX: [],//乘以数量后的价格
        totalPriceX: 0,
        //是否已经按了按钮，防止双击重复下单
        isSubmint: false,
        checkedWidth: false//是否选择
    },
    //加工一下地址数据，使之成为获取价格所需格式
    getAddressInfo: function(positionStart, positionPassby, positionEnd) {
        //加入出发地址
        var location = [];
        var locationItem = {
            lat: positionStart.location.latitude,
            lgt: positionStart.location.longitude,
            abstractAddress: positionStart.name,
            detailAddress: positionStart.address,
            doorplateAddress: positionStart.houseNumber,
            userInfo: {
                uname: positionStart.person,
                mobile: positionStart.phoneNumber
            }
        }
    location.push(locationItem);

        //加入途径地址
        var positionPassbyLength = positionPassby.length;
        if(positionPassbyLength > 0) {
        for (var i = 0; i < positionPassbyLength; i++) {
            locationItem = {
                lat: positionPassby[i].location.latitude,
                lgt: positionPassby[i].location.longitude,
                abstractAddress: positionPassby[i].name,
                detailAddress: positionPassby[i].address,
                doorplateAddress: positionPassby[i].houseNumber,
                userInfo: {
                    uname: positionPassby[i].person,
                    mobile: positionPassby[i].phoneNumber
                }
            }
            location.push(locationItem);
            }
        }

        //加入终点地址
        locationItem = {
            lat: positionEnd.location.latitude,
            lgt: positionEnd.location.longitude,
            abstractAddress: positionEnd.name,
            detailAddress: positionEnd.address,
            doorplateAddress: positionEnd.houseNumber,
            userInfo: {
                uname: positionEnd.person,
                mobile: positionEnd.phoneNumber
            }
        }

        location.push(locationItem);

        return location;
    },
    //计算费用地址
    getLocations: function (positionStart, positionPassby, positionEnd) {
        //加入出发地址
        var location = [];
        var locationItem = {
            lat: positionStart.location.latitude,
            lgt: positionStart.location.longitude
        }
        location.push(locationItem);

        //加入途径地址
        var positionPassbyLength = positionPassby.length;
        if (positionPassbyLength > 0) {
            for (var i = 0; i < positionPassbyLength; i++) {
                locationItem = {
                    lat: positionPassby[i].location.latitude,
                    lgt: positionPassby[i].location.longitude
                }
                location.push(locationItem);
            }
        }

        //加入终点地址
        locationItem = {
            lat: positionEnd.location.latitude,
            lgt: positionEnd.location.longitude
        }
        location.push(locationItem);

        return location;
    },
    //处理时间格式
    getTimeStamp: function(goTime) {
        var time = "";
        wx.getSystemInfo({
            success: e => {
                if (e.platform == "ios") {
                    //苹果系统
                    time = goTime[0] + "/" + goTime[1] + "/" + goTime[2] + " " + goTime[3] + ":" + goTime[4] + ":" + "00";
                }else {
                    //安卓系统
                    time = goTime[0] + "-" + goTime[1] + "-" + goTime[2] + " " + goTime[3] + ":" + goTime[4] + ":" + "00";
                }
            }
        });
        
        var date = new Date(time);
        return date.getTime();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //时间数据
        var pages = getCurrentPages();
        var page = pages[pages.length - 2];

        var time = [];
        var nowTime = [];

        if(options.selectDayId) {
            var selectDayId = options.selectDayId;
        }else {
            var selctDayId = this.data.selectDay;
        }

        //接收时间数据
        if(options.time) {
            if(options.time == "now") {
                time = page.data.nowTime;
                this.setData({
                    timeStr: "现在",
                    time: time
                });
            }else {
                time = page.data.goTime;
                nowTime = page.data.nowTime;
                var timeStr = "";

                var hourStr = parseInt(time[3])<10?"0"+time[3]:time[3];
                var minuateStr = parseInt(time[4])<10?"0"+time[4]:time[4];
                //设置时间显示文字
                if(JSON.stringify(time) == JSON.stringify(nowTime)) {
                    timeStr = "现在";
                } else if (selectDayId == 0) {
                    timeStr = "今天" + hourStr + ":" + minuateStr + "(预约)";
                } else if (selectDayId == 1) {
                    timeStr = "明天" + hourStr + ":" + minuateStr + "(预约)";
                } else if (selectDayId == 2) {
                    timeStr = "后天" + hourStr + ":" + minuateStr + "(预约)"
                }else {
                    timeStr = "时间错误";
                }

                //设置数据
                this.setData({
                    timeStr: timeStr,
                    time: time,
                    selectDayId: selectDayId
                })
            }
        }else {
            this.setData({
                timeStr: "请选择时间"
            });
        }

        //获取路线信息
        if(page.data.addressDataItem) {
            //来自常用路线

            var addressDataItem = page.data.addressDataItem.myTrendsList;
            var length = addressDataItem.length;

            for (var i = 0; i < length; i++) {
                addressDataItem[i].location = {
                    latitude: addressDataItem[i].latitude,
                    longitude: addressDataItem[i].longitude
                }
            }

            var positionPassby = [];
            for (var i = 1; i < length - 1; i++) {
                positionPassby.push(addressDataItem[i]);
            }

            var positionStart = addressDataItem[0];
            var positionEnd = addressDataItem[length-1];
        }else {
            //来自首页
            var positionStart = page.data.positionStart;
            var positionEnd = page.data.positionEnd;
            var positionPassby = page.data.addressArray;
        }

        //设置路线数据
        this.setData({
            positionStart: positionStart,
            positionEnd: positionEnd,
            positionPassby: positionPassby
        });
        
        //车型数据
        if(page.data.selectCarId >=0 ) {
            var allCar = app.globalData.carType;
            var selectCarId = page.data.selectCarId;
            var isShowPlate = false;
            var nowSize = [];
            var priceArray = [];
            var priceArrayX = [];
            priceArray["startPrice"] = allCar[selectCarId].startFare;
            priceArrayX["startPrice"] = (allCar[selectCarId].startFare * this.data.carNumber).toFixed(2);
            
            //设置车型数据
            nowSize[0] = allCar[selectCarId].length;
            nowSize[1] = allCar[selectCarId].width;
            nowSize[2] = allCar[selectCarId].height;
            
            //判断是否有尾板
            if (allCar[selectCarId].coamingCar ==1) {
                isShowPlate = true;
            }else {
                //isShowPlate默认为false
                priceArray["addPlate"] = 0;
                priceArrayX["addPlate"] = 0;
            }

            //设置总价
            var totalPrice = 0;
            var totalPriceX = 0;
            for (let item in priceArray) {
                totalPrice += parseFloat(priceArray[item]);
                totalPriceX += parseFloat(priceArrayX[item]);
            }
            totalPriceX = totalPriceX.toFixed(0);

            //设置数据
            this.setData({
                selectCarId: selectCarId,
                car: allCar[selectCarId].truckName,
                carType: allCar,
                isShowPlate: isShowPlate,
                nowSize: nowSize,
                priceArray: priceArray,
                totalPrice: totalPrice,
                priceArrayX: priceArrayX,
                totalPriceX: totalPriceX,
            });

        }else {
            this.setData({
                selectCarId: -1,
                carType: app.globalData.carType
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        //时间选择框数据初始化

        //求现在时间
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var today = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();

        month += 1;
        var nowTime = [year, month, today, hours, minutes];

        //求每月最大天数
        var maxDay;
        if (month == 2) {
            maxDay = "28";
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
            maxDay = "30";
        } else {
            maxDay = "31"
        }

        //求选择器显示时间
        var pickerDay = ["今天", "明天", "后天"];
        var pickerHours = [];
        var pickerMinutes = [];

        for (var i = 0; i <= 23; i++) {
            pickerHours.push(i);
        }
        pickerMinutes.push("00");
        for (var i = 1; i <= 59; i++) {
            if(i.toString().length == 1) {
                pickerMinutes.push("0"+i);
            }else {
                pickerMinutes.push(i);
            }
        }

        var picker = [pickerDay, pickerHours, pickerMinutes];

        //选择器选中时间
        var time = this.data.time;
        if(time.length == 0) {
            time = nowTime;
        }
        
        var selectDay = this.data.selectDayId;
        var selectHours = time[3];
        var selectMinutes = time[4];

        //选择器往后推时间计算公式
        selectMinutes += 30;
        if (selectMinutes > 59) {
            selectMinutes = selectMinutes - 60;
            selectHours += 1;
            if (selectHours > 23) {
                selectHours = selectHours - 24;
                selectDay += 1;
            }
        }

        var selectPicker = [selectDay, selectHours, selectMinutes]

        //设置数据
        this.setData({
            picker: picker,
            selectPicker: selectPicker,
            nowTime: nowTime,
            maxDay: maxDay
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var selectCarId = this.data.selectCarId;
        if(selectCarId != -1) {
            var carTypeId = app.globalData.carType[selectCarId].carTypeId;
            //获取价格
            var location = this.getLocations(this.data.positionStart, this.data.positionPassby, this.data.positionEnd);

            wx.request({
                url: app.globalData.host + '/ArdBaseCar/getCarTypeCostwx',
                header: { "contentType": "application/json;charset=utf-8" },
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                data: {
                    loginToken: app.globalData.loginToken,
                    carTypePk: carTypeId,
                    fid: "2",
                    clientType: "3",
                    addressInfos: location
                },
                success: e => {
                    if (e.data.code == 200) {
                        //获取价格
                        var priceArray = this.data.priceArray;
                        var priceArrayX = this.data.priceArrayX;
                        priceArray["startPrice"] = e.data.parameter.totalPrice;
                        priceArrayX["startPrice"] = (e.data.parameter.totalPrice * this.data.carNumber).toFixed(2);
                        var totalPrice = 0;
                        var totalPriceX = 0;
                        for (let item in priceArray) {
                            totalPrice += parseFloat(priceArray[item]);
                            totalPriceX += parseFloat(priceArrayX[item]);
                        }

                        totalPriceX = totalPriceX.toFixed(2);

                        this.setData({
                            priceData: e.data.parameter,
                            priceArray: priceArray,
                            totalPrice: totalPrice,
                            priceArrayX: priceArrayX,
                            totalPriceX: totalPriceX
                        });
                    } else if (e.data.code == 888) {
                        wx.showModal({
                            title: '提示',
                            content: '登录已过期，请重新登录！',
                            showCancel: true,
                            cancelText: '取消',
                            confirmText: '确认',
                            confirmColor: "#0783e8",
                            success: function (e) {
                                if (e.confirm) {
                                    wx.navigateTo({
                                        url: '../../login/login'
                                    });
                                }
                            }
                        });
                    }else {
                        wx.showToast({
                            title: '系统正在更新，暂停服务！',
                            icon: 'none'
                        })
                    }
                },
                fail: function (e) {
                    wx.showToast({
                        title: '连接服务器出错，请检查网络！',
                        icon: 'none'
                    });
                }
            });
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
    changePicker: function (e) {
        //求现在时间
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var today = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();

        month += 1;
        var nowTime = [year, month, today, hours, minutes];

        //求每月最大天数
        var maxDay;
        if (month == 2) {
            maxDay = "28";
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
            maxDay = "30";
        } else {
            maxDay = "31"
        }

        //获取选择时间
        var selectYear = nowTime[0]
        var selectMonth = nowTime[1]
        var selectDay = nowTime[2];

        var addDays = e.detail.value[0];
        var selectHours = e.detail.value[1];
        var selectMinutes = e.detail.value[2];

        for (var i = 0; i < addDays; i++) {
            if (selectDay == maxDay) {
                selectDay = 1;
                if (selectMonth == 12) {
                    selectMonth = 1;
                    selectYear++;
                } else {
                    selectMonth++;
                }
            } else {
                selectDay++;
            }
        }
        var goTime = [selectYear, selectMonth, selectDay, selectHours, selectMinutes];

        //判断时间是否错误
        var isTimeCorrect = true;
        if (addDays == 0) {
            if (goTime[3] < nowTime[3]) {
                isTimeCorrect = false;
            } else if (goTime[3] == nowTime[3]) {
                if (goTime[4] < nowTime[4]) {
                    isTimeCorrect = false;
                }
            }
        }

        var selectDayID = addDays;

        //设置显示字符
        if(!isTimeCorrect) {
            wx.showToast({
                title: '时间选择错误，请重新选择',
                icon: 'none'
            });
        }else {
            var timeStr = "";
            if (JSON.stringify(goTime) == JSON.stringify(nowTime)) {
                this.setData({
                    timeStr: "现在"
                })
            } else {
                var hourStr = parseInt(goTime[3])<10?"0"+goTime[3]:goTime[3];
                var minuateStr = parseInt(goTime[4])<10?"0"+goTime[4]:goTime[4];
                if (addDays == 0) {
                    timeStr = "今天" + hourStr + ":" + minuateStr + "(预约)";
                } else if (addDays == 1) {
                    timeStr = "明天" + hourStr + ":" + minuateStr + "(预约)";
                } else if(addDays == 2){
                    timeStr = "后天" + hourStr + ":" + minuateStr + "(预约)";
                }else {
                    timeStr = "时间错误";
                }
                this.setData({
                    timeStr: timeStr
                })
            }
            
            this.setData({
                time: goTime,
                nowTime: nowTime,
                selectDayId: addDays
            });
        }  
    },
    selectCar: function(e) {
        wx.navigateTo({
            url: '../chooseCar/chooseCar?note='+this.data.note
        });
    },
    //用车数量
    writeCarNumber: function(e) {
        this.setData({
            isShowCarNumberModel: true
        });
    },
    inputCarNumber: function(e) {
        this.setData({
            tempCarNumber: e.detail.value
        });
    },
    writeCarNumberCancel: function(e) {
        this.setData({
            isShowCarNumberModel: false
        });
    },
    writeCarNumberConfirm: function(e) {
        //确认车的数量
        var carNumber = parseInt(this.data.tempCarNumber);
        if (carNumber < 1 || this.data.tempCarNumber == "") {
            wx.showToast({
                title: '请输入正确的用车数!',
                icon: 'none'
            });
        }else {
            var priceArray = this.data.priceArray;
            var priceArrayX = [];
            var totalPriceX = 0;
            for(let item in priceArray) {
                priceArrayX[item] = (priceArray[item] * carNumber).toFixed(2);
                totalPriceX += parseFloat(priceArrayX[item]);
            }

            totalPriceX = totalPriceX.toFixed(2);

            this.setData({
                carNumber: carNumber,
                isShowCarNumberModel: false,
                priceArrayX: priceArrayX,
                totalPriceX: totalPriceX
            });
        }
    },
    addPlate: function(e) {
        var isAddPlate = e.detail.value;

        //加版尾加20元
        var priceArray = this.data.priceArray;
        var priceArrayX = this.data.priceArrayX;

        if(isAddPlate) {
            priceArray["addPlate"] = app.globalData.addPlatePrice;
            priceArrayX["addPlate"] = (app.globalData.addPlatePrice * this.data.carNumber).toFixed(2);
        }else {
            priceArray["addPlate"] = 0;
            priceArrayX["addPlate"] = 0;
        }

        var totalPrice = 0;
        var totalPriceX = 0;
        for (let item in priceArray) {
            totalPrice += parseFloat(priceArray[item]);
            totalPriceX += parseFloat(priceArrayX[item]);
        }
        totalPriceX = totalPriceX.toFixed(2);

        this.setData({
            isAddPlate: isAddPlate,
            priceArray: priceArray,
            totalPrice: totalPrice,
            priceArrayX: priceArrayX,
            totalPriceX: totalPriceX
        });
    },
    addWidth: function(e) {
        var isAddWidth = e.detail.value;
        var priceArray = this.data.priceArray;
        var priceArrayX = this.data.priceArrayX;
        var nowSize = this.data.nowSize;
        //加尾板加10元
        if(isAddWidth) {
            priceArray["addWidth"] = app.globalData.addWidthPrice;
            priceArrayX["addWidth"] = (app.globalData.addWidthPrice * this.data.carNumber).toFixed(2);
            nowSize[1] = 23;//nowSize[长，宽，高]
        }else {
            priceArray["addWidth"] = 0;
            priceArrayX["addWidth"] = 0;
            nowSize[1] = this.data.carType[this.data.selectCarId].width;//nowSize[长，宽，高]
        }

        var totalPrice = 0;
        var totalPriceX = 0;
        for (let item in priceArray) {
            totalPrice += parseFloat(priceArray[item]);
            totalPriceX += parseFloat(priceArrayX[item]);
        }
        totalPriceX = totalPriceX.toFixed(2);
        
        this.setData({
            isAddWidth: isAddWidth,
            priceArray: priceArray,
            totalPrice: totalPrice,
            priceArrayX: priceArrayX,
            totalPriceX: totalPriceX,
            nowSize: nowSize,
            checkedWidth: !this.data.checkedWidth
        });
    },
    writeNote: function(e) {
        wx.navigateTo({
            url: '../noteInfo/noteInfo?note=' + this.data.note
        });
    },
    //填写名称
    writeName: function(e) {
        this.setData({
            isShowNameModel: true
        });
    },
    writeNameConfirm: function(e) {
        this.setData({
            goodsName: this.data.tempGoodsName,
            isShowNameModel: false
        });
    },
    writeNameCancel: function(e) {
        this.setData({
            isShowNameModel: false
        });
    },
    inputGoodsName: function(e) {
        this.setData({
            tempGoodsName: app.filterEmoji(e.detail.value)
        });
    },
    //填写尺寸
    writeSize: function (e) {
        this.setData({
            isShowSizeModel: true
        });
    },
    writeSizeConfirm: function (e) {
        var size = this.data.tempGoodsSize;
        //判断是否能装下
        var nowSize = this.data.nowSize;
        this.setData({
            isOverflow: false
        });
        for(var i=0;i<3;i++) {
            if (size[i] == null || size[i] == "") {
                size[i] = "0";
            }
        }

        for(var i=0;i<3;i++) {
            if(size[i] > nowSize[i]) {
                this.setData({
                    isOverflow: true
                });
                break;
            }
        }
        

        //设置尺寸
        this.setData({
            goodsSize: size,
            isShowSizeModel: false
        });
    },
    writeSizeCancel: function (e) {
        this.setData({
            isShowSizeModel: false
        });
    },
    inputGoodsLength: function (e) {
        var size = this.data.tempGoodsSize;
        size[0] = e.detail.value
        this.setData({
            tempGoodsSize: size
        })
    },
    inputGoodsWidth: function(e) {
        var size = this.data.tempGoodsSize;
        size[1] = e.detail.value
        this.setData({
            tempGoodsSize: size
        })
    },
    inputGoodsHeigth: function(e) {
        var size = this.data.tempGoodsSize;
        size[2] = e.detail.value
        this.setData({
            tempGoodsSize: size
        })
    },
    //填写备注
    writePersonNote: function (e) {
        this.setData({
            isShowPersonNoteModel: true
        });
    },
    writePersonNoteConfirm: function (e) {
        this.setData({
            personNote: this.data.tempPersonNote,
            isShowPersonNoteModel: false
        });
    },
    writePersonNoteCancel: function (e) {
        this.setData({
            isShowPersonNoteModel: false
        });
    },
    inputPersonNote: function (e) {
        this.setData({
            tempPersonNote: app.filterEmoji(e.detail.value)
        });
    },
    //选择包装
    selectPackage: function(e) {
        var packages = this.data.packages;
        var id = e.detail.value;
        var selectPackage = packages[id];
        var selectPackageId = parseInt(id) + 1;
        this.setData({
            selectPackage: selectPackage,
            selectPackageId: selectPackageId
        });
    },
    //写货物质量
    writePackagesWeight: function(e) {
        this.setData({
            isPackagesWeight: true
        });
    },
    //写货物数量
    writePackagesNumber: function (e) {
        this.setData({
            isPackagesNumber: true
        });
    },
    //确认货物重量模态框
    confirmPackagesWeight: function(e) {
        this.setData({
            packagesWeight: this.data.tempPackagesWeight,
            isPackagesWeight: false
        });
    },
    //确认货物件数模态框
    confirmPackagesNumber: function (e) {
        this.setData({
            packagesNumber: this.data.tempPackagesNumber,
            isPackagesNumber: false
        });
    },
    //隐藏货物重量模态框
    canclePackagesWeight: function(e) {
        this.setData({
            isPackagesWeight: false
        });
    },
    //隐藏货物数量模态框
    canclePackagesNumber: function (e) {
        this.setData({
            isPackagesNumber: false
        });
    },
    //输入货物重量
    inputPackagesWeight: function(e) {
        this.setData({
            tempPackagesWeight: e.detail.value
        });
    },
    //输入货物数量
    inputPackagesNumber: function (e) {
        this.setData({
            tempPackagesNumber: e.detail.value
        });
    },
    //确认订单
    useCar: function(e) {
        var time = this.data.time;
        var selectCarId  = this.data.selectCarId;
        var goodsSize = this.data.goodsSize;
        var carryingCapacity = this.data.carType[this.data.selectCarId].carryingCapacity * 1000;
        var nowSize = this.data.nowSize;
        var packagesWeight = this.data.packagesWeight;
        var packagesNumber = this.data.packagesNumber;

        
        if(time.length == 0) {
            wx.showToast({
                title: '请选择时间!',
                icon: 'none'
            });
            return;
        }else if(selectCarId == -1) {
            wx.showToast({
                title: "请选择车型" + "!",
                icon: 'none'
            });
            return;
        }else if(goodsSize.length == 0) {
            wx.showToast({
                title: '请填写货物尺寸!',
                icon: 'none'
            });
            return;
        }else{
            for(var i=0;i<3;i++) {
                if(goodsSize[i] <=0 || goodsSize[i] > nowSize[i]) {
                    wx.showToast({
                        title: '请填写正确的尺寸!',
                        icon: 'none'
                    });
                    return;
                }
            }
            
            //进一步判断
            if (packagesWeight == "") {
                wx.showToast({
                    title: '请输入货物重量!',
                    icon: 'none'
                });
                return;
            } if (packagesWeight > carryingCapacity) {
                wx.showToast({
                    title: '该货物超重!',
                    icon: 'none'
                });
                return;
            }else if (packagesNumber == "") {
                wx.showToast({
                    title: '请输入货物数量!',
                    icon: 'none'
                });
                return;
            } else {
                this.setData({
                    isShowSheet: true
                });
            }
        }
    },
    hiddenSheet: function(e) {
        this.setData({
            isShowSheet: false
        });
    },
    radioChange: function(e) {
        var id = e.currentTarget.id;
        var radio = [];
        radio[id] = true;
        this.setData({
            radio: radio,
            btnDisabled: "",
            payMethod: id
        });
    },
    //叫车
    confirmUseCar: function(e) { 
        if(!this.data.isSubmint) {
            this.setData({
                isSubmint: true
            });
            var payMethod = this.data.payMethod;
            if (payMethod != null) {
                //数量
                var carNumber = this.data.carNumber;
                //下单
                var selectCar = app.globalData.carType[this.data.selectCarId];
                var parameter = app.globalData.parameter;
                var priceData = this.data.priceData;
                //地址
                var location = this.getAddressInfo(this.data.positionStart, this.data.positionPassby, this.data.positionEnd);
                var sendOrdDat = this.getTimeStamp(this.data.time);
                var goodsSize = this.data.goodsSize;
                var volume = parseInt(goodsSize[0]) * parseInt(goodsSize[1]) * parseInt(goodsSize[2]);
                var payMethod = this.data.payMethod;
                payMethod = parseInt(payMethod) + 1;


                //是否加尾板，加宽
                var coamingCar = 0;//是否加尾板
                var weibanfei = 0;//尾板费
                var widefei = 0;//加宽费
                if (this.data.isAddPlate) {
                    coamingCar = 1;
                    weibanfei = app.globalData.addPlatePrice;
                }
                if (this.data.isAddWidth) {
                    widefei = app.globalData.addWidthPrice;
                }
                var allData = {
                    loginToken: app.globalData.loginToken,
                    carTypePk: selectCar.carTypeId,
                    truckName: selectCar.truckName,
                    creator: parameter.id,
                    contactMobile: parameter.mobile,
                    fid: "2",
                    clientType: "3",
                    addressInfos: location,
                    pathId: priceData.pathId,
                    sendOrdDat: sendOrdDat,
                    mileages: priceData.totalKilometre,
                    weibanfei: weibanfei,//版尾费
                    coamingCar: coamingCar,//是否加尾板
                    widefei: widefei,//加宽费
                    hasPermit: priceData.hasPermit,
                    txt: this.data.note,
                    notice: this.data.personNote,
                    jbyf: priceData.totalPrice,//基本运费
                    zffs: payMethod,
                    yfhj: this.data.totalPrice,//总运费
                    needsCarCount: carNumber,//需车数量

                    goods: {
                        num: this.data.packagesNumber,
                        bzlx: this.data.selectPackageId,
                        length: goodsSize[0],
                        width: goodsSize[1],
                        height: goodsSize[2],
                        weight: this.data.packagesWeight,
                        name: this.data.goodsName,
                        volume: volume
                    }
                };
 

                wx.request({
                    url: app.globalData.host + '/ardOrd/createOneOrderwx',
                    header: { "contentType": "application/json;charset=utf-8" },
                    method: 'POST',
                    dataType: 'json',
                    responseType: 'text',
                    data: JSON.stringify(allData),
                    success: e => {
                        if (e.data.code == 200) {
                            var orderId = e.data.parameter
                            wx.redirectTo({
                                url: '../../order/orderDetail/orderDetail?orderId=' + orderId
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
                    fail: function (e) {
                        wx.showToast({
                            title: '连接服务器出错，请检查网络！',
                            icon: 'none'
                        });
                    }
                });
            }
        }
    },
    priceDetail: function(e) {
        if (this.data.selectCarId == -1) {
            wx.showToast({
                title: '请先选择车型',
                icon: 'none'
            })
        }else {
            wx.navigateTo({
                url: '../priceDetail/priceDetail'
            });
        } 
    },
    //保存信息
    saveInfo: function(e) {
        
    }
});
