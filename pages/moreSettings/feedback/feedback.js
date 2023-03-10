// pages/moreSettings/feedback/feedback.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageFrom: null,
        host: "",
        pageFrom: null,
        navActive: ["active",""],
        btnConfirmDisable: true,
        countWords: 0,
        isShowFeedback: true,
        feedbackText: "",
        images: [],
        isSuccessPost: true,
        //恢复数据
        feedbackData: [],
        feedbackCount: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.feedbackCount) {
            this.setData({
                feedbackCount: parseInt(options.feedbackCount)
            });
        }
        this.setData({
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
        if (this.data.pageFrom == 1) {
            this.setData({
                host: app.globalData.host
            });
            this.getFeedback();//获取反馈内容
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
    selectActive: function(e) {
        var id = e.currentTarget.id;
        var navActive = [];
        navActive[id] = "active";
        this.setData({
            navActive: navActive
        })
        if(id == 0) {
            this.setData({
                isShowFeedback: true
            })
        }else {
            this.setData({
                isShowFeedback: false
            });
            this.getFeedback();//获取反馈内容
            this.clearFeedbackCouont();//清除未读标记
        }
    },
    noteInfoInput: function (e) {
        if (e.detail.value.length != 0) {
            var feedbackText = e.detail.value;
            feedbackText =  app.filterEmoji(feedbackText);
            this.setData({
                btnConfirmDisable: false,
                countWords: e.detail.value.length,
                feedbackText: feedbackText
            })
        } else {
            this.setData({
                btnConfirmDisable: true,
                countWords: e.detail.value.length,
                feedbackText: e.detail.value
            })
        }
    },
    //选择图片
    chooseImages: function(e) {
        var images = this.data.images;
        var imagesLength = images.length;
        wx.chooseImage({
            count: 4-imagesLength,
            sizeType: ["compresses"],
            success: e => {
                for (var i = 0; i < e.tempFilePaths.length;i++) {
                    images.push(e.tempFilePaths[i]);
                }
                this.setData({
                    images: images
                });
            }
        })
    },
    //关闭一张图片
    closeImage: function(e) {
        var id = e.currentTarget.id;
        var images = this.data.images;
        images.splice(id,1);
        this.setData({
            images: images
        })
    },
    //预览图片
    previewImage: function(e) {
        var id = e.currentTarget.id;
        wx.previewImage({
            current: this.data.images[id],
            urls: this.data.images
        });
    },
    previewFeedbackImages: function(e) {
        var feedbackid = e.target.dataset.feedbackid;
        var imgid = e.target.dataset.imgid;
        var imagesList = this.data.feedbackData[feedbackid].imgUrl;
        for(var i=0;i<imagesList.length;i++) {
            if(imagesList[i].indexOf("http")==-1) {
                imagesList[i] = app.globalData.host + imagesList[i];               
            }
        }
        wx.previewImage({
            current: imagesList[imgid],
            urls: imagesList
        })
    },
    //提交数据
    submit: function(e) {
        wx.showLoading({
            title: '正在提交······',
            mask: true
        });
        //提交图片
        var images = this.data.images;
        //如果图片为0张，直接上传文本
        if(images.length == 0) {
            this.feedbackText();
        }

        var postImagesPath = [];
        for (var i = 0; i < images.length; i++) {
            wx.uploadFile({
                url: app.globalData.host + "/ArdUserInfo/setAppFeedwx",
                filePath: images[i],
                name: 'file',
                header: { "contentType": "multipart/form-data" },
                formData: {
                    loginToken: app.globalData.loginToken,
                    fid: "2",
                    clientType: "3",
                    userId: app.globalData.parameter.id,
                    userName: app.globalData.parameter.uname
                },
                success: e => {
                    var data = JSON.parse(e.data)
                    if (data.code == 200) {
                        postImagesPath.push(data.parameter[0]);
                        if(postImagesPath.length == images.length) {
                            this.feedbackText(postImagesPath);
                        }
                    }else if(e.data.code == 888) {
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
                fail: e => {
                    wx.showToast({
                        title: '上传图片失败！',
                        icon: 'none'
                    });
                }
            });

        }

        
    },
    getFeedback: function(e) {
        wx.request({
            url: app.globalData.host + '/ArdUserInfo/selectAppFeedList',
            header: { "contentType": "application/json;charset=utf-8" },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: {
                loginToken: app.globalData.loginToken,
                fid: "2",
                clientType: "3",
                userId: app.globalData.parameter.id
            },
            success: e => {
                if(e.data.code == 200) {
                    var feedbackData = this.setFeedbackDataTime(e.data.parameter);
                    this.setData({
                        feedbackData: feedbackData
                    });
                } else if (e.data.code == 888) {
                    wx.hideLoading();
                    wx.showModal({
                        title: '提示',
                        content: '登录已过期，请重新登录！',
                        showCancel: true,
                        confirmColor: '#0783e8',
                        cancelText: '取消',
                        confirmText: '确认',
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
                        title: '连接服务器出错，请检查网络！',
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
    //设置显示时间
    setFeedbackDataTime: function(feedbackData) {
        for(var i=0;i<feedbackData.length;i++) {
            var date = new Date(feedbackData[i].creDate);
            feedbackData[i].dateTime = date.getFullYear() + "-" + (date.getMonth() + 1) +"-" + date.getDate()+" "+date.getHours()+":"+date.getSeconds();

            var appTypeStr = "";
            switch (feedbackData[i].appType) {
                case 1:
                    appTypeStr = "客户端";
                    break;
                case 2:
                    appTypeStr = "司机端";
                    break;
                case 3:
                    appTypeStr = "小程序";
                    break;
                case 4:
                    appTypeStr = "管理端";
                    break;
                case 5:
                    appTypeStr = "公众号";
                    break;
                default:
                    appTypeStr = "未知";
            }
            feedbackData[i].appTypeStr = appTypeStr;
        }
        return feedbackData;
    },
    //提交文本反馈函数
    feedbackText: function(imagesUrlList=[]) {
        wx.request({
            url: app.globalData.host + '/ArdUserInfo/setAppFeedghwx',
            method: 'POST',
            header: { "contentType": "application/json;charset=utf-8" },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: {
                loginToken: app.globalData.loginToken,
                fid: "2",
                clientType: "3",
                appType: "3",
                userId: app.globalData.parameter.id,
                userName: app.globalData.parameter.uname,
                details: this.data.feedbackText,
                imgUrl: imagesUrlList
            },
            success: e => {
                wx.hideLoading();
                if (e.data.code == 200) {
                    wx.showToast({
                        title: '提交成功',
                        icon: 'none'
                    });
                    this.setData({
                        feedbackText: "",
                        images: []
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
    clearFeedbackCouont: function (e) {//清除反馈未读条数记录
        //获取反馈信息未读条数
        wx.request({
            url: app.globalData.host + '/ArdUserInfo/updateAppFeedwx',
            method: 'POST',
            header: { "contentType": "application/json;charset=utf-8" },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: {
                loginToken: app.globalData.loginToken,
                fid: "2",
                clientType: "3",
                userId: app.globalData.parameter.id
            },
            success: e => {
                if (e.data.code == 200) {
                    this.setData({
                        feedbackCount: 0
                    });
                    var pages = getCurrentPages();
                    var page = pages[pages.length - 2];
                    page.setData({
                        feedbackCount: 0
                    });
                    page = pages[pages.length - 3];
                    page.setData({
                        feedbackCount: 0
                    });
                }
            }
        });
    }
})