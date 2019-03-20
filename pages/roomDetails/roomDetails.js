// pages/roomDetails/roomDetails.js
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
  init(options){
    this.setData({
      id:options.id,
      type: options.type
    })
    let type = options.type, detail_url = '', recommend_url = '';
    if(type == 1){
      detail_url = "House/detail";
      recommend_url = 'House/youLike'
      this.setData({
        recommend_url: recommend_url
      })
    }else{
      detail_url = "Rentout/detail";
      recommend_url = 'Rentout/youLike'
      this.setData({
        recommend_url: recommend_url
      })
    }
    this.detail(options.id, detail_url);
    this.recommendList(recommend_url,options.id,1)
  },
  detail(id, url) {
    util.http(url, { user_id: app.globalData.user_id, id: id}, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          details:res.data,
          markers: [{
            iconPath: "../../images/yuan.png",
            latitude: res.data.latitude,
            longitude: res.data.longitude,
            label: {
              x: -40,
              y: -20,
              content: res.data.catename,
              fontSize: 12,
              color: '#000',
              bgColor: "#fff",
              padding: 10,
              borderRadius: 5,
            },
            width: 10,
            height: 10
          }],
          islike: res.data.islike,
        })
        WxParse.wxParse('roomDetails', 'html', res.data.content, this, 0)
      }
    })
  },
  recommendList(url, id, page) {
    var list = this.data.recommendList;
    util.http(url, { current_id: id, page_size: 5, page_current: page }, 'post').then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          list.push(item)
        }
        this.setData({
          recommendList: list
        })
      } else {
        if (page > 1) {
          wx.showToast({
            title: '没有数据啦！',
            icon: 'none',
            duration: 2000
          })
          this.data.onBottom = false;
        }
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
  contact(e) {
    let phoneNumber = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },
  collect() {
    if (app.globalData.state == 1) {
      util.http("House/collect", { collect_id: this.data.id, user_id: app.globalData.user_id, type: this.data.type }, 'post').then(res => {
        if (res.code == 200) {
          this.setData({
            islike: true
          })
        } else {
          this.setData({
            islike: false
          })
        }
      })
    } else {
      main.goLogin()
    }
  },
  villageDetails(e){
    main.toDetails(e, "villageDetails")
  },
  warn(e){
    if (app.globalData.state!=1){
      main.goLogin()
    } else {
      main.toDetails(e, "report")
    }
  },
  mapLocation(e){
    let data = e.currentTarget.dataset;
    wx.openLocation({
      type: 'gcj02',
      name: data.name,
      address: data.address,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      scale: 28
    })
  },
  roomDetails(e) {
    main.toDetails(e, "roomDetails")
  },
  mediation(e) {
    main.toDetails(e, "brokerInformation")
  }
})