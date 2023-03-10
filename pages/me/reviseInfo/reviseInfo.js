// pages/me/reviseInfo/reviseInfo.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        headImage: "../../../images/user_img_default.png",//默认头像地址
        isModifyUserUrl: false,
        name: "",
        sex: "",
        phoneNumber: "",

        sexId: null,

        tempName: "",
        tempPhoneNumber: "",

        isShowNameModal: false,
        isShowPhoneNumberModal: false,

        pickerSex: ["男", "女", "保密"],
        userInfo: ""

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //设置数据
        var userInfo = app.globalData.parameter;
        //性别数据渲染处理
        var userId = parseInt(userInfo.sex);
        var sex = "";
        switch (userId) {
            case 0: 
                sex = "男";
                break;
            case 1: 
                sex = "女"
                break;
            case 2:
                sex = "保密";
                break;
        }
        //头像数据渲染处理
        var userUrl = userInfo.userUrl;
        if (userUrl == "") {
            userUrl = this.data.headImage
        }else {
            userUrl = app.globalData.host + "/" + userUrl;
        }
        this.setData({
            headImage: userUrl,//默认头像地址
            name: userInfo.uname,
            sexId: userInfo.sex,
            sex: sex,
            phoneNumber: userInfo.mobile,

            tempName: userInfo.uname,
            tempPhoneNumber: userInfo.mobile,
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
    //检测电话号码
    checkPhoneNumber: function (e) {
        var phoneNumber = e;
        if (phoneNumber.length == 0) {
            wx.showToast({
                title: '请输入电话号码',
                icon: 'none'
            });
            return false;
        } else if (phoneNumber.length != 11 || phoneNumber.charAt(0) != '1') {
            wx.showToast({
                title: '号码格式不正确',
                icon: 'none'
            });
            return false;
        } else {
            return true;
        }
    },
    //填写称呼
    writeName: function(e) {
        this.setData({
            isShowNameModal: true
        });
    },
    writeNameCancle: function(e) {
        this.setData({
            isShowNameModal: false
        });
    },
    writeNameConfirm: function(e) {
        this.setData({
            name: this.data.tempName,
            isShowNameModal: false
        });
    },
    inputName: function(e) {
        this.setData({
            tempName: e.detail.value
        });
    },
    //选择性格
    selectSex: function(e) {
        var id = e.detail.value;
        var sex = "男";
        if(id == 1) {
            sex = "女";
        }else if(id == 2) {
            sex = "保密";
        }
        this.setData({
            sex: sex,
            sexId: id
        });
    },
    //电话号码
    writePhoneNumber: function(e) {
        this.setData({
            isShowPhoneNumberModal: true
        });
    },
    writePhoneNumberCancle: function(e) {
        this.setData({
            isShowPhoneNumberModal: false
        });
    },
    writePhoneNumberConfirm: function(e) {
        var phoneNumber = this.data.tempPhoneNumber;
        if(this.checkPhoneNumber(phoneNumber)) {
            this.setData({
                phoneNumber: phoneNumber,
                isShowPhoneNumberModal: false
            });
        }        
    },
    inputPhoneNumber: function(e) {
        var phoneNumber = e.detail.value;
        this.setData({
            tempPhoneNumber: phoneNumber
        });
    },
    //选择头像
    selcetHeadImage: function(e) {
        wx.chooseImage({
            count: 1,
            sizeType: ["compresses"],
            success: e => {
                var imagePath = e.tempFilePaths[0];
                this.setData({
                    headImage: imagePath,
                    isModifyUserUrl: true
                });
            }
        })
    },
    saveInfo: function(e) {
        wx.showLoading({
            title: '修改中······',
            mask: true
        });

        wx.request({
            url: app.globalData.host + '/ArdUserInfo/setUserInfoDatawx',
            method: 'POST',
            header: { "contentType": "application/json;charset=utf-8" },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: {
                loginToken: app.globalData.loginToken,
                fid: "2",
                clientType: "3",
                id: app.globalData.parameter.id,
                uname: this.data.name,
                sex: this.data.sexId,
                mobile: this.data.phoneNumber,
                // address: "",

            },
            success: e => {
                if(e.data.code == 200) {//信息修改成功
                    //修改头像
                    if(this.data.isModifyUserUrl) {
                        wx.uploadFile({
                            url: app.globalData.host + "/ArdUserInfo/setUserInfoPhotowx",
                            filePath: this.data.headImage,
                            name: 'file',
                            header: { "contentType": "multipart/form-data" },
                            formData: {
                                loginToken: app.globalData.loginToken,
                                id: app.globalData.parameter.id,
                            },
                            success: e => {
                                wx.hideLoading();
                                var data = JSON.parse(e.data);
                                if (data.code == 200) {//头像修改成功
                                    wx.showModal({
                                        title: '提示',
                                        content: '修改成功！',
                                        showCancel: false,
                                        confirmColor: '#0783e8',
                                        success: e => {
                                            var userInfo = app.globalData.parameter;
                                            userInfo.userUrl = data.parameter;

                                            userInfo.uname = this.data.name;
                                            userInfo.sex = this.data.sexId;
                                            userInfo.mobile = this.data.phoneNumber;

                                            app.globalData.parameter = userInfo;
                                            wx.setStorageSync("parameter", userInfo);

                                            var pages = getCurrentPages();
                                            var page = pages[pages.length - 2];
                                            page.setData({
                                                pageFrom: "reviseInfo"
                                            });
                                            wx.navigateBack({
                                                delta: 1,
                                            });
                                        }
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
                                                    url: '../../login/login'
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    wx.showToast({
                                        title: '系统正在更新，暂停服务！',
                                        icon: 'none'
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
                    }else {
                        wx.hideLoading();
                        wx.showModal({
                            title: '提示',
                            content: '修改成功！',
                            showCancel: false,
                            confirmColor: '#0783e8',
                            success: e => {
                                wx.hideLoading();
                                var userInfo = app.globalData.parameter;
                                userInfo.uname = this.data.name;
                                userInfo.sex = this.data.sexId;
                                userInfo.mobile = this.data.phoneNumber;

                                app.globalData.parameter = userInfo;
                                wx.setStorageSync("parameter", userInfo);

                                var pages = getCurrentPages();
                                var page = pages[pages.length - 2];
                                page.setData({
                                    pageFrom: "reviseInfo"
                                });
                                wx.navigateBack({
                                    delta: 1,
                                });
                            }
                        })
                    }
                    
                } else if (e.data.code == 888) {
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
    },
    onErrorHeadImage: function(e) {
        this.setData({
            headImage: "../../../images/user_img_default.png"
        });
    }
})