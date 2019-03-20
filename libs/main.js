// const getLocationMy 
const toDetails = (e, url) => {
  let id = e.currentTarget.dataset.id;
  let type = e.currentTarget.dataset.type;
  wx.navigateTo({
    url: '../' + url + '/' + url + '?id=' + id + '&type=' + type
  })
}
const userLocation = () =>{
  wx.getSetting({
    success: (res) => {
      if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
        wx.redirectTo({
          url: '../HousegetLocation/HousegetLocation',
        })
      }
    }
  })
}
const goLogin = () => {
  wx.showModal({
    title: '提示',
    confirmText: '去登录',
    content: '请先前往个人中心登录',
    success: function (res) {
      if (res.confirm) {
        wx.switchTab({
          url: '../my/my'
        })
      }
    }
  })
}
module.exports = {
  goLogin: goLogin,
  userLocation: userLocation,
  toDetails: toDetails
}