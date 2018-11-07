// components/Toast/Toast.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowToast:false,
    tip:"",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //显示提示框
    showToast: function (text) {
      this.setData({
        tip: text,
        isShowToast: !this.data.isShowToast
      })
      setTimeout( ()=> {
        this.setData({
          isShowToast: !this.data.isShowToast
        });
      }, 1500);
    },
  }
})
