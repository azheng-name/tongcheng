// components/search/search.js
const app=getApp()
const db=wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus: false,
    hisToryList: [],
    searchList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    focusTap() {
      this.setData({
        isFocus: true
      })
      wx.getStorage({
        key: 'SearchHistory',
        success: (res) => {
          this.setData({
            hisToryList: res.data
          })
        }
      })
     
    },
    onTap() {
      this.setData({
        isFocus: false
      })
    },
    TapCon(e) {
      let value=e.detail.value
      let cloneList = [...this.data.hisToryList]
      cloneList.unshift(value)
      wx.setStorage({
        key: "SearchHistory",
        data: [...new Set(cloneList)]
      })
      this.searchLists(value)
    },
    Icon() {
      wx.removeStorage({
        key: 'SearchHistory',
        success:(res)=> {
          this.setData({
            hisToryList: []
          })
        }
      })
    },
    searchLists(value){
       db.collection('user').where({
         nickName: db.RegExp({
           regexp: value,
           options: 'i',
         })
       }).field({
         nickName:true,
         userPhoto:true
       }).get().then((res)=>{
         this.setData({
         searchList:res.data
             })
       })
    },
    textTap(e){
    //console.log(e)
    let value=e.target.dataset.text;
        this.searchLists(value)
    }
  }
})