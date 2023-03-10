// pages/me/me.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      pageFrom: null,
      headImage: "../../images/user_img_default.png",
      isLogin: false,
      userData: null,
      appFile: "",
      useCarData: {
          orderCount: 0,
          orderCount: 0,
          toMileages: 0
      },
      isShowStr: false,
      feedbackCount: 0,//反馈回复条数
      isShowDownCode: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var userUrl = app.globalData.parameter.userUrl;
      if (userUrl == "") {
          userUrl = this.data.headImage
      } else {
          userUrl = app.globalData.host + "/" + userUrl;
      }

      //获取总路程信息
      wx.request({
          url: app.globalData.host + '/cordController/getordermileages',
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
                  var useCarData = e.data.parameter;
                  if (useCarData.orderCount == null) {
                      useCarData.orderCount = 0;
                  }
                  if (useCarData.toMileages == null) {
                      useCarData.toMileages = 0;
                  }
                  useCarData.toMileages = useCarData.toMileages.toFixed(2);
                  if (useCarData.cylinder == null) {
                      useCarData.cylinder = 0;
                  }
                  useCarData.cylinder = useCarData.cylinder.toFixed(2);
                  
                  var isShowStr = false;
                  if (useCarData.toMileages > 4000) {
                      isShowStr = true;
                  }
                  
                  this.setData({
                      useCarData: useCarData,
                      isShowStr: isShowStr,
                  });
              }
          }
      });


      //获取反馈信息未读条数
      wx.request({
              url: app.globalData.host + '/ArdUserInfo/selectAppFeedCount',
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
                          feedbackCount: parseInt(e.data.parameter)
                      });
                  }
              }
          });

      this.setData({
          userData: app.globalData.parameter,
          headImage: userUrl
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
      this.setData({
          isLogin: app.globalData.isLogin
      });
      if (this.data.pageFrom == "reviseInfo" || this.data.pageFrom == 1 || app.globalData.isSwitchAccount[3]) {
          if(app.globalData.isLogin) {
              app.globalData.isSwitchAccount[3] = false;
          }
          //设置头像渲染数据
          this.onLoad();
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
  goToLogin: function(e) {
      wx.navigateTo({
          url: '/pages/login/login?path=me'
      });
  },
  reviseInfo: function(e) {
      wx.navigateTo({
          url: './reviseInfo/reviseInfo?pageFrom=me'
      });
  },
  postOrder: function(e) {
      if(app.globalData.isLogin) {
          wx.navigateTo({
              url: './usuallyAddress/usuallyAddress'
          });
      }else {
          wx.navigateTo({
              url: '/pages/login/login?path=me'
          });
      }
  },
  downApp: function(e) {   
      this.setData({
          isShowDownCode: true
      });
  },
  gotoWebsite: function(e) {
      wx.navigateTo({
          url: './officialWebsite/officialWebsite'
      });
  },
  callTel: function(e) {
      var tel = e.currentTarget.dataset.tel;
      wx.makePhoneCall({
          phoneNumber: tel
      });
  },
  moreSetting: function(e) {
      wx.navigateTo({
          url: '../moreSettings/moreSettings?feedbackCount='+this.data.feedbackCount,
      })
  },
  //图片发生错误是执行
  onErrorHeadImage: function(e) {
      this.setData({
          headImage: "../../images/user_img_default.png"
      });
  },
  //保存二维码
  saveDownCode: function(e) {
      wx:wx.saveImageToPhotosAlbum({
          filePath: '/images/qrcode_customer_app.png',
          success: e => {
              wx.showToast({
                  title: '保存成功！',
                  icon: 'none',
                  success: e => {
                      this.setData({
                          isShowDownCode: false
                      });
                  }
              });
          },
          fail: e => {
              wx.showToast({
                  title: '保存失败！',
                  icon: 'none',
                  success: e=> {
                      this.setData({
                          isShowDownCode: false
                      });
                  }
              });
          }
      });
  },
  downCodeCancle: function(e) {
      this.setData({
          isShowDownCode: false
      });
  }
})