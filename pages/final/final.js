// pages/final/final.js
var network = require("../../libs/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsdetail: {},
    openid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)

    //获取商品信息
    network.GET("Wechat/MMGetGoodsDetail?goods_no=" + options.id, (res) => {
      console.log(res)
      if (res.errMsg == 'request:ok') {
        this.setData({
          goodsdetail: res.data
        })
      }

    }, (res) => {
      console.log(res)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.getStorage({
      key: "openid",
      success: (e) => {
        console.log(e)
        this.setData({
          openid: e.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //选择地址
  chooseaddress: function() {
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: (res) => {
          this.setData({
            address: res
          })
        },
        fail: (err) => {
          this.selectComponent("#Toast").showToast("请允许授权");
        }
      })
    } else {
      console.log('当前微信版本不支持chooseAddress');
    }
  },
  //点击立即支付
  pay: function() {
    // todo 支付
    if (!this.data.address) {
      this.selectComponent("#Toast").showToast("请选择地址");
    } else {
      if(this.data.openid){
        var data = {}
        data.goods_no = this.data.goodsdetail.goods_no
        data.openid = this.data.openid
        data.phone = this.data.address.telNumber
        data.receiver_name = this.data.address.userName
        data.address = this.data.address.provinceName + this.data.address.cityName + this.data.address.countyName + this.data.address.detailInfo
        console.log(data)
        network.POST("Wechat/MMCreateOrder", data, (res) => {
          console.log(res)
          if (res.data.result) {
            network.POST('Wechat/OrderPay', { order_no: res.data.order.order_no, openid: this.data.openid },
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
                      wx.switchTab({
                        url: '../person/person'
                      })
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
          } else {
            this.selectComponent("#Toast").showToast(res.data.message);
          }

        }, (res) => {
          console.log(res)
        })
      }else{
        this.selectComponent("#Toast").showToast("网络延迟，请关掉重试");
      }
     
    }


  },
  
})