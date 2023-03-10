//index.js
//获取应用实例
const app = getApp();
const key = app.globalData.key;
var bmapFile = require('../../libs/bmap-wx.min.js');
var myMap = new bmapFile.BMapWX({ "ak": key });

Page({
  data: {
      pageFrom: null,
      isLogin: false,
      loginToken:"",
      left: "0px",
      navLeft: "0",
      navbarActive: ["active"],
      selectCarId: 0,
      carType:[],
      carModelWidth: "610rpx",
      isGetContact: false,
      addressArray: [],
      showTip: false,
      positionStart: {
          isGetPosition: false,
          name: "",
          address: "",
          district: "",
          houseNumber: "",
          person: "",
          phoneNumber: "",
          location: {
              latitude:"",
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
      picker: [],
      selectPicker: [],
      nowTime: [],
      goTime: [],
      selectDayId: "",
      maxDay: "",
      pageX: null,
      priceStr: ""
  },
  //事件处理函数
  onShareAppMessage: function(e) {
        return {
            title: '科风速运小程序',
            path: '/pages/home/home'
        }
  },
  onLoad: function(e) {
      var length = app.globalData.carType.length;
      var width = length * 610;
      width = width+"rpx";
      this.setData({
          carType: app.globalData.carType,
          carModelWidth: width,
      });

      //获取位置
      this.getMyLocation();
      //获取上次地址
      var indexPositionPassby = wx.getStorageSync("indexPositionPassby");
      var indexPositionEnd = wx.getStorageSync("indexPositionEnd");

      if(indexPositionPassby != "") {
          this.setData({
              addressArray: indexPositionPassby,
              positionEnd: indexPositionEnd
          });
      }
      if (indexPositionEnd != "") {
          this.setData({
              addressArray: indexPositionPassby,
              positionEnd: indexPositionEnd
          });
      }
      //时间选择框数据初始化

      //求现在时间
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth();
      var today = date.getDate();
      var hours = date.getHours();
      var minutes = date.getMinutes();

      month += 1;
      var nowTime = [year, month, today, hours, minutes];

      //求每月最大天数
      var maxDay;
      if (month == 2) {
          maxDay = "28";
      } else if (month == 4 || month == 6 || month == 9 || month == 11) {
          maxDay = "30";
      } else {
          maxDay = "31"
      }

      //求选择器显示时间
      var pickerDay = ["今天", "明天", "后天"];
      var pickerHours = [];
      var pickerMinutes = [];

      for (var i = 0; i <= 23; i++) {
          pickerHours.push(i);
      }
      pickerMinutes.push("00");
      for (var i = 1; i <= 59; i++) {
          if (i.toString().length == 1) {
              pickerMinutes.push("0" + i)
          } else {
              pickerMinutes.push(i);
          }
      }

      var picker = [pickerDay, pickerHours, pickerMinutes];

      //选择器选中时间
      var selectDay = 0;
      var selectHours = hours;
      var selectMinutes = minutes;

      selectMinutes += 30;

      if (selectMinutes > 59) {
          selectMinutes = selectMinutes - 60;
          selectHours += 1;
          if (selectHours > 23) {
              selectHours = selectHours - 24;
              selectDay += 1;
          }
      }
      var selectPicker = [selectDay, selectHours, selectMinutes]

      //设置数据
      this.setData({
          picker: picker,
          selectPicker: selectPicker,
          nowTime: nowTime,
          maxDay: maxDay
      });
  },
  onReady: function(e) {
      
  },
  onShow: function(e) {
      if(this.data.pageFrom == 1 || app.globalData.isSwitchAccount[0]) {
          if(app.globalData.isLogin) {
              app.globalData.isSwitchAccount[0] = false;
          }

          this.setData({
              isLogin: app.globalData.isLogin,
          });
      }

      //填写地址计算预算
      if (this.data.pageFrom == "map") {
          this.budgetPrice(this.data.selectCarId);
      }

      //如果没有车型，重新请求
      if (this.data.carType == "") {
          this.getCarType();
      }

      //登录或注销刷新数据
      if(app.globalData.isLogin != this.data.isLogin) {
          this.freshContact();
      }

      if(this.data.positionStart.person != app.globalData.parameter.uname) {
          this.freshContact();
      }
      
  },
  selectActive: function(e) {
      //选择车型
      var id = e.currentTarget.id;
      var navbarActive = [];
      navbarActive[id] = "active";

      var left = id * -610;
      left = left + "rpx";

      this.setData({
          left: left,
          selectCarId: id,
          navbarActive: navbarActive,
      });
      //预算价格
      this.budgetPrice(id);

  },
  prev: function(e) {
      var selectCarId = this.data.selectCarId;

      var left = parseInt(this.data.left);
      if (left < 0) {
          left =  left + 610;
          left = left + "rpx";
          selectCarId--;
      }else {
          left = "0rpx";
      }

      //导航栏文字
      var navLeft = this.data.navLeft;
      if(navLeft < 0) {
          if(selectCarId < this.data.carType.length -3) {
              navLeft = navLeft + 187.5;
          }
      }else {
          navLeft = 0;
      }


      var navbarActive = [];
      navbarActive[selectCarId] = "active";
      this.setData({
          left: left,
          selectCarId: selectCarId,
          navbarActive: navbarActive,
          navLeft: navLeft
      });
      //预算价格
      this.budgetPrice(selectCarId);
  },
  more: function(e) {

      var selectCarId = this.data.selectCarId;
      
      var left = parseInt(this.data.left);
      var width = parseInt(this.data.carModelWidth);

      var maxLeft = -(width-610);

      if(left>maxLeft) {
          left = left - 610;
          left = left + "rpx";
          selectCarId++;
      }else {
          left = maxLeft + "rpx";
      }

      //导航栏文字
      var navLeft = parseFloat(this.data.navLeft);
      var maxNavLeft = -((parseFloat(this.data.carType.length) * 187.5) - 750);
      
    
      if(navLeft > maxNavLeft) {
          if(selectCarId > 2) {
              navLeft = navLeft - 187.5;
          }
      }else {
          navLeft = maxNavLeft;
      }

      var navbarActive = [];
      navbarActive[selectCarId] = "active";
      
      this.setData({
          left: left,
          selectCarId: selectCarId,
          navbarActive: navbarActive,
          navLeft: navLeft
      });
      //预算价格
      this.budgetPrice(selectCarId);
  },
  moveNav: function(e) {
      var lastPageX = this.data.pageX
      var currentPageX = e.touches[0].pageX

      if(lastPageX == null) {
          this.setData({
              pageX: currentPageX
          });
      }else {
          var direction = currentPageX - lastPageX;
          var maxNavLeft = -((parseFloat(this.data.carType.length) * 187.5) - 750)
          var left = parseInt(this.data.navLeft) + direction*2;
          if(left>0) {
              left = 0;
          }else if(left < maxNavLeft) {
              left = maxNavLeft
          }
          this.setData({
              navLeft: left,
              pageX: currentPageX
          });
      }

  },
  moveNavEnd: function(e) {
      this.setData({
          pageX: null
      });
  },
  addAddress: function(e) {
      var addressArray = this.data.addressArray;
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
      this.showTip();
  },
  removeAddress: function(e) {
      var id = e.currentTarget.dataset.bindex;
      var addressArray = this.data.addressArray;
      addressArray.splice(id,1);
      this.setData({
          addressArray: addressArray
      })
      this.showTip();
      //重新计算预算
      this.budgetPrice(this.data.selectCarId);
  },
  showTip: function(e) {
      var addressArray = this.data.addressArray;
      if(addressArray.length == 0) {
          this.setData({
              showTip: false
          })
      }else {
          this.setData({
              showTip: true
          })
      }
  },
  //获取起始位置
  getStartPosition: function(e) {
      wx.getSetting({
          success: res => {
              if (!res.authSetting['scope.userLocation']) {
                  wx.showModal({
                      title: '提示',
                      content: '请打开“使用我的地理位置”权限',
                      showCancel: false,
                      confirmColor: '#0783e8',
                      success: function(e) {
                          wx.openSetting();
                      }
                  })
              }else {
                  var nameStart = this.data.positionStart.name;
                  var addressStart = this.data.positionStart.address;
                  var districtStart = this.data.positionStart.district;
                  var houseNumberStart = this.data.positionStart.houseNumber;
                  var personStart = this.data.positionStart.person;
                  var phoneNumberStart = this.data.positionStart.phoneNumber;
                  var latitudeStart = this.data.positionStart.location.latitude;
                  var longitudeStart = this.data.positionStart.location.longitude;
                  wx.navigateTo({
                      url: '../map/map?type=start' + '&name=' + nameStart + '&address=' + addressStart + '&district=' + districtStart + '&icon=1' + '&houseNumber=' + houseNumberStart + '&person=' + personStart + '&phoneNumber=' + phoneNumberStart + "&latitude=" + latitudeStart + "&longitude=" + longitudeStart
                  });
              }
          }
      });
  },
  //获取终点位置
  getEndPosition: function(e) {
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
                      url: '../map/map?type=end' + '&name=' + nameEnd + '&address=' + addressEnd + '&district=' + districtEnd + '&icon=3' + '&houseNumber=' + houseNumberEnd + '&person=' + personEnd + '&phoneNumber=' + phoneNumberEnd + "&latitude=" + latitudeEnd + "&longitude=" + longitudeEnd
                  });
              }
          }
      });
  },
  //获取途径位置
  getPosition: function(e) {
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
                      url: '../map/map?type=passby' + '&name=' + name + '&address=' + address + '&district=' + district + '&icon=2' + '&houseNumber=' + houseNumber + '&person=' + person + '&phoneNumber=' + phoneNumber + "&latitude=" + latitude + "&longitude=" + longitude + "&id=" + id
                  });
              }
          }
      });
  },
  //地址交换
  exchange: function(e) {
      var id = e.currentTarget.id;
      var data = this.data.addressArray;
      var length = data.length;
      if(id < length-1) {
          var temp = data[id];
          var nextId = parseInt(id) + 1;
          data[id] = data[nextId];
          data[nextId] = temp;
          this.setData({
              addressArray: data
          })
      }else if(id == length-1) {
          if(this.data.positionEnd.isGetPosition == false) {
              wx.showToast({
                  title: '输入地址不完整',
                  icon: 'none'
              })
          }else {
              var temp = data[id];
              data[id] =  this.data.positionEnd;
              this.setData({
                  positionEnd: temp,
                  addressArray: data
              })
          }
      }
      
  },
    changePicker: function(e) {
        //求现在时间
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var today = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();

        month += 1;
        var nowTime = [year, month, today, hours, minutes];

        //求每月最大天数
        var maxDay;
        if (month == 2) {
            maxDay = "28";
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
            maxDay = "30";
        } else {
            maxDay = "31"
        }


        //获取选择时间
        var selectYear = nowTime[0]
        var selectMonth = nowTime[1]
        var selectDay = nowTime[2];

        var addDays = e.detail.value[0];
        var selectHours = e.detail.value[1];
        var selectMinutes = e.detail.value[2];

        for(var i=0;i<addDays;i++) {
            if (selectDay == maxDay) {
                selectDay = 1;
                if (selectMonth == 12) {
                    selectMonth = 1;
                    selectYear++;
                }else {
                    selectMonth++;
                }
            }else {
                selectDay++;
            }
        }
        var goTime = [selectYear, selectMonth, selectDay, selectHours, selectMinutes];

        //判断时间是否错误
        var isTimeCorrect = true;
        if (addDays == 0) {
            if (goTime[3] < nowTime[3]) {
                isTimeCorrect = false;
            }else if(goTime[3] == nowTime[3]) {
                if (goTime[4] < nowTime[4]) {
                    isTimeCorrect = false;
                }
            }
        }

        if(!isTimeCorrect) {
            wx.showToast({
                title: '时间选择错误,请重新选择!',
                icon: 'none'
            });
        }else {
            this.setData({
                goTime: goTime,
                nowTime: nowTime,
                selectDayId: addDays
            });

            //判断是否登录
            if (this.data.isLogin == false) {
                wx.navigateTo({
                    url: '../login/login'
                })
            } else {
                var positionStart = this.data.positionStart;
                var positionEnd = this.data.positionEnd;
                var positionPassby = this.data.addressArray;
                var isGetContact = this.data.isGetContact;
                var positionPassbyLength = positionPassby.length

                if (isGetContact == false) {
                    wx.showToast({
                        title: '请填写联系人!',
                        icon: 'none'
                    });
                    return;
                } else if (positionStart.isGetPosition == false) {
                    wx.showToast({
                        title: '请填写起点!',
                        icon: 'none'
                    });
                    return;
                } else if (positionEnd.isGetPosition == false) {
                    wx.showToast({
                        title: '请填写终点!',
                        icon: 'none'
                    });
                    return;
                } else if (positionPassbyLength > 0) {
                    for (var i = 0; i < positionPassbyLength; i++) {
                        if (positionPassby[i].isGetPosition == false) {
                            wx.showToast({
                                title: '请填完整途径地点!',
                                icon: 'none'
                            });
                            return;
                        }
                    }
                    //保存地址
                    if (positionPassbyLength > 0) {
                        wx.setStorageSync("indexPositionPassby", positionPassby);
                    }
                    wx.setStorageSync("indexPositionEnd", positionEnd);
                    //跳转下单页面
                    wx.navigateTo({
                        url: '../confirmOrder/confirmOrder/confirmOrder?time=yuyue&selectDayId=' + this.data.selectDayId
                    });
                } else {
                    wx.navigateTo({
                        url: '../confirmOrder/confirmOrder/confirmOrder?time=yuyue&selectDayId='+this.data.selectDayId
                    });
                }
            }
        }
  },
  useCar: function(e) {
      if(this.data.isLogin == false) {
          wx.navigateTo({
              url: '../login/login'
          })
      }else {
          var positionStart = this.data.positionStart;
          var positionEnd = this.data.positionEnd;
          var positionPassby = this.data.addressArray;
          var isGetContact = this.data.isGetContact;
          var positionPassbyLength = positionPassby.length

          if(isGetContact == false) {
              wx.showToast({
                  title: '请填写联系人!',
                  icon: 'none'
              });
              return;
          } else if (positionStart.isGetPosition == false) {
              wx.showToast({
                  title: '请填写起点!',
                  icon: 'none'
              });
              return;
          }else if(positionEnd.isGetPosition == false) {
              wx.showToast({
                  title: '请填写终点!',
                  icon: 'none'
              });
              return;
          } else if(positionPassbyLength > 0) {
              for(var i=0;i<positionPassbyLength;i++) {
                  if(positionPassby[i].isGetPosition == false) {
                      wx.showToast({
                          title: '请填完整途径地点!',
                          icon: 'none'
                      });
                      return;
                  }
              }
              //保存地址
              if(positionPassbyLength>0) {
                  wx.setStorageSync("indexPositionPassby", positionPassby);
              }
              wx.setStorageSync("indexPositionEnd", positionEnd);
              //跳转下单页面
              wx.navigateTo({
                  url: '../confirmOrder/confirmOrder/confirmOrder?time=now&selectDayId=' + this.data.selectDayId
              });
          }else {
               wx.navigateTo({
                   url: '../confirmOrder/confirmOrder/confirmOrder?time=now&selectDayId='+this.data.selectDayId
               });
          }
      }
   },
  onErrorSetImage: function(e) {
      var id = e.currentTarget.id;
      var carType = this.data.carType;
      carType[id].carImg = "../../images/42xiangche.png"
      this.setData({
          carType: carType
      });
    },
    //获取车型函数
    getCarType: function (e) {
        //获取车型
        wx.request({
            url: app.globalData.host + '/ArdBaseCar/getCarTypewx',
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
                        carType[i].carImg = app.globalData.host + carType[i].carImg;
                        carType[i].isAddWidth = carType[i].truckName.indexOf("4.2") == -1 ? 0 : 1;
                    }
                    var length = carType.length;
                    var width = length * 610;
                    width = width + "rpx";
                    this.setData({
                        carType: carType,
                        carModelWidth: width,
                    });
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
    //获取位置函数
    getMyLocation: function(e) {
        //获取位置
        myMap.regeocoding({
            success: e => {
                var latitude = e.wxMarkerData[0].latitude;
                var longitude = e.wxMarkerData[0].longitude;
                var position = {
                    name: "",
                    address: "",
                    district: "",
                    houseNumber: "",
                    address: "",
                    person: "",
                    phoneNumber: "",
                    personNumber: "",
                    location: {
                        latitude: latitude,
                        longitude: longitude
                    }
                };
                position.address = e.wxMarkerData[0].address;
                position.name = e.originalData.result.business;
                position.district = e.originalData.result.addressComponent.district;
                position.isGetPosition = true;
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
                this.setData({
                    positionStart: position,
                    isGetContact: isGetContact
                });
            }
        });
    },
    //预算价格
    budgetPrice: function (selectCarId) {
        if(!this.data.positionStart.isGetPosition || !this.data.positionEnd.isGetPosition) {
            this.setData({
                priceStr: ""
            });//清除之前运算价格
            return;
        }
        var positionPassby = this.data.addressArray;
        for(var i=0;i<positionPassby.length;i++) {
            if(!positionPassby[i].isGetPosition) {
                this.setData({
                    priceStr: ""
                });//清除之前运算价格
                return;
            }
        }

        var location = this.getFormatLocations(this.data.positionStart,positionPassby,this.data.positionEnd);
        wx.request({
                url: app.globalData.host + '/ArdBaseCar/getCarTypeCostwx',
                header: { "contentType": "application/json;charset=utf-8" },
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                data: {
                    loginToken: app.globalData.loginToken,
                    carTypePk: this.data.carType[selectCarId].carTypeId,
                    fid: "2",
                    clientType: "3",
                    addressInfos: location
                },
                success: e => {
                    if (e.data.code == 200) {
                        //获取价格
                        this.setData({
                            priceStr: "预计运费:" + e.data.parameter.totalPrice
                        });
                    } else if (e.data.code == 888) {
                        this.setData({
                            priceStr: ""
                        });//清除之前运算价格
                        wx.showModal({
                            title: '提示',
                            content: '登录已过期，请重新登录！',
                            showCancel: true,
                            cancelText: '取消',
                            confirmText: '确认',
                            confirmColor: "#0783e8",
                            success: function (e) {
                                if (e.confirm) {
                                    wx.navigateTo({
                                        url: '../../login/login'
                                    });
                                }
                            }
                        });
                    }else {
                        this.setData({
                            priceStr: ""
                        });//清除之前运算价格
                        wx.showToast({
                            title: '系统正在更新，暂停服务！',
                            icon: 'none'
                        })
                    }
                },
                fail: function (e) {
                    this.setData({
                        priceStr: ""
                    });//清除之前运算价格
                    wx.showToast({
                        title: '连接服务器出错，请检查网络！',
                        icon: 'none'
                    });
                }
            });
    },
    //处理位置，转化成相应格式
    getFormatLocations: function (positionStart, positionPassby, positionEnd) {

        //加入出发地址
        var location = [];
        var locationItem = {
            lat: positionStart.location.latitude,
            lgt: positionStart.location.longitude
        }
        location.push(locationItem);

        //加入途径地址
        var positionPassbyLength = positionPassby.length;
        if (positionPassbyLength > 0) {
            for (var i = 0; i < positionPassbyLength; i++) {
                locationItem = {
                    lat: positionPassby[i].location.latitude,
                    lgt: positionPassby[i].location.longitude
                }
                location.push(locationItem);
            }
        }

        //加入终点地址
        locationItem = {
            lat: positionEnd.location.latitude,
            lgt: positionEnd.location.longitude
        }
        location.push(locationItem);

        return location;
    },
    //当切换登录状态时执行
    freshContact: function(e) {
        var position = this.data.positionStart;
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
        this.setData({
            positionStart: position,
            isGetContact: isGetContact,
            isLogin: app.globalData.isLogin
        });
    }
})