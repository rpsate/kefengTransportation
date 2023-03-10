// pages/me/addAddress/addAddress.js
const app = getApp();
const key = app.globalData.key;
var bmapFile = require('../../../libs/bmap-wx.min.js');
var myMap = new bmapFile.BMapWX({ "ak": key });

Page({
    /**
     * 页面的初始数据
     */
    data: {
        mode: "add",
        myId: "",//待修改路线id
        btnText: "保存路线",
        addressName:"",
        isGetContact: false,
        //地址
        positionStart: {
            isGetPosition: false,
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
            isGetPosition: false,
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
        addressArray: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.mode && options.myid) {
            if(options.mode = "edit") {
                //修改标题
                wx.setNavigationBarTitle({
                    title: '修改路线'
                });

                //获取位置
                var pages = getCurrentPages();
                var page = pages[pages.length - 2];
                
                var addressDataItem = page.data.addressDataItem.myTrendsList;
                var title = page.data.addressDataItem.rendTitle;

                var length = addressDataItem.length;
                for(var i=0;i<length;i++) {
                    addressDataItem[i].location = {
                        latitude: addressDataItem[i].latitude,
                        longitude: addressDataItem[i].longitude
                    }
                    addressDataItem[i].isGetPosition = true;
                }

                var positionPassby = [];
                for(var i=1;i<length-1;i++) {
                    positionPassby.push(addressDataItem[i]);
                }

                this.setData({
                    positionStart: addressDataItem[0],
                    positionEnd: addressDataItem[length-1],
                    addressArray: positionPassby,
                    addressName: title,
                    myId: options.myid,
                    mode: "edit",
                    btnText: "修改路线",
                    isGetContact: true
                });
            }
        }else if(this.data.mode == "add") {
            //获取位置
            myMap.regeocoding({
                success: e => {
                    var latitude = e.wxMarkerData[0].latitude;
                    var longitude = e.wxMarkerData[0].longitude;
                    var position = {
                        name: "",//地址名称
                        address: "",//详细地址
                        district: "",//地区
                        houseNumber: "",//门牌号
                        person: "",//联系人
                        phoneNumber: "",//电话号码
                        location: {
                            latitude: latitude,//经度
                            longitude: longitude//纬度
                        }
                    };
                    position.address = e.wxMarkerData[0].address;
                    position.name = e.originalData.result.business;
                    position.district = e.originalData.result.addressComponent.district

                    position.person = app.globalData.parameter.uname;
                    position.phoneNumber = app.globalData.parameter.mobile;
                    var isGetContact = true;
                    if (position.person == undefined || position.person == null || position.person == "") {
                        isGetContact = false;
                        position.person = "";
                    }
                    if (position.phoneNumber == undefined || position.phoneNumber == null || position.phoneNumber == "") {
                        isGetContact = false;
                        position.phoneNumber = "";
                    }
                    position.isGetPosition = true;

                    this.setData({
                        positionStart: position,
                        isGetContact: isGetContact
                    })
                }
            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var pages = getCurrentPages();
        var page = pages[pages.length - 2];
        page.setData({
            pageFrom: "addAddress"
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            isLogin: app.globalData.isLogin
        });   
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
    inputAddressName: function(e) {
        var addressName = app.filterEmoji(e.detail.value);
        this.setData({
            addressName: addressName
        });
    },
    addPosition: function (e) {
        var addressArray = [];
        addressArray = this.data.addressArray;
        addressArray.push({
            isGetPosition: false,
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
        });
        this.setData({
            addressArray: addressArray
        })
    },
    removePosition: function(e) {
        var id = e.currentTarget.id;
        var addressArray = this.data.addressArray;
        addressArray.splice(id,1);
        this.setData({
            addressArray: addressArray
        })
    },
    //获取起始位置
    getStartPosition: function (e) {
        wx.getSetting({
            success: res => {
                if (!res.authSetting['scope.userLocation']) {
                    wx.showModal({
                        title: '提示',
                        content: '请打开“使用我的地理位置”权限',
                        showCancel: false,
                        confirmColor: '#0783e8',
                        success: function (e) {
                            wx.openSetting({});
                        }
                    })
                } else {
                    var nameStart = this.data.positionStart.name;
                    var addressStart = this.data.positionStart.address;
                    var districtStart = this.data.positionStart.district;
                    var houseNumberStart = this.data.positionStart.houseNumber;
                    var personStart = this.data.positionStart.person;
                    var phoneNumberStart = this.data.positionStart.phoneNumber;
                    var latitudeStart = this.data.positionStart.location.latitude;
                    var longitudeStart = this.data.positionStart.location.longitude;
                    wx.navigateTo({
                        url: '../../map/map?type=start' + '&name=' + nameStart + '&address=' + addressStart + '&district=' + districtStart + '&icon=1' + '&houseNumber=' + houseNumberStart + '&person=' + personStart + '&phoneNumber=' + phoneNumberStart + "&latitude=" + latitudeStart + "&longitude=" + longitudeStart
                    });
                }
            }
        });
    },
    //获取终点位置
    getEndPosition: function (e) {
        wx.getSetting({
            success: res => {
                if (!res.authSetting['scope.userLocation']) {
                    wx.showModal({
                        title: '提示',
                        content: '请打开“使用我的地理位置”权限',
                        showCancel: false,
                        confirmColor: '#0783e8',
                        success: function (e) {
                            wx.openSetting({});
                        }
                    })
                } else {
                    var nameEnd = this.data.positionEnd.name;
                    var addressEnd = this.data.positionEnd.address;
                    var districtEnd = this.data.positionEnd.district;
                    var houseNumberEnd = this.data.positionEnd.houseNumber;
                    var personEnd = this.data.positionEnd.person;
                    var phoneNumberEnd = this.data.positionEnd.phoneNumber;
                    var latitudeEnd = this.data.positionEnd.location.latitude;
                    var longitudeEnd = this.data.positionEnd.location.longitude;
                    wx.navigateTo({
                        url: '../../map/map?type=end' + '&name=' + nameEnd + '&address=' + addressEnd + '&district=' + districtEnd + '&icon=3' + '&houseNumber=' + houseNumberEnd + '&person=' + personEnd + '&phoneNumber=' + phoneNumberEnd + "&latitude=" + latitudeEnd + "&longitude=" + longitudeEnd
                    });
                }
            }
        });
    },
    //获取途径位置
    getPosition: function (e) {
        wx.getSetting({
            success: res => {
                if (!res.authSetting['scope.userLocation']) {
                    wx.showModal({
                        title: '提示',
                        content: '请打开“使用我的地理位置”权限',
                        showCancel: false,
                        confirmColor: '#0783e8',
                        success: function (e) {
                            wx.openSetting({});
                        }
                    })
                } else {
                    var id = e.currentTarget.id;
                    var data = this.data.addressArray;
                    var name = data[id].name;
                    var address = data[id].address;
                    var district = data[id].district;
                    var houseNumber = data[id].houseNumber;
                    var person = data[id].person;
                    var phoneNumber = data[id].phoneNumber;
                    var latitude = data[id].location.latitude;
                    var longitude = data[id].location.longitude;
                    wx.navigateTo({
                        url: '../../map/map?type=passby' + '&name=' + name + '&address=' + address + '&district=' + district + '&icon=2' + '&houseNumber=' + houseNumber + '&person=' + person + '&phoneNumber=' + phoneNumber + "&latitude=" + latitude + "&longitude=" + longitude + "&id=" + id
                    });
                }
            }
        });
    },
    //地址交换
    exchange: function (e) {
        var id = e.currentTarget.id;
        var data = this.data.addressArray;
        var length = data.length;
        if (id < length - 1) {
            var temp = data[id];
            var nextId = parseInt(id) + 1;
            data[id] = data[nextId];
            data[nextId] = temp;
            this.setData({
                addressArray: data
            })
        } else if (id == length - 1) {
            if (this.data.isGetEndPosition == false) {
                wx.showToast({
                    title: '输入地址不完整',
                    icon: 'none'
                })
            } else {
                var temp = data[id];
                data[id] = this.data.positionEnd;
                this.setData({
                    positionEnd: temp,
                    addressArray: data
                })
            }
        }
    },
    saveAddress: function(e) {
        var addressName = this.data.addressName;
        var positionStart = this.data.positionStart;
        var positionEnd = this.data.positionEnd;
        var positionPassby = this.data.addressArray;
        var positionPassbyLength = positionPassby.length;
        
        

        //判断输入路线是否完整
        var isGetPosition = true;
        if(this.data.isGetContact == false) {
            isGetPosition = false
        }else if(positionStart.isGetPosition == false) {
            isGetPosition = false;
        }else if(positionEnd.isGetPosition == false) {
            isGetPosition = false;
        }else {
            for(var i=0;i<positionPassbyLength;i++) {
                if(positionPassby[i].isGetPosition == false) {
                    isGetPosition = false;
                }
            }
        }

        if(addressName == "") {
            wx.showToast({
                title: '请输入路线名称！',
                icon: 'none'
            });
            return;
        }else if(isGetPosition == false){
            wx.showToast({
                title: '请填写完整的联系人和路线！',
                icon: 'none'
            });
            return;
        }else {
            //加工处理成所需数据
            var addressData = [];

            positionStart.latitude = positionStart.location.latitude;
            positionStart.longitude = positionEnd.location.longitude;
            addressData.push(positionStart);

            for(var i=0;i<positionPassbyLength;i++) {
                positionPassby[i].latitude = positionPassby[i].location.latitude;
                positionPassby[i].longitude = positionPassby[i].location.longitude;
                addressData.push(positionPassby[i]);
            }

            positionEnd.latitude = positionEnd.location.latitude;
            positionEnd.longitude = positionEnd.location.longitude;
            addressData.push(positionEnd);
            
            //添加路线
            if(this.data.mode == "add") {
                wx.request({
                    url: app.globalData.host + '/cordController/addMyTrend',
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
                        rendTitle: addressName,
                        myTrendsList: addressData
                    },
                    success: function(e) {
                        if(e.data.code == 200) {
                            wx.showModal({
                                title: '提示',
                                content: '保存成功!',
                                showCancel: false,
                                confirmColor: '#0783e8',
                                success: function (e) {
                                    wx.navigateBack({
                                        delta: 1,
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
            //编辑路线
            }else if(this.data.mode == "edit") {
                wx.request({
                    url: app.globalData.host + '/cordController/updateMyTrend',
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
                        myId: this.data.myId,
                        rendTitle: addressName,
                        myTrendsList: addressData
                    },
                    success: function (e) {
                        if (e.data.code == 200) {
                            wx.showModal({
                                title: '提示',
                                content: '修改成功!',
                                showCancel: false,
                                confirmColor: '#0783e8',
                                success: function (e) {
                                    wx.navigateBack({
                                        delta: 1,
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
        }
    }
})