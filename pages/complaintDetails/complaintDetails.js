// pages/complaintDetails/complaintDetails.js
const util = require('../../utils/util.js')
const main = require('../../libs/main.js')
const app = getApp()
Page({
  data: {},
  onLoad: function (options) {
    let type = options.type;
    let id = options.id;
    util.http("Complaints/complaintDetail", {id:id,type:type}, 'post').then(res => {
      if(res.code == 200){
        this.setData({
          details:res.data,
          type: type
        })
      }
    })
  },
  roomDetails(e) {
    main.toDetails(e, "roomDetails")
  }
})