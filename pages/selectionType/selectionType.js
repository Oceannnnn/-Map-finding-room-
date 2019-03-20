// pages/selectionType/selectionType.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    checkboxList:[]
  },
  onLoad: function (options) {
    this.init(options);
  },
  init(options){
    let id = options.id == "true" ? "2":"1";
    this.setData({
      type:options.type,
      id: id,
      checkboxList: wx.getStorageSync('checkboxList')
    })
  },
  confirm(){
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; //上一个页面
    let condition = {}
    let checkboxList = this.data.checkboxList;
    for (let i = 0; i < checkboxList.length; i++) {
      let alias = checkboxList[i].alias;
      let value = checkboxList[i].value
      condition[alias] = value;
    }
    condition = JSON.stringify(condition);
    let type = this.data.id
    let json = {
      condition: condition,
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
      type: type,
      house_type:this.data.type
    }
    util.http("House/searchMap", json, 'post').then(res => {
      let listData = [], scale = 12, scale2 = 12;
      if (res.code==200){
        let listData = res.data
        if (listData != '') {
          prevPage.setData({
            listData: listData,
            selectionType: 1
          })
          let markets = prevPage.getSchoolMarkers(type);
          prevPage.setData({
            markers: [],
            markers: markets
          })
        }
        wx.navigateBack()
      } else {
        prevPage.setData({
          selectionType: 1,
          listData: [],
          markers: []
        })
        wx.showToast({
          title: '搜索到0套房源',
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      }
      wx.setStorage({
        key: "checkboxList",
        data: checkboxList
      })
    })
  },
  bindchange(e) {
    let id = e.currentTarget.dataset.id;
    let item_id = e.currentTarget.dataset.item_id;
    let value = e.detail.value;
    let checkboxList = this.data.checkboxList
    for (let i = 0; i < checkboxList.length; i++) {
      if (checkboxList[i].id == item_id) {
        for (let j = 0; j < checkboxList[i].item.length; j++) {
          if (checkboxList[i].item[j].id == id) {
            checkboxList[i].item[j].checked = true;
            checkboxList[i].value = checkboxList[i].item[j].id;
          } else {
            checkboxList[i].item[j].checked = false;
          }
        }
      }
    }
    this.setData({
      checkboxList: checkboxList
    })
  },
  cancel(){
    let checkboxList = this.data.checkboxList;
    for (let i = 0; i < checkboxList.length; i++) {
      for (let j = 0; j < checkboxList[i].item.length; j++) {
        checkboxList[i].item[j].checked = false; 
        checkboxList[i].item[0].checked = true; 
        checkboxList[i].value = 0;
      }
    }
    this.setData({
      checkboxList: checkboxList
    })
  }
})