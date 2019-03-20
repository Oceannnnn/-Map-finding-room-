// pages/secondHand/secondHand.js
const main = require('../../libs/main.js');
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    scale: 12,
    scale2: 12,
    difference: 2,
    disuofference: -2,
    listData: [],
    brokerList: [],
    village: false,
    searchMapType: 1,
    isScale: false,
    mapChange: false
  },
  onReady: function() {
    main.userLocation();
  },
  onLoad: function(options) {
    let  arr = wx.getStorageSync('agentList');
    let brokerList = []; 
    for (var i = 0; i < arr.length; i++) {
      if (i <= 2) {
        brokerList.push(arr[i])
      }
    }
    this.setData({
      type: options.type,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      brokerList: brokerList,
      location: app.globalData.city,
      selectionType: 0
    })
    this.animation = wx.createAnimation();
    this.mapCtx = wx.createMapContext("map");
    this.checkboxList();
  },
  onShow() {
    if (this.data.selectionType == 0) {
      this.enLargeMap("12");
    }
  },
  checkboxList() {
    let url = '';
    let condition = {};
    if (this.data.type == 1) {
      url = "House/searchList"
    } else {
      url = "Rentout/searchList"
    }
    util.http(url, {}, 'get').then(res => {
      if (res.code == 200) {
        wx.setStorage({
          key: "checkboxList",
          data: res.data
        })
        let checkboxList = res.data;
        for (let i = 0; i < checkboxList.length; i++) {
          let alias = checkboxList[i].alias;
          let value = checkboxList[i].value
          condition[alias] = value;
        }
        condition = JSON.stringify(condition);
      }
    })
  },
  location() {
    wx.navigateTo({
      url: '../location/location',
    })
  },
  bestBroker_show(e) {
    let on = e.currentTarget.dataset.on;
    let id = e.currentTarget.dataset.id;
    for (let i = 0; i < this.data.brokerList.length; i++) {
      if (this.data.brokerList[i].rank == id) {
        this.setData({
          ['brokerList[' + i + '].on']: 1
        })
        if (on == 0) {
          this.animation.translateX(-112).step()
          this.setData({
            ['brokerList[' + i + '].animationData']: this.animation.export()
          })
          this.setData({
            ['brokerList[' + i + '].on']: 1
          })
        } else {
          this.animation.translateX(0).step()
          this.setData({
            ['brokerList[' + i + '].animationData']: this.animation.export()
          })
          this.setData({
            ['brokerList[' + i + '].on']: 0
          })
        }
      } else {
        this.setData({
          ['brokerList[' + i + '].on']: 0
        })
        this.animation.translateX(0).step()
        this.setData({
          ['brokerList[' + i + '].animationData']: this.animation.export()
        })
      }
    }
  },
  toBestBroker(e) {
    main.toDetails(e, "brokerInformation")
  },
  getSchoolMarkers(type) {
    let market = [];
    for (let item of this.data.listData) {
      let marker1 = this.createMarker(item, type);
      market.push(marker1)
    }
    return market;
  },
  createMarker(point, type) {
    let latitude = point.lat;
    let longitude = point.lng;
    let padding = 0;
    let price = point.min_money;
    if (this.data.scale >= 15) {
      padding = 10;
      price = point.house_min_money
    } else {
      padding = 15
    }
    let marker = {
      iconPath: "../../images/location1.png",
      id: point.id + "-" + type,
      latitude: latitude,
      longitude: longitude,
      callout: {
        content: point.name + " | " + price,
        fontSize: 12,
        color: '#ffffff',
        bgColor: "#6F81BA",
        padding: padding,
        borderRadius: 50,
        display: "ALWAYS"
      },
      width: 25,
      height: 25
    };
    return marker;
  },
  bindmarkertap(e) {
    let marker = e.markerId.split("-");
    let id = marker[0],
      type = marker[1];
    if (this.data.village) {
      wx.navigateTo({
        url: '../details/details?id=' + id + '&type=' + type
      })
    } else {
      let json = {
        city_id: id,
        type: type
      }
      this.animation = wx.createAnimation()
      this.setData({
        village: true,
        searchMapType: 2,
        scale: 16,
        scale2: 16,
        isScale: false
      })
      this.init(this.data.type, "Region/getVillage", json);
    }
  },
  enLargeMap(scale) {
    let that = this;
    let type = that.data.type;
    let json = {
      type: type, //[1: 二手房 2：租房]
      scale: scale,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude
    }
    that.init(type, "Region/enLargeMap", json)
  },
  init(type, url, json) {
    let listData = [];
    util.http(url, json, 'post').then(res => {
      if (res.code == 200) {
        let scale2 = this.data.scale2;
        let isScale = this.data.isScale;
        if (scale2 >= 15) {
          if (this.data.isScale) {
            listData = res.data
          } else {
            listData = res.data.village;
          }
        } else {
          listData = res.data
        }
        if (listData != '') {
          this.setData({
            listData: listData,
            scale: scale2,
            scale2: scale2
          })
          if (scale2 >= 15) {
            if (!this.data.isScale) {
              this.setData({
                latitude: res.data.village[0].lat,
                longitude: res.data.village[0].lng
              })
            }
          }
          let markets = this.getSchoolMarkers(type);
          this.setData({
            markers: [],
            markers: markets
          })
        } else {
          return
        }
      } else {
        wx.showToast({
          title: '搜索到0套房源',
          icon: 'none',
          duration: 2000
        })
        return
      }
    })
  },
  bindregionchange(e) {
    if (e.type != 'end') return
    if (this.data.mapChange) return;
    this.setData({
      mapChange: true
    })
    setTimeout(() => {
      this.setData({
        mapChange: false
      })
    }, 1500)
    let that = this;
    let scale2 = this.data.scale2;

    /**
     * difference 表示缩放后的差值
     * mapScale   表示视野发生变化后获取到的缩放值
     * scale2     表示初始的缩放值（为了避免和wxml{{scale}}冲突所以新定义和出事scale相等的缩放值）
     * Math.abs() 表示取绝对值的函数（因为地图可能放大也可能缩小）
     * 当视野变化之后，取得变化后的缩放值也就是 mapScale
     * mapScale - scale2 表示视野变化前后缩放值的变化大小，若是正值，则为放大，若是负值则为缩小，取其绝对值表示差值（thisDifference）
     * 用这个差值和difference作比较，大于规定的差值，就触法数据变化，并更新变化之后的scale（为了便于下次比较）；
     * 小于规定值不执行任何操作，数据就不会变
     * 明白了没？另外膜拜一下五笔大佬
     */

    let difference = this.data.difference;
    let disuofference = this.data.disuofference;
    this.mapCtx.getScale({
      success: function(res) {
        let mapScale = res.scale;
        let thisDifference = mapScale - scale2;
        // 手机上测试一下
        if (mapScale > 16) {
          that.setData({
            scale: 16,
            scale2: 16,
            village: true,
            isScale: true
          })
          that.enLargeMap(mapScale)
        }
        if (mapScale < 12) {
          that.setData({
            scale: 12,
            scale2: 12,
            village: false,
            isScale: true
          })
          that.enLargeMap(mapScale)
        }
        if (thisDifference > difference && mapScale < 17) {
          that.setData({
            scale2: mapScale,
            village: true,
            isScale: true,
          })
          that.enLargeMap(mapScale)
        } else if (thisDifference < disuofference && mapScale < 13) {
          that.setData({
            scale2: mapScale,
            village: false,
            isScale: true
          })
          that.enLargeMap(mapScale)
        }
        wx.hideLoading()
      }
    })

  },
  toUser() {
    wx.switchTab({
      url: '../my/my'
    })
  },
  selectionType(e) {
    main.toDetails(e, "selectionType")
  }
})