//获取open_id
var open_id;

//公共地址
var commonurl ="https://wechat.fangxing123.cn/api/";
//测试
// var commonurl ="https://mallt.shjinjia.com.cn/api/";
//指向文慧地址
// var commonurl = "http://10.10.200.2/ERPAssistant_Api/api/";

//不需要检测open_id的接口
var detectionport = [];
/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */


function GET(url, success, fail) {


  var trueurl=url;
  if (url.indexOf("?") < 0) {
  } else {
    url = url.substring(0, url.indexOf("?"));
  }
  wx.request({
    url: commonurl + trueurl,
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      success(res);
    },
    fail: function (res) {
      fail(res);
    }
  });
}

/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
function POST(url, data, success, fail) {
  var trueurl = url;
  if (url.indexOf("?") < 0) {
  } else {
    url = url.substring(0, url.indexOf("?"));
  }
  wx.request({
    url: commonurl + trueurl,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    data: data,
    success: function (res) {
      success(res);
    },
    fail: function (res) {
      fail(res);
    }
  });

}

/**
* url 请求地址
* success 成功的回调
* fail 失败的回调
*/
function GETJSON(url, data, success, fail, openid) {
  console.log(open_id)
  var trueurl = url;
  if (url.indexOf("?") < 0) {
  } else {
    url = url.substring(0, url.indexOf("?"));
  }
  if (detectionport.indexOf(url) < 0) {

    wx.getStorage({
      key: 'open_id',
      success: function (res) {
        open_id = res.data
        wx.request({
          url: commonurl + trueurl,
          header: {
            'Content-Type': 'application/json',
          },
          data: data,
          success: function (res) {
            success(res);
          },
          fail: function (res) {
            fail(res);
          }
        });
      },
      fail: (res) => {
        wx.request({
          url: commonurl + trueurl,
          header: {
            'Content-Type': 'application/json',
          },
          data: data,
          success: function (res) {
            success(res);
          },
          fail: function (res) {
            fail(res);
          }
        });
      }
    })
  } else {
    console.log("不需要open_id");
    wx.request({
      url: commonurl + trueurl,
      header: {
        'Content-Type': 'application/json',
      },
      data: data,
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      }
    });
  }

}



function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}
module.exports = {
  GET: GET,
  POST: POST,
  GETJSON: GETJSON,
  throttle: throttle
}