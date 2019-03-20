//app.js
App({
  onLaunch: function () {
    // wx.clearStorage()
    wx.login({
      success: res => {
        var code = res.code;
        this.globalData.code = code;
        wx.setStorage({
          key: "code",
          data: code
        })
      }
    }); 
    if (wx.getStorageSync('httpClient')) {
      this.globalData.state = wx.getStorageSync('httpClient').state
      this.globalData.user_id = wx.getStorageSync('httpClient').user_id
    }
  },
  globalData: {
    userInfo: null,
    city:'',
    user_id:'',
    code:'',
    state: 0,
    latitude:'',
    longitude:''
  }
})