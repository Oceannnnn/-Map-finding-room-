// pages/my/my.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    s_isUser: true,
    s_hasUserInfo: false,
    state: 0
  },
  onLoad: function () {
    this.setData({
      state: app.globalData.state
    })
    this.getUserSta(app.globalData.state);
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        s_userInfo: wx.getStorageSync('userInfo')
      })
    }
  },
  getUserInfo: function (e) {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              var encryptedData = res.encryptedData;
              var iv = res.iv
              that.httpClient(wx.getStorageSync('code'), encryptedData, iv)
            }
          })
          wx.setStorage({
            key: "userInfo",
            data: e.detail.userInfo
          })
          that.setData({
            s_userInfo: e.detail.userInfo,
            s_hasUserInfo: true
          })
        } else {
          wx.showToast({
            title: '授权才能登录哦！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  collect() {
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../collect/collect',
      })
    } else {
      wx.showToast({
        title: '请先登录！',
        icon: 'none'
      })
    }
  },
  getUserSta(state) {
    if (state == 1) {
      this.setData({
        s_hasUserInfo: true
      })
    }
  },
  httpClient(code, encryptedData, iv) {
    util.http('Login/login', {
      code: code,
      encryptedData: encryptedData,
      iv: iv
    }, 'post').then(res => {
      if (res.code == 200) {
        wx.setStorage({
          key: "httpClient",
          data: {
            session_key: res.data.session_key,
            openid: res.data.openid,
            user_id: res.data.user_id,
            state: 1
          }
        })
        app.globalData.state = 1;
        app.globalData.user_id = res.data.user_id;
        wx.reLaunch({
          url: '../index/index'
        })
      }
    })
  },
  collection() {
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../collection/collection',
      })
    } else {
      wx.showToast({
        title: '请先登录！',
        icon: 'none'
      })
    }
  },
  complaint(){
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../complaint/complaint',
      })
    } else {
      wx.showToast({
        title: '请先登录！',
        icon: 'none'
      })
    }
  }
})