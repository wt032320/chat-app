// 用户详情
var dbserver = require('../dom/dbserver')

// 详情
exports.userDetial = function(req, res) {
  let id = req.body.id
  dbserver.userDetial(id, res)
}

// 用户信息修改
exports.userUpdate = function(req, res) {
  let data = req.body
  dbserver.userUpdate(data, res)
}

// 修改好友备注
exports.friendMarkName = function(req, res) {
  let data = req.body
  dbserver.friendMarkName(data, res)
}

// 获取好友备注
exports.getMarkName = function(req, res) {
  let data = req.body
  dbserver.getMarkName(req, res)
}