const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const app = getApp()
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//request请求
const http = (url, data = {}, method = 'get') => {
  var u = "https://www.dituzc.cn/api.php/api/" + url;
  return new Promise(function (resolve, reject) {
    wx.request({
      url: u,
      data: data,
      method: method ? method : 'get',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        resolve(res.data)
      },
      fail: (res) => {
        reject(res.data)
      }
    })
  })
}

const location = (lat,lon,haveCity) => {
  http('House/getLocation', { latitude: lat, longitude: lon }, 'post').then(res => {
    let city = res.data
    if (res.code == 200) {
      wx.setStorage({
        key: "HousegetLocation",
        data: {
          city: city,
          latitude: lat,
          longitude: lon
        }
      })
      if (!haveCity) {
        wx.setStorage({
          key: "myCity",
          data: city
        })
      }
      app.globalData.city = city;
      app.globalData.latitude = lat;
      app.globalData.longitude = lon;
      wx.switchTab({
        url: '../main/main'
      })
    }
  })
}
module.exports = {
  location: location,
  formatTime: formatTime,
  http: http
}
