//app.js
App({
  onLaunch: function () {
    var parameter = wx.getStorageSync("parameter");
    if(parameter) {
        if(parameter.loginToken != "") {
            this.globalData.isLogin = true;
            this.globalData.loginToken = parameter.loginToken;
            this.globalData.parameter = parameter;
        }
    }
    //获取车型
    this.getCarType();
    
  },
  globalData: {
    userInfo: null,
    key: "eVmsgZZ8UL1dIWKjumSjfdGzxSvTfm0i",
    isLogin: false,
    loginToken: "",
    parameter: "",
    carType: [],
    host: "http://192.168.0.118:8080",
    //费用
    addPlatePrice: 10,//尾板费
    addWidthPrice: 10,//加宽费
    feedbackCount: 0,//反馈回复条数
    isSwitchAccount: [false,false,false,false]//是否切换账号
  },
  checkPhoneNumber: function(e) {
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
      }else {
          return true;
      }
  },
  checkVerification: function(e) {
    var verification = e;
    if (verification.length == 0) {
        wx.showToast({
            title: '请输入验证码',
            icon: 'none'
        })
        return false;
    } else if (verification.length != 6) {
        wx.showToast({
            title: '请输入六位验证码',
            icon: 'none'
        })
        return false;
    }else {
        return true;
    }
  },
  //获取车型函数
  getCarType: function(e) {
      //获取车型
      wx.request({
          url: this.globalData.host + '/ArdBaseCar/getCarTypewx',
          method: 'POST',
          header: { "contentType": "application/json;charset=utf-8" },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          data: {
              clientType: "3",
              filiale: "2"
          },
          success: e => {
              if (e.data.code == 200) {
                  var carType = e.data.parameter;
                  for (let i = 0; i < carType.length; i++) {
                      carType[i].carImg = this.globalData.host + carType[i].carImg;
                      carType[i].isAddWidth =  carType[i].truckName.indexOf("4.2")==-1?0:1;
                  }
                  this.globalData.carType = carType;
              }
          },
          fail: e => {
              wx.showToast({
                  title: '无法连接到服务器！连接网络后重新进入小程序！',
                  icon: 'none'
              });
          }
      });
  },
  //替换emoj表情
    filterEmoji: function (filterString) {
        var str = filterString.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");
        return str;
    }
})