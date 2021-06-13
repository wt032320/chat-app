// 群
var dbserver = require('../dom/dbserver')

// 新建群
exports.createGroup = function(req, res) {
  let data = req.body
  dbserver.createGroup(data, res)
}
