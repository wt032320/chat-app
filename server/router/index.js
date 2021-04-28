var dbserver = require('../dom/dbserver')
// 引入邮箱发送方法
var emailserver = require('../dom/emailserver')
// 注册页面服务
var regist = require('../server/regist')
// 登录页服务
var login = require('../server/login')

module.exports = function (app) {
  app.get('/test', (req, res) => {
    res.send('hhhhhh')
  })

  // 邮箱测试
  app.post('/mail', (req, res) => {
    let mail = req.body.mail
    emailserver.emailSignUp(mail, res)
  })

  // 注册页面
  // 注册
  app.post('/regist/add', (req, res) => {
    regist.signUp(req, res)
  })

  // 用户名或邮箱是否占用
  app.post('/regist/judge', (req, res) => {
    regist.judgeValue(req, res)
  })

  // 登录页面
  // 登录
  app.post('/login/match', (req, res) => {
    login.userLogin(req, res)
  })

  // token测试
  // app.post('/login/test', (req, res) => {
  //   login.test(req, res)
  // })
}
