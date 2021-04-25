var dbserver = require('../dom/dbserver')
// 引入邮箱发送方法
var emailserver = require('../dom/emailserver')

module.exports = function (app) {
  app.get('/test', (req, res) => {
    res.send('hhhhhh')
  })

  // 邮箱测试
  app.post('/mail', (req, res) => {
    let mail = req.body.mail
    emailserver.emailSignUp(mail, res)
  })
}
