// miniprogram/pages/index/index.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: [],
    list: [],
    currs: "links"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getcur(),
      this.getbannerList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  dainji(e) {
    let id = e.target.dataset.id;
    wx.cloud.callFunction({
      name: 'updatad',
      data: {
        collection: 'user',
        doc: id,
        data: '{ links: _.inc(1) }'
      }
    }).then((res) => {
      //console.log(res)
      let updated = res.result.stats.updated;
      if (updated) {
        let clone = [...this.data.list]
        for (let i = 0; i < clone.length; i++) {
          if (clone[i]._id === id) {
            clone[i].links++
          }
        }
        this.setData({
          list: clone
        })
      }
    })
  },
  curlist(e) {
    let currs = e.target.dataset.currs;
    if (currs === this.data.currs) {
      return false
    }
    this.setData({
      currs
    },()=>{
      this.getcur()
    })
  },
  getcur() {
    db.collection("user").field({
      nickName: true,
      links: true,
      userPhoto: true
    }).orderBy(this.data.currs, 'desc').get().then((res) => {

      this.setData({
        list: res.data
      })
    })
  },
  navto(e){
 let id=e.target.dataset.id
 wx.navigateTo({
   url: '/pages/details/details?id='+id,
 })
  },
  getbannerList(){
    db.collection('banner').get().then((res)=>{
     this.setData({
       imgUrl:res.data
     })
    })
  }
})