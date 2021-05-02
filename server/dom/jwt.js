// token

// 引入token
var jwt = require('jsonwebtoken')

var secret = 'WT0810' // 密钥

// 生成token
exports.generateToken = function(e) {
  let payload = {
    id: e,
    time: new Date(),
  }
  let token = jwt.sign(payload, secret, { expiresIn: 60 * 60 * 24 * 120 })  // 120天有效期
  return token
}

// 解码token
exports.verifyToken = function(e) {
  let payload
  jwt.verify(e, secret, (err, result) => {
    if(err) {
      payload = 0
    } else {
      payload = 1
    }
  })

  return payload
}
