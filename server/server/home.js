// 主页
var dbserver = require('../dom/dbserver')

// 获取好友列表
exports.getFriend = function(req, res) {
  let data = req.body
  dbserver.getUsers(data, res)
}

// 获取最后一条消息
exports.getEndMsg = function(req, res) {
  let data = req.body
  dbserver.getOneMessage(data, res)
}

// 获取好友未读消息数
exports.unreadMsg = function(req, res) {
  let data = req.body
  dbserver.unreadMsg(data, res)
}

// 好友标已读
exports.updateMsg = function(req, res) {
  let data = req.body
  dbserver.readedMsg(data, res)
}

// 获取群列表
exports.getGroup = function(req, res) {
  let uid = req.body.uid
  dbserver.getGroup(uid, res)
}

// 获取最后一条群消息
exports.getOneGroupMsg = function(req, res) {
  let gid = req.body.gid
  dbserver.getOneGroupMsg(gid, res)
}


// 群消息标已读
exports.updateGroupMsg = function(req, res) {
  let data = req.body
  dbserver.updateGroupMsg(data, res)
}