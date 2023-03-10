// pages/order/order.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      pageFrom: 0,
      isLogin:false,
      loginToken: "",
      navbarActive: ["active"],
      //状态
      //订单数据
      orderData: [],
      orderStatus: 1,
      pageIndex: 0,
      pageSize: 6,
      endPageSize: 0,

      isShowLoading: false
      
  },
  //根据状态码获取状态提示(状态码，是否取消，评价是否)
    getorderStatusNmae: function (status, delStatus, appraise) {
      var orderString = "";
      if(delStatus == 1) {
          orderString = "已取消"
      }else {
          if (appraise == 0 && status == 200){
             orderString = "未评价"
          } else if (appraise == 1 && status == 200) {
                orderString = "已评价"
          }else {
              switch (status) {
                  case 100:
                      orderString = "等待配送";
                      break;
                  case 110:
                      orderString = "等待配送";
                      break;
                  case 111:
                      orderString = "等待配送";
                      break;
                  case 112:
                      orderString = "等待配送";
                      break;
                  case 130:
                      orderString = "等待配送";
                      break;
                  case 131:
                      orderString = "等待配送";
                      break;
                  case 132:
                      orderString = "等待配送";
                      break;
                  case 150:
                      orderString = "配送中";
                      break;
                  case 200:
                      orderString = "订单已完成";
                      break;
                  default:
                      orderString = "未获取订单信息";
              }
          }
          
      }
      return orderString;
  },
  //时间显示格式标准化函数
  
  //更具时间戳获取显示时间
  getDateName: function(e) {
      var date = new Date(e);
      var dateString = "";
      var month = parseInt(date.getMonth()) + 1;
      var days = date.getDate();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      if(hours < 10) {
          hours = "0" + hours;
      }
      if(minutes < 10) {
          minutes = "0" + minutes;
      }
      dateString = month + "月" + days + "日 " + hours + ":" + minutes;
      return dateString;
  },
  //请求函数
  //e==0重新获取，e==1追加获取
  getOrder: function(requestType) {
      wx.showLoading({
          title: '正在加载中······',
          mask: true
      });


      var pageIndex = 0;
      if (requestType == 1) {
          pageIndex = this.data.pageIndex;
      }

      wx.request({
          url: app.globalData.host + '/ardOrd/getOrderLsitBystatwx',
          header: { "contentType": "application/json;charset=utf-8" },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          data: {
              loginToken: app.globalData.loginToken,
              ordStatus: this.data.orderStatus,
              fid: "2",
              clientType: "3",
              creator: app.globalData.parameter.uid,
              mobile: app.globalData.parameter.mobile,
              pageIndex: pageIndex,
              pageSize: this.data.pageSize
          },
          success: e => {
              //加载完之后
              this.setData({
                  isShowLoading: false
              });

              wx.hideLoading();
              if (e.data.code == 200) {
                  //判断是追加还是重新获取
                  var orderData = [];
                  if (requestType == 1) {
                      orderData = this.data.orderData;
                  }

                  //加入数据
                  var orderDataItem = e.data.parameter;
                  for(var i=0;i<orderDataItem.length;i++) {
                      //时间 
                      orderDataItem[i].createDateName = this.getDateName(orderDataItem[i].createDat);
                      //状态
                      //三参数（订单状态码，订单取消标记,订单是否评价标记）
                      orderDataItem[i].ordStatusName = this.getorderStatusNmae(orderDataItem[i].ordStatus, orderDataItem[i].deleted,orderDataItem[i].appraise);
                      orderData.push(orderDataItem[i]);
                  }

                  this.setData({
                      orderData: orderData,
                      endPageSize: orderDataItem.length
                  });
              } else if (e.data.code == 888) {
                  wx.showModal({
                      title: '提示',
                      content: '身份验证已过期，请重新登录！',
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
              }else {
                  wx.showToast({
                      title: '系统正在更新中，暂停服务。',
                      icon: 'none'
                  })
              }
          },
          fail: function (e) {
              //加载完之后
              this.setData({
                  isShowLoading: false
              });
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
      if(app.globalData.isLogin) {
          this.getOrder(0);
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
      if(this.data.pageFrom == 1 || app.globalData.isSwitchAccount[1]) {
          if(app.globalData.isLogin) {
              app.globalData.isSwitchAccount[1] = false;
          }
          this.onLoad();
      } else if (this.data.pageFrom == "evaluate") {
          this.getOrder(0);
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      //获取页面
      if(this.data.endPageSize >= this.data.pageSize) {
          this.setData({
              isShowLoading: true
          });
          var id = parseInt(this.data.orderStatus) - 1;
          var pageIndex = this.data.pageIndex;
          pageIndex += 1;
          this.setData({
              pageIndex: pageIndex
          });
          //获取数据
          this.getOrder(1);
      }else {
          wx.showToast({
              title: '已加载全部数据',
              icon: 'none'
          });
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goToLogin: function(e) {
      wx.navigateTo({
          url: '/pages/login/login?path=orderId='
      })
  },
  goLogistics: function(e) {
      var orderId = e.currentTarget.id;
      wx.navigateTo({
          url: './orderDetail/orderDetail?orderId=' + orderId + '&type=0'
      });
  },
  goDetail: function(e)  {
      var orderId = e.currentTarget.id;
      wx.navigateTo({
          url: './orderDetail/orderDetail?orderId=' + orderId + '&type=1'
      });
  },
  goEvaluate: function(e) {
      var orderId = e.currentTarget.id;
      wx.navigateTo({
          url: './evaluate/evaluate?orderId=' + orderId
      });
  },
  selectActive:function(e) {
     var id = e.currentTarget.id;
     var navbarActive = [];
     navbarActive[id] = "active";
     var orderStatus = parseInt(id) + 1;
     this.setData({
         navbarActive: navbarActive,
         orderStatus: orderStatus
     });
     this.getOrder(0);
  },
  search: function(e) {
      wx.navigateTo({
          url: './orderFind/orderFind'
      })
  },
  //去找车
  goUseCar: function(e) {
      wx.switchTab({
          url: '../index/index'
      });
  }
})