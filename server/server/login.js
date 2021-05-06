// 用户登录
var dbserver = require('../dom/dbserver')

// 登录
exports.userLogin = function(req, res) {
  let data = req.body.data
  let pwd = req.body.pwd

  dbserver.userMatch(data, pwd, res)
}

