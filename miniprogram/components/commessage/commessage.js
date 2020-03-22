// components/commessage/commessage.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    commessage: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    friend() {
      wx.showModal({
        title: '提示信息',
        content: '好友申请',
        confirmText: "同意",
        success: (res) => {
          if (res.confirm) {
            db.collection('user').doc(app.userInfo._id).update({
              data: {
                friendList: _.unshift(this.data.mId)
              }
            }).then((res) => {

            })
            wx.cloud.callFunction({
              name: 'updatad',
              data: {
                collection: "user",
                doc: this.data.mId,
                data: `{ friendList: _.unshift('${app.userInfo._id}')}`
              }
            })
            this.remove()
          } else if (res.cancel) {

          }
        }
      })
    },
    delete() {
      wx.showModal({
        title: '提示信息',
        content: '删除消息',
        confirmText: "删除",
        success: (res) => {
          if (res.confirm) {
            this.remove()
          } else if (res.cancel) {

          }
        }
      })
    },
    remove() {
      db.collection('massage').where({
        userId: app.userInfo._id
      }).get().then((res) => {
        let list = res.data[0].list;
        // console.log(list)
        list = list.filter((val, i) => {
          return val != this.data.mId
        });
        wx.cloud.callFunction({
          name: 'updatad',
          data: {
            collection: 'massage',
            where: {
              userId: app.userInfo._id
            },
            data: {
              list
            }
          }
        }).then((res) => {
          this.triggerEvent('myevent', list)
        })
      })
    }
  },
  lifetimes: {
    attached: function() {
      db.collection('user').doc(this.data.mId).field({
        userPhoto: true,
        nickName: true
      }).get().then((res) => {
        this.setData({
          commessage: res.data
        })
      })
    }
  }

})