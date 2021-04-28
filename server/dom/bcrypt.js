/**
 * @description: 使用bcrypt进行密码加密
 * @param {*}
 * @return {*}
 */
var bcrypt = require('bcryptjs')

// 生成hash密码
exports.encryption = function(e) {
  let salt = bcrypt.genSaltSync(10) // 获得密言

  // 使用密言对密码加密
  let hash = bcrypt.hashSync(e, salt)

  return hash
}

// 对密码解密
exports.verification = function(e, hash) {
  let verif = bcrypt.compareSync(e, hash)

  return verif
}