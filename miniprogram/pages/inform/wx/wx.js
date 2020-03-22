// miniprogram/pages/inform/wx/wx.js
const app=getApp()
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     weixin:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     this.setData({
       weixin:app.userInfo.weixin
     })
  },
  input(e){
    let val=e.detail.value
    this.setData({
      weixin:val
    })
  },
  wei(){
    this.gin()
  },
  gin(){
    wx.showLoading({
      title: '上传中',
    })
    db.collection('user').doc(app.userInfo._id).update({
      data:{
         weixin:this.data.weixin
      }
    }).then((res)=>{
      wx.hideLoading()
      wx.showToast({
        title: '上传成功',
      })
    })
    app.userInfo.weixin=this.data.weixin
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})