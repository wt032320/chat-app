// 聊天
var dbserver = require('../dom/dbserver')

// 获取一对一聊天数据
exports.msg = function(req, res) {
  let data = req.body
  dbserver.msg(data, res)
}