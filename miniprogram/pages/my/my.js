// miniprogram/pages/my/my.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: "/images/user.png",
    nickName: "小家伙",
    flag: true,
    disabled: true,
    id: ''
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
    this.getLocation();
    wx.cloud.callFunction({
      name: "login",
      data: {},
    }).then((res) => {
      //console.log(res)
      db.collection("user").where({
        _openid: res.result.openid
      }).get().then((res) => {
        if (res.data.length) {
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          //console.log(res.data)
          this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName: app.userInfo.nickName,
            flag: false,
            id: app.userInfo._id
          })
          this.getmassage()
        } else {
          this.setData({
            disabled: false
          })
        }

      })
    })




  },
  bindGetUserInfo(ev) {
    var userInfo = ev.detail.userInfo;
    if (userInfo && this.data.flag) {
      db.collection('user').add({
        data: {
          userPhoto: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          sign: "",
          phoneNumber: "",
          weixin: "",
          longitude: this.longitude,
          latitude: this.latitude,
          location: db.Geo.Point(this.longitude, this.latitude),
          friendList: [],
          links: 0,
          time: new Date()
        }
      }).then((res) => {
        //console.log(res)
        db.collection('user').doc(res._id).get().then((res) => {
          //console.log(res.data)
          app.userInfo = Object.assign(app.userInfo, res.data);
          this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName: app.userInfo.nickName,
            flag: false,
            id: app.userInfo._id
          })
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      userPhoto: app.userInfo.userPhoto,
      nickName: app.userInfo.nickName,
      id: app.userInfo._id
    })

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
  getmassage() {
    db.collection('massage').where({
      userId: app.userInfo._id
    }).watch({
      onChange: function(snapshot) {
        if (snapshot.docChanges.length) {
          let list = snapshot.docChanges[0].doc.list;
          if (list.length) {
            wx.showTabBarRedDot({
              index: 2,
            })
            app.usermassage = list;
          } else {
            wx.hideTabBarRedDot({
              index: 2,
            })
            app.usermassage = [];
          }
        }
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
  },
   getLocation() {
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: (res) => {
       this. latitude = res.latitude
        this. longitude = res.longitude
      }
    })

  },
})