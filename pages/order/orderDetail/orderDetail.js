// pages/order/orderDetail/orderDetail.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //服务器地址
        rating: ["star_lg_yellow", "star_lg_yellow", "star_lg_yellow", "star_lg_yellow", "star_lg_yellow"],
        isShowOrderDetail: false,
        navbarActive: ["active",""],
        isShowDetailInfo: true,
        isShowMap: true,
        //加小费
        isShowAddMoneyModal: false,
        addMoneyRadio: [true],
        tempAddMoney: "30.0",
        addMoney: "",
        //取消原因
        isShowCancelModal: false,
        cancelRadio: [true],
        cancelRadioId: 0,
        cancelText: "",
        //展示信息滑动数据记录
        pageY: null,
        infoGroupHeight:0,

        //地图显示
        markers: [],
        points: [],
        lines: null,
        location: {
            latitude: "",
            longitude: ""
        },
        //时间
        timeStr: "",
        //订单主键
        orderId: null,
        orderData: null,
        //订单状态
        orderStatus: "",
        orderString: "",
        orderStringTip: "",
        //结算方式显示字符
        payMethodStr: "",
        //地址个数
        addressNumber: 2,
        //提示栏状态 1等待接单 2运输中 3待评价 4 已评价 5已取消 6异常
        tipStatus:1,
        //司机栏滑动处理数据
        pageX: null,
        driverLeft: 0,
        driverClass: ["driver-active"],
        //司机信息
        driverData: [],
        driverLength: 1,
        selectDriverId: 0,//选中司机id
        //司机状态码
        //派单状态 0为待接单 100为接单 110到达发货地 120装货完成出发 130到达卸货地 160卸货完成 200订单完成
        driverStatus: 0,
        //是否已取消状态码 0正常订单 1取消订单
        delStatus: 0,
        //司机头像
        driverUrl: [],
        //地图高度
        mapHeight: "100%"
    },
    //设置map控件参数
    setMapOptions: function(addressList) {
        var markers = [];
        var points = [];

        markers.push({
            id: 0,
            latitude: addressList[0].lat,
            longitude: addressList[0].lgt,
            iconPath: "../../../images/map_qd.png",
            width: 30,
            height: 40
        });
        
        var endAddressId = addressList.length - 1;
        if (addressList.length > 2) {
            for (var i = 1; i < endAddressId; i++) {
                markers.push({
                    id: i,
                    latitude: addressList[i].lat,
                    longitude: addressList[i].lgt,
                    iconPath: "../../../images/map_tj.png",
                    width: 30,
                    height: 40
                });
            }
        }

        markers.push({
            id: endAddressId,
            latitude: addressList[endAddressId].lat,
            longitude: addressList[endAddressId].lgt,
            iconPath: "../../../images/map_zd.png",
            width: 30,
            height: 40
        });

        //设置定位点
        var location = {
            latitude: "",
            longitude: ""
        };

        for (var i = 0; i < addressList.length; i++) {
            location = {
                latitude: addressList[i].lat,
                longitude: addressList[i].lgt
            }
            points.push(location);
        }

        var lines = {
            points: points,
            width: 10
        }
        

        //设置中心位置
        location.latitude = (parseFloat(addressList[0].lat) + parseFloat(addressList[endAddressId].lat)) / 2;
        location.longitude = (parseFloat(addressList[0].lgt) + parseFloat(addressList[endAddressId].lgt)) / 2;

        this.setData({
            markers: markers,
            points: points,
            location: location,
            lines: lines
        });
    },

    //更具时间戳获取显示时间
    getDateName: function (timeStamp) {
        var date = new Date(timeStamp);
        var dateString = "";
        var year = date.getFullYear();
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
        dateString = year + "." + month + "." + days + " " + hours + ":" + minutes;
        return dateString;
    },
    //设置显示最终时间
    getDateString: function(timeStamp) {
        var timeString = this.getDateName(timeStamp);
        this.setData({
            timeStr: timeString
        });
    },
    //获取订单
    getOrder: function(orderId) {
        wx.showLoading({
            title: '加载中······',
            mask: true
        })
        //获取订单详情
        wx.request({
            url: app.globalData.host + '/ardOrd/getOrderByIdwx',
            method: 'POST',
            header: { "contentType": "application/json;charset=utf-8" },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: {
                loginToken: app.globalData.loginToken,
                orderId: orderId
            },
            success: e => {
                if (e.data.code == 200) {
                    //订单状态
                    var orderData = e.data.parameter;
                    //司机信息
                    var driverData = e.data.parameter.orderSendInfoList;
                    //配置司机头像
                    var driverUrl = [];
                    for(let i=0;i<driverData.length;i++) {
                        driverUrl[i] = app.globalData.host + "/" + driverData[i].userUrl; 
                    }
                    var driverLength = driverData.length;

                    //设置map参数
                    this.setMapOptions(e.data.parameter.lgtAddressList);
                    //设置map参数中的司机位置
                    var markers = this.data.markers;
                    markers.push({
                        latitude: orderData.lat,
                        longitude: orderData.lgt,
                        iconPath: "../../../images/map_siji2.png",
                        width: 40,
                        height: 40
                    });

                    //设置显示时间
                    this.getDateString(e.data.parameter.sendOrdDat);
                    //设置支付方式显示
                    var payMethod = e.data.parameter.zffs;
                    var payMethodStr = "";
                    if (payMethod == 1) {
                        payMethodStr = "现金";
                    } else if (payMethod == 2) {
                        payMethodStr = "回单付";
                    } else {
                        payMethodStr = "月结";
                    }
                    //设置货物显示
                    var goods = e.data.parameter.goodList[0];

                    this.setData({
                        markers: markers,//图标
                        orderData: orderData,
                        payMethodStr: payMethodStr,
                        addressNumber: e.data.parameter.lgtAddressList.length,//设置地址个数
                        driverData: driverData,//设置司机信息
                        driverLength: driverLength,
                        driverUrl: driverUrl
                    });

                    //设置渲染状态
                    //delStatus orderStatus driverStatus
                    if (driverLength == 0) {
                        this.setStatus(orderData.deleted, orderData.ordStatus);
                    } else {
                        this.setStatus(orderData.deleted, orderData.ordStatus, driverData[0].status, driverData[0]);
                    }

                    //隐藏加载框
                    wx.hideLoading();
                } else if (e.data.code == 888) {
                    //隐藏加载框
                    wx.hideLoading();
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
                    wx.hideLoading();
                    wx.showToast({
                        title: '系统正在更新，暂停服务！',
                        icon: 'none'
                    });
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            isLogin: app.globalData.isLogin,
        });

        if(options.type) {
            //type==0查看物流信息 type==1查看订单详情
            var type = options.type;
            if(type == 0) {
                var navbarActive = [];
                navbarActive[0] = "active";
                this.setData({
                    navbarActive: navbarActive,
                    isShowOrderDetail: false
                });
            }else {
                var navbarActive = [];
                navbarActive[1] = "active";
                this.setData({
                    navbarActive: navbarActive,
                    isShowOrderDetail: true
                });
            }
        }

        //设置地图高度
        wx.getSystemInfo({
            success: e => {
                var mapHeight = parseInt(e.windowHeight) - 51;
                mapHeight = mapHeight.toString() + "px";
                this.setData({
                    mapHeight: mapHeight
                });
            }
        })
        
        if(options.orderId) {
            var orderId = options.orderId
            this.setData({
                orderId: orderId
            });
        
            //获取订单
            this.getOrder(orderId);
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
        if (this.data.pageFrom == "evaluate") {
            var driverData = this.data.driverData[this.data.selectDriverId];
            var driverDatas = this.data.driverData;
            if (driverData.appraiseList.length > 0) {
                //已评价
                var tipStatus = 4;
                driverDatas[this.data.selectDriverId].appraiseList[0].stat = 1;
                wx.setNavigationBarTitle({
                    title: '已评价'
                });

                var grade = driverData.appraiseList[0].grade;
                var rating = [];
                for (var n = 0; n < grade; n++) {
                    rating.push("star_lg_yellow");
                }
                for (var n = grade; n < 5; n++) {
                    rating.push("star_lg_grey");
                }
                this.setData({
                    rating: rating,
                    tipStatus: tipStatus,
                    driverData: driverDatas
                });
            }
        }else if(this.data.pageFrom == 1) {
            this.getOrder(this.data.orderId);
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
    //选择菜单
    selectActive: function (e) {
        var id = e.currentTarget.id;
        var navbarActive = [];
        navbarActive[id] = "active";
        this.setData({
            navbarActive: navbarActive
        });
        if(id == 0) {
            this.setData({
                isShowOrderDetail: false
            })
        }else {
            this.setData({
                isShowOrderDetail: true
            })
        }
    },
    //选择司机
    selectDriver: function(e) {
        //选中司机渲染处理
        var id = e.currentTarget.id;
        var driverClass = [];
        driverClass[id] = "driver-active";
        this.setData({
            driverClass: driverClass,
            selectDriverId: id
        });
        //选中司机数据处理
        var driverData = this.data.driverData[id];
        this.setStatus(this.data.delStatus, this.data.orderStatus, driverData.status,driverData);
    },
    //司机栏滑动处理
    driverTouchStart: function(e) {
        this.setData({
            pageX: e.changedTouches[0].pageX
        });
    },
    driverTouchEnd: function(e) {
        var lastPageX = this.data.pageX;
        if(lastPageX != null) {
            var driverLeft = this.data.driverLeft;
            var pageX = e.changedTouches[0].pageX;
            var direction = parseInt(pageX) - parseInt(lastPageX);
            //判断方向
            if(direction>40) {//往右划
                if(driverLeft<0) {
                    driverLeft = parseInt(driverLeft) + 80; 
                }
            }else if (direction < -40) {//往左划
                var driverLength = parseInt(this.data.driverLength);
                if(driverLength > 4) {
                    var limitNumber = -((driverLength - 4) * 80);
                    if (driverLeft > limitNumber) {
                        driverLeft = parseInt(driverLeft) - 80;
                    }
                }
            }
            this.setData({
                driverLeft: driverLeft
            });
        }
        
    },
    //加小费
    selectAddMoney: function(e) {
        var addMoneyRadio = [];
        var id = e.currentTarget.id;
        var money = e.currentTarget.dataset.money;
        addMoneyRadio[id] = true;
        this.setData({
            addMoneyRadio: addMoneyRadio,
            tempAddMoney: money
        });
    },
    addMoneyCancel: function(e) {
        this.setData({
            isShowMap: true,
            isShowAddMoneyModal: false
        });
    },
    addMoneyConfirm: function(e) {
        this.setData({
            isShowMap: true,
            isShowAddMoneyModal: false,
            addMoney: this.data.tempAddMoney
        });
    },
    addMoney: function(e) {
        this.setData({
            isShowMap: false,
            isShowAddMoneyModal: true
        });
    },
    //评价
    evaluate: function(e) {
        var driverId = this.data.driverData[this.data.selectDriverId].driver;
        var apprid = this.data.driverData[this.data.selectDriverId].appraiseList[0].apprid;
        wx.navigateTo({
            url: '../evaluate/evaluate?orderId=' + this.data.orderId + "&driverId=" + driverId + "&pageFrom=orderDetail" + "&apprid=" + apprid
        });
    },
    //选取取消订单原因
    cancelRadio: function(e) {
        var id = e.currentTarget.id;
        var cancelRadio = [];
        cancelRadio[id] = true;
        this.setData({
            cancelRadio: cancelRadio,
            cancelRadioId: id
        });
    },
    //填写取消原因
    cancelInputText: function(e) {
        var cancelText = app.filterEmoji(e.detail.value);
        this.setData({
            cancelText: cancelText
        });
    },
    //确认取消订单
    confirmCancel: function(e) {
        var cancelRadioId = parseInt(this.data.cancelRadioId) + 1;
        var cancelText = this.data.cancelText;
        if(cancelText == "") {
            wx.showToast({
                title: '请填写取消原因',
                icon: 'none'
            });
            return;
        }else if(cancelText.length <7) {
            wx.showToast({
                title: '取消原因字数不应少于7',
                icon: 'none'
            });
            return;
        }else {
            this.setData({
                isShowCancelModal: false
            });
            this.cancelOrder(this.data.orderId,cancelRadioId,cancelText);
        }
    },
    //调出取消订单模态框
    cancleOrderModal: function(e) {
        this.setData({
            isShowCancelModal: true
        });
    },
    //隐藏取消订单模态框
    cancelOrderMOdal: function(e) {
        this.setData({
            isShowCancelModal: false
        });
    },
    //取消订单
    cancelOrder: function (orderId, cancelReason, cancelReasonDetail) {
        wx.request({
            url: app.globalData.host + '/ardOrd/cancelOrderByIdwx',
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
                orderId: orderId,
                cancelReason: cancelReason,
                cancelReasonDetail: cancelReasonDetail
            },
            success: e => {
                if (e.data.code == 200) {
                    wx.showModal({
                        title: '提示',
                        content: '取消成功',
                        showCancel: false,
                        confirmColor: '#0783e8',
                        success: function(res) {
                            var pages = getCurrentPages();
                            var page = pages[pages.length - 2];
                            page.setData({
                                pageFrom: 1
                            });
                            wx.switchTab({
                                url: '../../order/order'
                            });
                        }
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
                        confirmColor: '#0783e8'
                    });
                }
            },
            complete: function(e) {
            }
        });
    },
    //状态设置
    setStatus: function(delStatus,orderStatus,driverStatus=0,driverData={}) {
        var tipStatus = null;
        var orderString = "";
        var orderStringTip = "";

        if (delStatus == 1) {
            //已取消
            tipStatus = 5;
            orderString = "订单已取消";
            wx.setNavigationBarTitle({
                title: '订单已取消'
            });

            var orderData = this.data.orderData;
            var operListLength = orderData.operList.length;
            var oper = orderData.operList[operListLength - 2];//最后一个操作为删除点单，倒数第二个为取消订单原因
            orderStringTip = oper.updatedetails;
        } else {
            //提示栏状态 1等待接单 2运输中 3待评价 4 已评价 5已取消 6异常
            //tipStatus==1 等待配送
            switch (orderStatus) {
                case 100:
                case 110:
                case 111:
                case 112:
                case 130:
                case 131:
                case 132:
                    tipStatus = 1;
                    orderString = "等待配送";
                    orderStringTip = "正在分配司机，等待接单";
                    wx.setNavigationBarTitle({
                        title: '等待配送'
                    });
                    break;
                case 150:
                    //运输中需要判断各个司机的运输状态
                    //派单状态 0为待接单 100为接单 110到达发货地 120装货完成出发 130到达卸货地 160卸货完成 200订单完成
                    switch (driverStatus) {
                        case 0:
                            tipStatus = 1;
                            orderString = "等待配送";
                            orderStringTip = "正在分配司机，等待接单";
                            wx.setNavigationBarTitle({
                                title: '等待配送'
                            });
                            break;
                        case 100:
                            tipStatus = 2;
                            orderString = "司机已接单";
                            orderStringTip = driverData.driverName + " " + driverData.driverMobile + " " + driverData.licenceCode;
                            wx.setNavigationBarTitle({
                                title: '司机已接单'
                            });
                            break;
                        case 110:
                        case 120:
                        case 130:
                        case 160:
                            tipStatus = 2;
                            orderString = "运输中";
                            orderStringTip = driverData.driverName + " " + driverData.driverMobile + " " + driverData.licenceCode;
                            wx.setNavigationBarTitle({
                                title: '运输中'
                            });
                            break;
                        case 200:
                            //未评价
                            if (driverData.appraiseList[0].stat == 0) {
                                tipStatus = 3;
                                orderString = "司机已完成配送";
                                orderStringTip = "感谢您使用科风速运";
                                wx.setNavigationBarTitle({
                                    title: '已完成配送'
                                });

                                var grade = driverData.appraiseList[0].grade;
                                var rating = [];
                                for (var n = 0; n < grade; n++) {
                                    rating.push("star_lg_yellow");
                                }
                                for (var n = grade; n < 5; n++) {
                                    rating.push("star_lg_grey");
                                }
                                this.setData({
                                    rating: rating
                                });
                            } else if (driverData.appraiseList[0].stat == 1) {
                                //已评价
                                tipStatus = 4;
                                orderString = "您的评价"
                                wx.setNavigationBarTitle({
                                    title: '已评价'
                                });

                                var grade = driverData.appraiseList[0].grade;
                                var rating = [];
                                for (var n = 0; n < grade; n++) {
                                    rating.push("star_lg_yellow");
                                }
                                for (var n = grade; n < 5; n++) {
                                    rating.push("star_lg_grey");
                                }
                                this.setData({
                                    rating: rating
                                });
                            }
                            break;
                    };
                    break;
                case 200:
                    //未评价
                    if (driverData.appraiseList[0].stat == 0) {
                        tipStatus = 3;
                        orderString = "司机已完成配送";
                        orderStringTip = "感谢您使用科风速运";
                        wx.setNavigationBarTitle({
                            title: '已完成配送'
                        });

                        var grade = driverData.appraiseList[0].grade;
                        var rating = [];
                        for (var n = 0; n < grade; n++) {
                            rating.push("star_lg_yellow");
                        }
                        for (var n = grade; n < 5; n++) {
                            rating.push("star_lg_grey");
                        }
                        this.setData({
                            rating: rating
                        });

                    } else if (driverData.appraiseList[0].stat == 1) {
                        //已评价
                        tipStatus = 4;
                        orderString = "您的评价"
                        wx.setNavigationBarTitle({
                            title: '已评价'
                        });

                        var grade = driverData.appraiseList[0].grade;
                        var rating = [];
                        for (var n = 0; n < grade; n++) {
                            rating.push("star_lg_yellow");
                        }
                        for (var n = grade; n < 5; n++) {
                            rating.push("star_lg_grey");
                        }
                        this.setData({
                            rating: rating
                        });
                    }
                    break;
                default:
                    tipStatus = 6;
                    orderString = "未获取订单信息";
                    orderStringTip = "未获取订单信息";
                    wx.setNavigationBarTitle({
                        title: '未知状态'
                    });

            }
        }

        this.setData({
            delStatus: delStatus,//是否取消订单状态
            orderStatus: orderStatus,//订单状态
            driverStatus: driverStatus,//司机状态码
            tipStatus: tipStatus,//提示 状态
            orderString: orderString,//提示标题
            orderStringTip: orderStringTip//提示文本
        });
    },
    //查看物流详情
    logisticsDetail: function(e) {
        wx.navigateTo({
            url: '../transportDetail/transportDetail?driverId='+this.data.selectDriverId
        });
    },
    //司机头像出错时
    onErrorDriverImage: function(e) {
        var driverUrl = this.data.driverUrl;
        driverUrl[this.data.selectDriverId] = '../../../images/user_img_default.png';
        this.setData({
            driverUrl: driverUrl
        });
    }
});