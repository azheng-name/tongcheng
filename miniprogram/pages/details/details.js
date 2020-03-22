// miniprogram/pages/details/details.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fider: false,
    opt: {},
    hide: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(options);
    let userId = options.id;
    db.collection('user').doc(userId).get().then((res) => {
      this.setData({
        opt: res.data
      })
      let friendList = res.data.friendList;
      if (friendList.includes(app.userInfo._id)) {
        this.setData({
          fider: true
        })
      } else {
        this.setData({
          fider: false,
        }, () => {
          if (userId === app.userInfo._id) {
            this.setData({
              fider: true,
              hide:true
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  firdTap() {
    if (app.userInfo._id) {
      db.collection('massage').where({
        userId: this.data.opt._id
      }).get().then((res) => {
        if (res.data.length) { //更新
          if (res.data[0].list.includes(app.userInfo._id)) {
            wx.showToast({
              title: '不要重复申请哦！',
            })
          } else {
            wx.cloud.callFunction({
              name: 'updatad',
              data: {
                collection: 'massage',
                where: {
                  userId: this.data.opt._id
                },
                data: `{list:_.unshift('${app.userInfo._id}')}`
              }
            }).then((res) => {
              wx.showToast({
                title: '申请成功~',
              })
            })
          }
        } else { //添加好友
          db.collection('massage').add({
            data: {
              userId: this.data.opt._id,
              list: [app.userInfo._id]
            }
          }).then((res) => {
            wx.showToast({
              title: '申请成功',
            })
          })
        }
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/my/my',
            })
          }, 2000)

        }
      })
    }
  }
})