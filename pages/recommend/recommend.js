// pages/recommend/recommend.js
const main = require('../../libs/main.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    recommendList:[],
    pageNumber: 1,
    onBottom: true
  },
  onLoad: function (options) {
    this.recommendList(1)
  },
  onReachBottom: function () {
    var pageNumber = this.data.pageNumber + 1;
    this.setData({
      pageNumber: pageNumber
    })
    if (this.data.onBottom) {
      this.recommendList(this.data.pageNumber)
    }
  },
  recommendList(page_current) {
    wx.showLoading({
      title: '加载中'
    });
    var list = this.data.recommendList;
    let json = {
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      page_size: 10,
      page_current: page_current
    }
    util.http('House/index', json, 'post').then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          list.push(item)
        }
        this.setData({
          recommendList: list
        })
      }else{
        wx.showToast({
          title: '没有数据啦！',
          icon: 'none',
          duration: 2000
        })
        this.data.onBottom = false;
      }
      wx.hideLoading();
    })
  },
  roomDetails(e) {
    main.toDetails(e, "roomDetails")
  }
})