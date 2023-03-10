// pages/pay/pay.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      pageFrom: null,
      isLogin: false,
      loginToken: "",
      parameter: "",
      sortIcon: ["ic_paixu1"],
      //价钱
      payData: [],
      collectMoney: 0,
      payMoney: 0,
      totalPrice: 0,
      startTime:"",
      endTime: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          isLogin: app.globalData.isLogin,
      });

      if(app.globalData.isLogin) {
          wx.showLoading({
              title: '正在加载中······',
              mask: true
          });

          wx.request({
              url: app.globalData.host + '/cordController/getReceivablewx',
              method: 'POST',
              header: { "contentType": "application/json;charset=utf-8" },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              data: {
                  loginToken: app.globalData.loginToken,
                  fid: "2",
                  clientType: "3",
                  userId: app.globalData.parameter.id,
              },
              success: e => {
                  wx.hideLoading();
                  if (e.data.code == 200) {
                      //查询成功
                      var payData = e.data.parameter;
                      //渲染订单显示
                      payData = this.setOrderNo(payData);
                      
                      var payDataLength = 0;
                      if(payData != null) {
                          payDataLength = payData.length; 
                      }
                       
                      var collectMoney = 0;
                      var payMoney = 0;
                      for (var i = 0; i < payDataLength; i++) {
                          if (payData[i].dshk == null) {
                              payData[i].dshk = 0;
                          }
                          if (payData[i].yfhj == null) {
                              payData[i].yfhj = 0;
                          }
                          collectMoney += parseInt(payData[i].dshk);
                          payMoney += parseInt(payData[i].yfhj);
                      }
                      var totalPrice = collectMoney - payMoney;

                      
                      var startTime = "";
                      var endTime = "";
                      if (payDataLength>0) {//订单条数大于1时
                          //排序并保存
                          this.sortDate(payData);
                          startTime = this.setTime(this.data.payData[this.data.payData.length - 1].finDate);
                          endTime = this.setTime(this.data.payData[0].finDate);
                      }else {
                          //去掉原来的数据
                          this.setData({
                              payData: []
                          });
                      }
                      
                      this.setData({
                          collectMoney: collectMoney,
                          payMoney: payMoney,
                          totalPrice: totalPrice,
                          startTime: startTime,
                          endTime: endTime
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
                                      url: '../login/login'
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
      if(this.data.pageFrom == 1 || app.globalData.isSwitchAccount[2]) {
          if(app.globalData.isLogin) {
              app.globalData.isSwitchAccount[2] = false;
          }
          this.onLoad();
      }else {
          this.setData({
              isLogin: app.globalData.isLogin,
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
      this.onLoad();
      wx.stopPullDownRefresh();

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
  goToLogin: function (e) {
      wx.navigateTo({
          url: '/pages/login/login?path=pay'
      })
  },
  orderScreening:function(e) {
      wx.navigateTo({
          url: './orderScreening/orderScreening'
      })
  },
  //查看详情
  payDetail: function(e) {
      wx.navigateTo({
          url: './payDetail/payDetail?id=' + e.currentTarget.id
      })

  },
  selectSort: function(e) {
      var id = e.currentTarget.id;
      var sortIcon = [];
      sortIcon[id] = "ic_paixu1";
      if(id == 0) {
          this.sortDate(this.data.payData);
      }else if(id == 1) {
          this.sortCellectMoney(this.data.payData);
      }else {
          this.sortPayMoney(this.data.payData);
      }
      this.setData({
          sortIcon: sortIcon
      });
  },
  //排序
  //按时间排序
  sortDate: function(payData) {
      var length = payData.length;
      if(length>1) {
          var index,temp;
          for(var i=0;i<length-1;i++) {
              index = i;
              for(var j=i+1;j<length;j++) {
                  if (payData[index].finDate<payData[j].finDate) {
                      index = j;
                  }
              }
              temp = payData[i];
              payData[i] = payData[index];
              payData[index] = temp;
          }
      }
      this.setData({
          payData: payData
      });
  },
  //按待收款排序
    sortCellectMoney: function (payData) {
        var length = payData.length;
        if (length > 1) {
            var index, temp;
            for (var i = 0; i < length - 1; i++) {
                index = i;
                for (var j = i + 1; j < length; j++) {
                    if (payData[index].dshk < payData[j].dshk) {
                        index = j;
                    }
                }
                temp = payData[i];
                payData[i] = payData[index];
                payData[index] = temp;
            }
        }
        this.setData({
            payData: payData
        });
    },
    //按待支出排序
    sortPayMoney: function (payData) {
        var length = payData.length;
        if (length > 1) {
            var index, temp;
            for (var i = 0; i < length - 1; i++) {
                index = i;
                for (var j = i + 1; j < length; j++) {
                    if (payData[index].yfhj < payData[j].yfhj) {
                        index = j;
                    }
                }
                temp = payData[i];
                payData[i] = payData[index];
                payData[index] = temp;
            }
        }
        this.setData({
            payData: payData
        });
    },
    //订单号显示渲染
    setOrderNo: function(payData) {
        if(payData!=null) {
            for (var i = 0; i < payData.length; i++) {
                payData[i].orderNoLeft = payData[i].orderNo.substr(0, 8);
                payData[i].orderNoRight = payData[i].orderNo.substr(8);
            }
        }
        return payData;
    },
    //时间显示渲染
    setTime(timeStamp) {
        var date = new Date(timeStamp);
        var str = date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate();
        return str;
    }
})