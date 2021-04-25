// 引用发送邮件包
var nodemailer = require('nodemailer')
// 引入证书文件
var credentials = require('../config/credentials')

// 创建传输方式
var transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: credentials.qq.user,
    pass: credentials.qq.pass,
  }
})

// 注册发送邮件给用户
exports.emailSignUp = function(email, res) {
  // 发送信息
  let options = {
    from: '1476081727@qq.com',
    to: email,
    subject: '感谢您在W.W注册',
    html: '<span>W.W欢迎你的加入</span><a href="http://localhost:8080/">点击</a>',
  };

  // 发送邮件
  transporter.sendMail(options, (err, msg) => {
    if (err) {
      res.send(err)
    } else {
      res.send('邮箱发送成功')
    }
  })
}