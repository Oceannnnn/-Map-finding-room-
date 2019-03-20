// pages/report/report.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    items: [],
    content:''
  },
  onLoad(op){
    this.init(op);
  },
  checkboxChange: function (e) {
    console.log(e)
    let value = e.detail.value
    if (value != '') {
      let other = this.contains(value, 5);
      this.setData({
        other: other,
        reason_id: value
      })
    }else{
      this.setData({
        other: false,
        reason_id:[]
      })
    }
  },
  contains(arr, obj) {
    var i = arr.length;
    while(i--) {
      if (parseInt(arr[i]) === obj) {
        return true;
      }
    }
    return false;  
  },
  init(op){
    util.http('Complaints/index', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          items: res.data,
          complaint_id:op.id,
          type:op.type
        })
      }
    })
  },
  bindTextAreaBlur(e){
    this.setData({
      content: e.detail.value
    })
  },
  submission(){
    var json = {
      user_id: app.globalData.user_id,
      reason_id: this.data.reason_id,
      complaint_id: this.data.complaint_id,
      type: this.data.type,
      content: this.data.content
    }
    util.http('Complaints/complaintHouse', json, 'post').then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '举报成功！',
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          wx.switchTab({
            url: '../main/main'
          })
        }, 1000)
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  }
})