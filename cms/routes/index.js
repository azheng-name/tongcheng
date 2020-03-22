const router = require('koa-router')()
const config = require('../config.js')
const request = require('request-promise')
const fs = require('fs')
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})
router.post('/uploadImg', async (ctx, next) => {


  var files = ctx.request.files;
  var file = files.file
  //console.log(files)

  try {
    let options = {//返回token
      uri: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' +
        config.appid + '&secret=' + config.secret,
      json: true
    }
    let { access_token } = await request(options);
    let fileName = `${Date.now()}.jpg`;
    let filePath = `banner/${fileName}`;
    options = {//拿到具体信息
      method: 'POST',
      uri: 'https://api.weixin.qq.com/tcb/uploadfile?access_token=' + access_token,
      body: {
        "env": 'jiaoyou-raa9q',
        "path": filePath
      },
      json: true
    }
    let res = await request(options);
    let file_id=res.file_id;
    options ={
      method: 'POST',
      uri: 'https://api.weixin.qq.com/tcb/databaseadd?access_token='+ access_token,
      body:{
        "env": 'jiaoyou-raa9q',
        "query" : "db.collection(\"banner\").add({data:{fileId:\""+file_id+"\"}})"
      },
      json:true
    }
    await request(options);
    options = {
      method: 'POST',
      uri: res.url,
      formData: {//执行上传任务
        "Signature": res.authorization,
        "key": filePath,
        "x-cos-security-token": res.token,
        "x-cos-meta-fileid": res.cos_file_id,
        "file": {
          value: fs.createReadStream(file.path),
          options: {
          
            filename: fileName,
            contentType: file.type,
           
          }
        }
      }
    }
    await request(options);
    ctx.body = res;
  } catch (err) {
    console.log(err.stack)
  }
})

module.exports = router