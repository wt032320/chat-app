var dbserver = require('../dom/dbserver')

// 用户注册
exports.signUp = function(req, res) {
  let name = req.body.name
  let mail = req.body.mail
  let pwd = req.body.pwd

  // res.send({name, mail, pwd})
  dbserver.buildUser(name, mail, pwd, res)
}

// 用户名或邮箱是否占用判断
exports.judgeValue = function(req, res) {
  let data = req.body.data
  let type = req.body.type

  res.send({data, type})
  dbserver.countUserValue(data, type, res)
}
