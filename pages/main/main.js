// pages/main/main.js
const main = require('../../libs/main.js'); 
const util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    latitude:'',
    longitude:'',
    location:"未定位",
    imgUrls:[],
    agentList:[],
    recommendList: []
  },
  onLoad: function (options) {
    this.init()
  },
  location(){
    let HousegetLocation = wx.getStorageSync('HousegetLocation');
    if (!HousegetLocation) {
      wx.navigateTo({
        url: '../HousegetLocation/HousegetLocation',
      })
    }else{
      wx.navigateTo({
        url: '../location/location',
      })
    }
  },
  brokerInformation(e){
    main.toDetails(e,"brokerInformation")
  },
  roomDetails(e) {
    main.toDetails(e, "roomDetails")
  },
  mapHouse(e){
    let HousegetLocation = wx.getStorageSync('HousegetLocation');
    if (!HousegetLocation) {
      wx.navigateTo({
        url: '../HousegetLocation/HousegetLocation',
      })
    } else {
      main.toDetails(e, "mapHouse")
    }
  },
  recommend(){
    let HousegetLocation = wx.getStorageSync('HousegetLocation');
    if (!HousegetLocation) {
      wx.navigateTo({
        url: '../HousegetLocation/HousegetLocation',
      })
    } else {
      wx.navigateTo({
        url: '../recommend/recommend',
      })
    }
  },
  HousegetLocation(){
    let _this = this; 
    let HousegetLocation = wx.getStorageSync('HousegetLocation');
    if (HousegetLocation) {
      app.globalData.city = HousegetLocation.city;
      app.globalData.longitude = HousegetLocation.longitude;
      app.globalData.latitude = HousegetLocation.latitude;
    } else {
      wx.navigateTo({
        url: '../HousegetLocation/HousegetLocation',
      })
    }
    
  },
  imgUrls() {
    util.http('Swiper/index', { }, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          imgUrls:res.data
        })
      }
    })
  },
  agentList(){
    let json = {
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude
    }
    util.http('User/index', json, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          agentList: res.data
        })
        wx.setStorage({
          key: "agentList",
          data: res.data
        })
      }
    })
  },
  recommendList() {
    let json = {
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      page_size: 5,
      page_current: 1
    }
    util.http('House/index', json, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          recommendList: res.data
        })
      }
    })
  },
  getSearchList() {
    var that = this;
    let user_id = app.globalData.user_id;
    util.http('House/getSearchList', { user_id: user_id }, 'post').then(res => {
      if (res.code == 200) {
        wx.setStorage({
          key: "getSearchList",
          data: res.data,
          success() {
            app.globalData.getSearchList = res.data;
          }
        })
      }
    })
  },
  init(){
    this.HousegetLocation();
    this.imgUrls();
    this.getSearchList();
    this.Info();
  },
  onReady: function () {
    main.userLocation();
  },
  onShow() {
    if (app.globalData.city!=''){
      this.setData({
        location: app.globalData.city,
        longitude: app.globalData.longitude,
        latitude: app.globalData.latitude,
        recommendList:[]
      })
    }
    this.recommendList();
    this.agentList();
    wx.removeStorageSync('checkboxList');
  },
  Info() {
    util.http('My/getCompanyConfig', {}, 'get').then(res => {
      if (res.code == 200) {
        app.globalData.s_phone = res.data.phone;
        app.globalData.s_email = res.data.email;
        app.globalData.s_info = res.data.name;
        app.globalData.s_address = res.data.address;
        app.globalData.s_logo = res.data.image;
        app.globalData.s_domain = res.data.domain;
        app.globalData.s_latitude = Number(res.data.latitude);
        app.globalData.s_longitude = Number(res.data.longitude);
      }
    })
  },
  userLocation(lat, lon, bool) {
    util.location(lat, lon, bool);
  },
  onShareAppMessage() {
    return {
      title: '风擎找房',
      path: '/pages/main/main'
    }
  },
})