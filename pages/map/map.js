// pages/map/map.js
const app = getApp();
const key = app.globalData.key;
var bmapFile = require('../../libs/bmap-wx.min.js');
var myMap = new bmapFile.BMapWX({ "ak": key });

Page({

    /**
     * 页面的初始数据
     */
    data: {
        iconPath: "../../images/map_qd.png",
        isShowClose: false,
        isShowCancle: false,
        isShowBtnAddress: false,
        searchFocus: false,
        tips: [],
        allUsually: [],
        tipsUsually: [],
        markers: [],
        latitude: "",
        longitude: "",
        keywords: "",
        name: "",
        address: "",
        district: "",
        person: "",
        phoneNumber: "",
        houseNumber: "",
        type: "",
        id: "",
        //起始地址禁止填写联系人
        contactDisabled: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var iconPath;
        if (options.icon) {
            if (options.icon == "1") {
                    iconPath = "../../images/map_qd.png";
            } else if (options.icon == "2") {
                    iconPath = "../../images/map_tj.png";
            } else {
                    iconPath = "../../images/map_zd.png";
            }
            this.setData({
                iconPath: iconPath
            })
        }

        if(options.latitude && options.longitude) {
            this.setData({
                latitude: options.latitude,
                longitude: options.longitude
            });
        }else {
            wx.getLocation({
                success: e => {
                    this.setData({
                        latitude: e.latitude,
                        longitude: e.longitude
                    });
                },
                fail: function(e) {
                    wx.showToast({
                        title: '获取位置失败!',
                        icon: 'none'
                    })
                }
            })
        }
        if(options.type) {
            this.setData({
                type: options.type
            });
            if(options.type == "start") {
                this.setData({
                    contactDisabled: true
                });
            }
        }
        if(options.id) {
            this.setData({
                id: options.id
            })
        }

        if(options.name && options.address && options.district) {
            this.setData({
                name: options.name,
                address: options.address,
                district: options.district
            })
        }

        if (options.houseNumber) {
            this.setData({
                houseNumber: options.houseNumber
            });
        }

        
        if(options.person) {
            this.setData({
                person: options.person,
            });
        }

        if (options.phoneNumber) {
            this.setData({
                phoneNumber: options.phoneNumber
            });
        }

        //获取常用地址
        var allUsually = [];
        var addressData = wx.getStorageSync("addressData");
        var addressDateLength = addressData.length;
        for(var i=0;i<addressDateLength;i++) {
            allUsually.push(addressData[i].positionStart);
            var itemLength = addressData[i].positionPassby.length;
            for(var j=0;j<itemLength;j++) {
                allUsually.push(addressData[i].positionPassby[j]);
            }
            allUsually.push(addressData[i].positionEnd);
        }
        this.setData({
            allUsually: allUsually
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var name = this.data.name;
        var address = this.data.address;
        if(name != "" || address != "") {
            this.setData({
                markers: [{
                    id: 0,
                    latitude: this.data.latitude,
                    longitude: this.data.longitude,
                    iconPath: this.data.iconPath,
                    width: 30,
                    height: 40,
                    callout: {
                        content: name + "\n" + address,
                        borderColor: "#e5e5e5",
                        borderRadius: 5,
                        color: "#333",
                        padding: 10,
                        bgColor: "#ffffff",
                        fontSize: 16,
                        display: "ALWAYS",
                    }
                }]
            });
        }
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
    searchInput: function(e) {
        var keywords = app.filterEmoji(e.detail.value);
        if(keywords.length != 0) {
            this.setData({
                isShowClose: true,
                isShowBtnAddress: false
            })
        }else {
            this.setData({
                isShowClose: false,
                isShowBtnAddress: true,
                tips: []
            })
            return;
        }

        //设置搜索到的常用地址
        var allUsually = this.data.allUsually;
        var allUsuallyLength = allUsually.length;
        var tipsUsually = [];
        for(var i=0;i<allUsuallyLength;i++) {
            if (allUsually[i].name.indexOf(keywords) != -1) {
                tipsUsually.push(allUsually[i]);
            }
        }
        this.setData({
            tipsUsually: tipsUsually
        });

        //设置搜索地址
        myMap.suggestion({
            query: keywords,
            region: '湖南',
            city_limit: false,
            success: e => {
                var result = e.result;
                this.setData({
                    tips: result
                });
            },
            fail: e => {
                wx.showToast({
                    title: '无法获取位置，请检查网路！',
                    icon: "none"
                })
            }
        })
        
    },
    searchFocus: function(e) {
        this.setData({
            isShowCancle: true,
            isShowBtnAddress: true,
            searchFocus: true
        })
    },
    clearSearchInput: function(e) {
        this.setData({
            keywords: "",
            isShowClose: false,
            searchFocus: true,
            isShowBtnAddress: true,
            tips: [],
            tipsUsually: []
        })
    },
    SearchCancle: function(e) {
        this.setData({
            keywords: "",
            isShowClose: false,
            isShowCancle: false,
            isShowBtnAddress: false,
            tips: [],
            tipsUsually: []
        })
    },
    chooseAddress: function(e) {
        var id = e.target.dataset.bindex;
        var addressData = this.data.tips[id];
        var latitude = this.data.tips[id].location.lat;
        var longitude = this.data.tips[id].location.lng;
        var location = latitude + "," + longitude;
        var address;
        myMap.regeocoding({
            location: location,
            success: e => {
                this.setData({
                    name: addressData.name,
                    address: e.originalData.result.formatted_address,
                    district: addressData.district,
                    latitude: latitude,
                    longitude: longitude,
                    keywords: "",
                    
                    isShowClose: false,
                    isShowCancle: false,
                    isShowBtnAddress: false,
                    tips: [],
                    tipsUsually: [],
                    markers: [{
                        id: 0,
                        latitude: latitude,
                        longitude: longitude,
                        iconPath: this.data.iconPath,
                        width: 30,
                        height: 40,
                        callout: {
                            content: addressData.name + "\n" + e.originalData.result.formatted_address,
                            borderColor: "#e5e5e5",
                            borderRadius: 5,
                            color: "#333",
                            padding: 10,
                            bgColor: "#ffffff",
                            fontSize: 16,
                            display: "ALWAYS",
                        }
                    }]
                });
            }
        });
    },
    chooseUsuallyAddress:function(e) {
        var id = e.currentTarget.id;
        var addressData = this.data.tipsUsually[id];
        var latitude = addressData.location.latitude;
        var longitude = addressData.location.longitude;
        var location = latitude + "," + longitude;
        var address;
        myMap.regeocoding({
            location: location,
            success: e => {
                this.setData({
                    address: addressData.address,
                    name: addressData.name,
                    district: addressData.district,
                    latitude: latitude,
                    longitude: longitude,
                    houseNumber: addressData.houseNumber,
                    person: addressData.person,
                    phoneNumber: addressData.phoneNumber,
                    keywords: "",
                    isShowClose: false,
                    isShowCancle: false,
                    isShowBtnAddress: false,
                    tips: [],
                    tipsUsually: [],
                    markers: [{
                        id: 0,
                        latitude: latitude,
                        longitude: longitude,
                        iconPath: this.data.iconPath,
                        width: 30,
                        height: 40,
                        callout: {
                            content: addressData.name + "\n" + addressData.address,
                            borderColor: "#e5e5e5",
                            borderRadius: 5,
                            color: "#333",
                            padding: 10,
                            bgColor: "#ffffff",
                            fontSize: 16,
                            display: "ALWAYS",
                        }
                    }]
                });
            }
        });

    },
    getLocation: function(e) {
        wx.showToast({
            title: '正在获取位置',
            icon: 'loading',
            duration: 10000
        });
        
        myMap.regeocoding({
            success: data => {
                wx.hideToast();
                this.setData({
                    //设置marker
                    markers: [{
                        id: 0,
                        latitude: data.wxMarkerData[0].latitude,
                        longitude: data.wxMarkerData[0].longitude,
                        iconPath: this.data.iconPath,
                        width: 30,
                        height: 40,
                        callout: {
                            content: data.originalData.result.business + "\n" + data.originalData.result.formatted_address,
                            borderColor: "#e5e5e5",
                            borderRadius: 5,
                            color: "#333",
                            padding: 10,
                            bgColor: "#ffffff",
                            fontSize: 16,
                            display: "ALWAYS",
                        }
                    }],
                    name: data.originalData.result.business,
                    address: data.originalData.result.formatted_address,
                    district: data.originalData.result.addressComponent.district,
                    isShowCancle: false,
                    isShowClose: false,
                    isShowBtnAddress: false
                });
            },
            fail: function(e) {
                wx.hideToast();
                if(e.errCode == 0) {
                    //定位权限被禁止
                    wx.showModal({
                        title: '提示',
                        content: '定位权限被禁止，请点击右上角菜单打开权限！',
                        showCancel: false,
                        confirmColor: '#0783e8'
                    });
                } else {
                    wx.showToast({
                        title: '获取位置失败！',
                        icon: 'none'
                    })
                }  
            }
        });
    },
    getHouseNumber: function(e) {
        this.setData({
            houseNumber: app.filterEmoji(e.detail.value)
        });
    },
    getPerson: function(e) {
        this.setData({
            person: app.filterEmoji(e.detail.value)
        });
    },
    getPhoneNumber: function(e) {
        this.setData({
            phoneNumber: e.detail.value
        })
    },
    submit: function(e) {
        if(this.data.name == "" || this.data.address == "") {
            wx.showToast({
                title: '地址不能为空！',
                icon: 'none'
            });
            return;
        }else if(this.data.person == "") {
            wx.showToast({
                title: '联系人不能为空！',
                icon: 'none'
            })
            return;
        } else if (!app.checkPhoneNumber(this.data.phoneNumber)) {
            return;
        } else {
            var contactData = {
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
            };
            contactData.name = this.data.name;
            contactData.address = this.data.address;
            contactData.district = this.data.district;
            contactData.houseNumber = this.data.houseNumber;
            contactData.person = this.data.person;
            contactData.phoneNumber = this.data.phoneNumber;
            contactData.location.latitude = this.data.latitude;
            contactData.location.longitude = this.data.longitude;
            contactData.isGetPosition = true;
            var pages = getCurrentPages();
            var page = pages[pages.length - 2];
            if(this.data.type == "start") {
                page.setData({
                    positionStart: contactData,
                    isGetContact: true,
                    pageFrom: "map"
                })
            }else if(this.data.type == "end") {
                page.setData({
                    positionEnd: contactData,
                    pageFrom: "map"
                })
            }else if(this.data.type == "passby") {
                var id = this.data.id;
                var data = page.data.addressArray;
                data[id] = contactData;
                page.setData({
                    addressArray: data,
                    pageFrom: "map"
                })
            }
            wx.navigateBack({
                delta: 1,
            })
        }
        
    },
    useUsuallyAddress: function(e) {
        wx.navigateTo({
            url: '../me/usuallyAddress/usuallyAddress'
        });
    }
})