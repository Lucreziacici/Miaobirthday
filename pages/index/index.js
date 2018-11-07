//index.js
//获取应用实例
const app = getApp()
var network = require("../../libs/network.js")
Page({
  data: {
    userInfo: {},
    chooseitem: 1,
    openid: "",
    goodsList: [],
    skin: ["干皮", "油皮", "敏感肌", "痘痘肌", "混合皮"],
    requirements: [{
      name: "美白",
      check: false
    }, {
      name: "抗衰",
      check: false
    }, {
      name: "补水",
      check: false
    }],
    methods: [{
      name: "微店",
      check: false
    }, {
      name: "淘宝",
      check: false
    }],
    shophistory: ["是", "否"],
    name: "", //姓名
    phone: "", //电话
    age: "", //年龄
    skin_type: "", //肤质
    ww_id: "", //淘宝id
    wechat_id: "",
    skin_require: [], //功能性要求
    platform: [], //常用购物方式
    userquestionnaire: {}, //问卷
    is_bought: "", //是否在店铺购买过
    show: false,


  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
          })
        }
      })
    }
    // 在没有 open-type=getUserInfo 版本的兼容处理
    wx.login({
      success: (e) => {
        wx.showLoading({
          title: '加载中',
        })
        network.GET("Wechat/MMInfoWxGetOpenId?code=" + e.code, (res) => {
          wx.hideLoading()
          this.setData({
            openid: res.data
          })
          wx.setStorage({
            key: "openid",
            data: res.data
          })
          this.MMInfoWxGetUser();

        }, (res) => {
          console.log(res)
        })
      },
    })

  },
  changename: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  changephone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  changeage: function(e) {
    this.setData({
      age: e.detail.value
    })
  },
  changewwid: function(e) {
    this.setData({
      ww_id: e.detail.value
    })
  },
  changewxid: function(e) {
    this.setData({
      wechat_id: e.detail.value
    })
  },
  changeskin: function(e) {
    this.setData({
      skinTab: e.currentTarget.dataset.id,
      skin_type: e.currentTarget.dataset.value
    })
  },
  changeshophistory: function(e) {
    this.setData({
      historyTab: e.currentTarget.dataset.id,
      is_bought: e.currentTarget.dataset.value
    })
  },
  changerequirements: function(e) {
    var reuir = this.data.requirements;
    reuir[e.currentTarget.dataset.id].check = !this.data.requirements[e.currentTarget.dataset.id].check;
    // 选中数组添加
    if (this.data.requirements[e.currentTarget.dataset.id].check) {
      var skin_reuir = this.data.skin_require;
      skin_reuir.push(e.currentTarget.dataset.value.name);
      this.setData({
        requirements: reuir,
        skin_require: skin_reuir
      })
    } else {
      // 数组删除
      var skin_reuir = this.data.skin_require;
      for (var i = 0; i < skin_reuir.length; i++) {
        if (skin_reuir[i] == e.currentTarget.dataset.value.name) {
          skin_reuir.splice(i, 1);
        }
      }
      this.setData({
        requirements: reuir,
        skin_require: skin_reuir
      })
    }
  },
  changemethods: function(e) {
    var reuir = this.data.methods;
    reuir[e.currentTarget.dataset.id].check = !this.data.methods[e.currentTarget.dataset.id].check;
    // 选中数组添加
    if (this.data.methods[e.currentTarget.dataset.id].check) {
      var skin_reuir = this.data.platform;
      skin_reuir.push(e.currentTarget.dataset.value.name);
      this.setData({
        methods: reuir,
        platform: skin_reuir
      })
    } else {
      // 数组删除
      var skin_reuir = this.data.platform;
      for (var i = 0; i < skin_reuir.length; i++) {
        if (skin_reuir[i] == e.currentTarget.dataset.value.name) {
          skin_reuir.splice(i, 1);
        }
      }
      this.setData({
        methods: reuir,
        platform: skin_reuir
      })
    }
  },
  chooseaddress: function(e) {
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
  getUserInfo: function(e) {
    if (this.data.openid) {
      if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
        this.selectComponent("#Toast").showToast("请允许授权");
      } else {
        app.globalData.userInfo = e.detail.userInfo
        console.log(e.detail)
        this.setData({
          userInfo: e.detail.userInfo,
        })
        this.MMInfoSetUserInfo();

      }
    } else {
      this.selectComponent("#Toast").showToast("网络延迟，请关掉重试");
    }
  },
  MMInfoSetUserInfo:function(){
    // todo 储存授权信息
    var data = {};
    data.nick_name = this.data.userInfo.nickName;
    data.img = this.data.userInfo.avatarUrl;
    data.province = this.data.userInfo.province;
    data.gender = this.data.userInfo.gender;
    data.city = this.data.userInfo.city;
    data.country = this.data.userInfo.country;
    data.open_id = this.data.openid;
    data.name = this.data.name;
    data.phone = this.data.phone;
    data.age = this.data.age;
    data.skin_type = this.data.skin_type;
    data.is_bought = this.data.is_bought;
    data.skin_require = this.data.skin_require.join(",");
    data.ww_id = this.data.ww_id;
    data.wechat_id = this.data.wechat_id;
    if (this.data.address) {
      data.address = this.data.address.provinceName + this.data.address.cityName + this.data.address.countyName + this.data.address.detailInfo + this.data.address.userName + this.data.address.telNumber;
    }

    data.platform = this.data.platform.join(",");
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(19[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!data.name) {
      this.selectComponent("#Toast").showToast("请输入姓名");
      return false;
    }
    if (!data.phone) {
      this.selectComponent("#Toast").showToast("请输入手机号");
      return false;
    }
    if (!myreg.test(data.phone)) {
      this.selectComponent("#Toast").showToast("手机号码有误");
      return false;
    }
    if (!data.age) {
      this.selectComponent("#Toast").showToast("请输入年龄");
      return false;
    }
    if (!data.skin_type) {
      this.selectComponent("#Toast").showToast("请选择肤质");
      return false;
    }
    if (!data.ww_id) {
      this.selectComponent("#Toast").showToast("请输入淘宝ID");
      return false;
    }
    if (!data.wechat_id) {
      this.selectComponent("#Toast").showToast("请输入微信号");
      return false;
    }
    if (!data.skin_require) {
      this.selectComponent("#Toast").showToast("请选择功能性要求");
      return false;
    }
    if (!data.is_bought) {
      this.selectComponent("#Toast").showToast("请选择是否在店铺有过购物");
      return false;
    }
    wx.showLoading({
      title: '加载中…',
      mask: true,
    })
    network.POST("Wechat/MMInfoSetUserInfo", data, (res) => {
      wx.hideLoading();
      if (res.data.result) {
        if (res.data.user.open_id !== this.data.openid) {
          this.MMInfoSetUserInfo();
        } else {
          this.setData({
            userquestionnaire: res.data.user
          })
        }

      } else {
        this.selectComponent("#Toast").showToast(res.data.message);
      }

    }, (res) => {

    })
  },
  MMInfoWxGetUser: function() {
    network.GET("Wechat/MMInfoWxGetUser?open_id=" + this.data.openid, (res) => {
      this.setData({
        show: true,
        userquestionnaire: res.data
      })
    }, (res) => {
      console.log(res)
    })
  },


  onShareAppMessage: function(res) {
    if (res.from === 'button') {

    }
    return {
      title: '淼严选有奖调查问卷',
      path: '/pages/index/index',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})