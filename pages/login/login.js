// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      phone: "",
      verification: "",
      getVerification: "",
      textGetVerification: "获取验证码",
      verifacationDisableFlag: false,
      btnDisableFlag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var mobile = wx.getStorageSync("mobile");
      if(mobile != "") {
          this.setData({
              phone: mobile
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
  phoneInput: function(e) {
    this.setData({
        phone: e.detail.value
    })
  },
  verificationInpur: function(e) {
        var length = e.detail.value.length;
        if (length >= 4) {
            this.setData({
                verification: e.detail.value,
                btnDisableFlag: false
            });
        } else {
            this.setData({
                btnDisableFlag: true
            });
        }
  },
  getVerification: function(e) {
      if(!app.checkPhoneNumber(this.data.phone)){
          return;
      }

      //发送验证码请求
      var phoneNumber = this.data.phone;
      wx.request({
          url: app.globalData.host + '/ardmod/getauthcode',
          method: 'POST',
          header: {"Content-Type": "application/x-www-form-urlencoded"},
          data: {
              mobile: phoneNumber
          },
          dataType: 'json',
          responseType: 'text',
          success: e => {
              var code = e.data.code;
              var message = e.data.message;
              if(code == 200) {
                  this.setData({
                      getVerification: e.data.parameter
                  });

                  wx.showToast({
                      title: '获取验证码成功！',
                      icon: 'none'
                  });

                  //禁止短时间内再发发送请求
                  this.setData({
                      verificationDisableFlag: true,
                  });

                  var n = 60;
                  var invertal = setInterval(() => {
                      n--;
                      if (n <= 0) {
                          clearInterval(invertal);
                          this.setData({
                              verificationDisableFlag: false,
                              textGetVerification: "获取验证码"
                          })
                      } else {
                          this.setData({
                              textGetVerification: n + "秒"
                          })
                      }
                  }, 1000);
              }else {
                  wx.showToast({
                      title: message,
                      icon: 'none'
                  });
              }
          },
          fail: function(res) {
              wx.showToast({
                  title: '获取验证码失败!请检查网络！',
                  icon: 'none'
              });
          }
      });

  },
  login: function(e) {
      if (!app.checkPhoneNumber(this.data.phone)) {
          return;
      }

      if (this.data.verification != this.data.getVerification || this.data.getVerification == "") {
            wx.showToast({
                title: '验证码错误！',
                icon: 'none'
            });
          return;
      }else {
          wx.request({
              url: app.globalData.host + '/ardmod/toVerificationLoginServicewx',
              data: {
                    mobile: this.data.phone,
                    verificationCode: this.data.verification
              },
              header: {"contentType":"application/json;charset=utf-8"},
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: e => {
                  if(e.statusCode==200) {
                      if(e.data.code==200) {
                          var loginToken = e.data.parameter.loginToken;
                          app.globalData.isLogin = true;
                          app.globalData.loginToken = loginToken;
                          app.globalData.parameter = e.data.parameter;
                          wx.setStorageSync("parameter",e.data.parameter);//保留账号信息
                          wx.setStorageSync("mobile", this.data.phone);//保留电话号码
                          var pages = getCurrentPages();
                          var page = pages[pages.length - 2];
                          page.setData({
                              pageFrom: 1
                          });
                          wx.navigateBack({
                              delta: 1
                          });
                      }else {
                          wx.showToast({
                              title: '登录失败！',
                              icon: 'none'
                          });
                      }
                  }else {
                      wx.showToast({
                          title: '登录失败！',
                          icon: 'none'
                      });
                  }
                  
              },
              fail: function(e) {
                  if(e.errMsg=="request:fail") {
                      wx.showToast({
                          title: '登录失败，请检查网络！',
                          icon: 'none'
                      });
                  }else {
                      wx.showToast({
                          title: '登录失败！',
                          icon: 'none'
                      });
                    }
                }
            });
        }
    }
})