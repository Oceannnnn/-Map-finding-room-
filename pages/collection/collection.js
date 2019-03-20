const util = require('../../utils/util.js')
const main = require('../../libs/main.js')
const app = getApp()
Page({
  data: {
    pageNumber: 1,
    onBottom: true,
    tab: [{ title: '二手房' }, { title: '租房' }],
    hoverIndex: 1, 
    type:1
  },
  onLoad: function (options) {
    this.list(1, 1)
  },
  tabClick: function (e) {
    let hoverIndex = e.target.dataset.num + 1;
    this.setData({
      hoverIndex: hoverIndex,
      onBottom: true,
      pageNumber: 1,
      list: [],
      type: hoverIndex
    })
    this.list(this.data.pageNumber, hoverIndex)
  },
  toDetails(e) {
    main.toDetails(e, "details")
  },
  onReachBottom: function () {
    var pageNumber = this.data.pageNumber + 1;
    this.setData({
      pageNumber: pageNumber
    })
    if (this.data.onBottom) {
      this.list(this.data.pageNumber, this.data.hoverIndex);
    }
  },
  list(page, type) {
    wx.showLoading({
      title: '加载中'
    });
    var list = this.data.list;
    var json = {
      page_size: 10,
      page_current: page,
      user_id: app.globalData.user_id,
      type: type
    }
    util.http('My/getMyCollect', json, 'post').then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          list.push(item)
        }
        this.setData({
          list: list
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
    wx.hideLoading()
  },
  roomDetails(e) {
    main.toDetails(e, "roomDetails")
  }
})