// 引入解析req.body插件
var bodyParser = require('body-parser')
// 引入token
var jwt = require('./dom/jwt')

const express = require('express')
const app = express()
const port = 8081

// socket.io
const io = require('socket.io')(8082)
io.on('connection', (socket) => {
  // console.log('链接成功')
})

//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Credentials", true)
  res.header("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, OPTIONS")
  res.header("X-Powered-By", '3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8")
  if(req.method == 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// 解析前端数据
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))

// 获取静态路径
app.use(express.static(__dirname + '/data'))

// token判断
app.use(function(req, res, next) {
  if(typeof(req.body.token) != 'undefined') {
    // 处理token匹配
    let token = req.body.token
    let tokenMatch = jwt.verifyToken(token)
    if (tokenMatch == 1) {
      // 通过验证
      next()
    } else{
      // 验证不通过
      res.send({ status: 300 })
    }
  } else {
    next()
  }
}) 

// 路由引入
require('./router/index')(app)
require('./router/files')(app)


// 404页面
app.use(function(req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// 出现错误处理
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.send(err.message)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
