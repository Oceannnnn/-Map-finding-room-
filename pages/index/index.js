const app = getApp()
const util = require('../../utils/util.js');
const main = require('../../libs/main.js'); 
Page({
  data:{
    value:'',
    hidden:false,
    swiper_item:[{}],
    hoverIndex:0,
    current:1,
    answer_data:[]
  },
  onLoad: function (){
    this.setData({
      state: app.globalData.state
    })
    if (this.data.state == 1) {
      this.init()
    }else{
      main.goLogin()
    }
  },
  init(){
    let swiper_item = this.data.swiper_item;
    util.http('question/index', {}, 'get').then(res => {
      if (res.code == 200) {
        for (let i in res.data) {
          swiper_item.push(res.data[i])
        }
        this.setData({
          swiper_item: swiper_item
        })
      }
    })
    this.setData({
      value: '',
      hidden: false,
      current: 0,
    })
  },
  onReady: function () {
    var circleCount = 0;
    this.animationMiddleHeaderItem = wx.createAnimation({
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) {
      }
    });
    setInterval(function () {
      if (circleCount % 2 == 0) {
        this.animationMiddleHeaderItem.scale(1.15).step();
      } else {
        this.animationMiddleHeaderItem.scale(1.0).step();
      }

      this.setData({
        animationMiddleHeaderItem: this.animationMiddleHeaderItem.export()
      });
      circleCount++;
      if (circleCount == 500) {
        circleCount = 0;
      }
    }.bind(this), 500);
  },
  go() {
    if (this.data.state == 1) {
      let current = this.data.current;
      this.setData({
        current: current + 1,
        hoverIndex: 1
      })
    } else {
      main.goLogin()
    }
  },
  again() {
    this.setData({
      value: '',
      hidden: false,
      swiper_item: [{}],
      hoverIndex: 0,
      current: 1,
      answer_data: []
    })
    this.init()
  },
  result(e){
    this.setData({
      hidden:!this.data.hidden
    })
    this.next(e);
    let answer = JSON.stringify(this.data.answer_data)
    util.http('Template/yourImage', { user_id: app.globalData.user_id, answer: answer}, 'post').then(res => {
      if (res.code == 0) {
        this.setData({
          image:res.data
        })
      }
    })
  },
  next(e){
    let data = this.data.answer_data;
    let answer = {};
    let current = this.data.current;
    let value = this.data.value;
    if (value != '') {
      this.setData({
        current: current + 1,
        value: value,
        value: '',
        hoverIndex: this.data.hoverIndex + 1
      })
    }else{
      wx.showToast({
        title: '请选择答案！',
        icon: 'none',
        duration: 1000
      })
    }
    answer['id'] = e.currentTarget.dataset.text_id;
    answer['answer'] = e.currentTarget.dataset.id;
    data.push(answer);
    this.setData({
      answer_data:data
    })
  },
  radioChange(e){
    this.setData({
      value: e.detail.value
    })
  },
  checkboxChange(e){
    this.setData({
      value: e.detail.value
    })
  },
  preservation(){
    var that = this;
    wx.downloadFile({
      url: that.data.image,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
            })
          },
          fail: function (res) {
            wx.showToast({
              icon: 'none',
              title: '保存失败！',
            })
          }
        })
      },
      fail: function () {
        wx.showToast({
          icon:'none',
          title: '保存失败！',
        })
      }
    })
  },
})