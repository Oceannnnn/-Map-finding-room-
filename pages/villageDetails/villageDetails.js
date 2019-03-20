// pages/villageDetails/villageDetails.js
const util = require('../../utils/util.js')
const main = require('../../libs/main.js')
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({
  data: {
    recommendList: [],
    pageNumber: 1,
    onBottom: true
  },
  onLoad: function (options) {
    this.init(options);
  },
  roomDetails(e) {
    main.toDetails(e, "roomDetails")
  },
  init(options){
    this.setData({
      id: options.id,
      type: options.type
    })
    let type = options.type, recommend_url = '';
    if (type == 1) {
      recommend_url = 'House/villageHouse'
      this.setData({
        recommend_url: recommend_url
      })
    } else {
      recommend_url = 'Rentout/villageHouse'
      this.setData({
        recommend_url: recommend_url
      })
    }
    this.detail(options.id);
    this.recommendList(recommend_url, options.id, 1)
  },
  detail(id) {
    util.http("House/villageDetail", { id: id }, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          details: res.data
        })
        WxParse.wxParse('villageDetails', 'html', res.data.content, this, 0)
      }
    })
  },
  recommendList(url, id, page) {
    let list = this.data.recommendList;
    let json = { 
      cateid: id,
      page_size: 5,
      page_current: page,
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude
    }
    util.http(url, json, 'post').then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          list.push(item)
        }
        this.setData({
          recommendList: list
        })
      } else {
        wx.showToast({
          title: '没有数据啦！',
          icon: 'none',
          duration: 2000
        })
        this.data.onBottom = false;
      }
    })
  },
  onReachBottom: function () {
    var pageNumber = this.data.pageNumber + 1;
    this.setData({
      pageNumber: pageNumber
    })
    if (this.data.onBottom) {
      this.recommendList(this.data.recommend_url, this.data.id, this.data.pageNumber)
    }
  },
})