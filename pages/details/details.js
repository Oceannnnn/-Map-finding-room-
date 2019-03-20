// pages/details/details.js
const util = require('../../utils/util.js')
const main = require('../../libs/main.js')
const app = getApp()
Page({
  data: {
    recommendList: [],
    pageNumber: 1,
    onBottom: true
  },
  onLoad: function (options) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; //上一个页面
    this.init(options);
    this.setData({
      id:options.id,
      type:options.type
    })
    prevPage.setData({
      selectionType: 1
    })
  },
  onReachBottom: function () {
    var pageNumber = this.data.pageNumber + 1;
    this.setData({
      pageNumber: pageNumber
    })
    if (this.data.onBottom) {
      this.recommendList(this.data.id, this.data.type, this.data.pageNumber)
    }
  },
  roomDetails(e) {
    main.toDetails(e, "roomDetails")
  },
  villageDetails(e){
    main.toDetails(e, "villageDetails")
  },
  init(options) {
    let type = options.type;
    let id = options.id; 
    this.recommendList(id, type,1)
  },
  recommendList(id,type,page) {
    var list = this.data.recommendList;
    util.http("Region/getHouse", { village_id: id, type: type, page_size: 10, page_current: page, longitude: '', latitude:''}, 'post').then(res => {
      if (res.code == 200) {
        for (let item of res.data.list) {
          list.push(item)
        }
        this.setData({
          recommendList: list,
          village: res.data.village
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
  }
})