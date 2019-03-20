// pages/HousegetLocation/HousegetLocation.js
const main = require('../../libs/main.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    userLocation:false
  },
  onLoad: function (options) {
    let _this = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          _this.setData({
            userLocation:true
          })
        }
      }
    })
  },
  cancel() {
    wx.navigateBack();
  },
  userLocation() {
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        let latitude = res.latitude;
        let longitude = res.longitude;
        util.location(latitude, longitude,false);
      }
    })
  },
  confirm(e) {
    if (e.detail.authSetting["scope.userLocation"]) {
      util.location();
    }
  }
})