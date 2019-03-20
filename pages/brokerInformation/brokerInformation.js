// pages/brokerInformation/brokerInformation.js
const util = require('../../utils/util.js')
const main = require('../../libs/main.js')
const app = getApp()
Page({
  data: {
    recommendList: [],
    brokerInformation:{},
    pageNumber: 1,
    onBottom: true,
    currentId: 1
  },
  onLoad: function (options) {
    this.init(options);
  },
  init(options){
    let id = options.id;
    this.setData({
      house_id: id
    })
    let json ={
      id: id,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude
    }
    util.http('User/detail', json, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          brokerInformation: res.data,
          type: 1,
          id:id,
          HeaderList: [{
            name: "在售房源",
            id: 1
          }, {
              name: "在租房源",
              id: 2
          }]
        })
      }
    })
    this.recommendList(id,1);
  },
  onReachBottom: function () {
    let pageNumber = this.data.pageNumber + 1;
    this.setData({
      pageNumber: pageNumber
    })
    if (this.data.onBottom) {
      this.recommendList(this.data.house_id, this.data.pageNumber);
    }
  },
  contact(e) {
    let call = e.target.dataset.call;
    wx.makePhoneCall({
      phoneNumber: call
    })
  },
  roomDetails(e) {
    main.toDetails(e, "roomDetails")
  },
  recommendList(id,page) {
    let type = this.data.currentId;
    let json = {
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      page_size: 5,
      page_current: page,
      id: id,
      type: type
    }
    let list = this.data.recommendList;
    util.http("User/userHouse", json , 'post').then(res => {
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
  toList(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      currentId: id,
      recommendList: [],
      pageNumber: 1,
      onBottom: true,
      type: id
    })
    this.recommendList(this.data.house_id, this.data.pageNumber);
  },
})