// pages/person/person.js
var network = require("../../libs/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: false,
    loading:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  // todo获取订单信息
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '加载中',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: "openid",
      success: (e) => {
        console.log(e)
        this.setData({
          openid: e.data
        })
        this.MMGetOrderByOpenid();
      }
    })
  },
  MMGetOrderByOpenid:function(){
    if (this.data.openid){
      network.GET("Wechat/MMGetOrderByOpenid?open_id=" + this.data.openid, (res) => {
        wx.hideLoading();
        if (res.errMsg == 'request:ok') {
          if (res.data) {
            this.setData({
              orderdetail: res.data,
              goods: res.data.goods,
              order: true,
              loading:false
            })
            if (res.data.logistics_info) {
              this.setData({
                logistics_info: JSON.parse(res.data.logistics_info).result,
              })
            }
          } else {
            this.setData({
              order: false,
              loading: false
            })
           
          }

        }

      }, (res) => {
        console.log(res)
      })
    }else{
      this.selectComponent("#Toast").showToast("网络延迟，请关掉重试");
    }
  
  },
  pay: function () {
    if (this.data.openid) {
      network.POST('Wechat/OrderPay', { order_no: this.data.orderdetail.order_no, openid: this.data.openid },
        (res) => {
          console.log(res)
          let paydata = res.data.res_content;
          paydata = JSON.parse(paydata);
          console.log(paydata.package)

          if (res.data.res_status_code == '0') {
            wx.requestPayment({
              'timeStamp': paydata.timeStamp,
              'nonceStr': paydata.nonceStr,
              'package': paydata.package,
              'signType': paydata.signType,
              'paySign': paydata.paySign,
              'success': (res) => {
                this.MMGetOrderByOpenid();
              },
              fail: (res) => {
                this.selectComponent("#Toast").showToast("支付失败");
                wx.switchTab({
                  url: '../person/person'
                })
              },
              complete: (res) => {
                console.log(res)
              }
            })
          } else {
            this.selectComponent("#Toast").showToast(res.data.message);
          }
        }, (res) => {
          console.log(res);
        })
    }else{
      this.selectComponent("#Toast").showToast("网络延迟，请关掉重试");
    }

  }

})