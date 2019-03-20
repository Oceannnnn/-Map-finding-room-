// pages/location/location.js
const util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    location:"未定位",
  },
  onLoad: function (options) {
    this.init()
  },
  input(e) {
    this.value = e.detail.value
  },
  searchMt() {
    if (!this.value) {
      this.value = '';
    }
    this.setData({
      value: this.value
    })
  },
  getSearchList(){
    if (wx.getStorageSync('getSearchList')) {
      this.setData({
        city: wx.getStorageSync('getSearchList')
      })
    }
  },
  init(){
    this.setData({
      location: wx.getStorageSync('myCity')
    })
    this.getSearchList();
  },
  location(){
    this.setData({
      location: wx.getStorageSync('myCity')
    })
  }
})