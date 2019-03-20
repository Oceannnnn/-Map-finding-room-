const app = getApp()
Page({
  data: {
    name: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: '',
    logo: '',
    domain: ''
  },
  onLoad: function () {
    this.setData({
      name: app.globalData.s_info,
      phone: app.globalData.s_phone,
      address: app.globalData.s_address,
      latitude: app.globalData.s_latitude,
      longitude: app.globalData.s_longitude,
      logo: app.globalData.s_logo,
      domain: app.globalData.s_domain
    })
  },
  toCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  toPosition: function () {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      name: this.data.address,
      scale: 15
    })
  }
})