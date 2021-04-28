// 用户登录
var dbserver = require('../dom/dbserver')

// var jwt = require('../dom/jwt')

// 登录
exports.userLogin = function(req, res) {
  let data = req.body.data
  let pwd = req.body.pwd

  dbserver.userMatch(data, pwd, res)
} 

// token测试
// exports.test = function(req, res) {
//   let token = req.body.token
//   let jg = jwt.verifyToken(token)
//   res.send(jg)
// }
