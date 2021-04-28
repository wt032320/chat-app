// 引入加密文件
var bcrypt = require('./bcrypt')
// 引入token
var jwt = require('./jwt')

const db = require('../config/db')
var dbmodel = require('../model/dbmodel')

var User = dbmodel.model('User')

// 新建用户
exports.buildUser = function(name, mail, pswd, res) {
  // 密码加密
  let password = bcrypt.encryption(pswd)

  let data = {
    name: name,
    email: mail,
    psw: password,
    time: new Date(),
  }

  let user = new User(data);

  user.save((err, result) => {
    if (err) {
      res.send({
        status: 500
      })
    } else {
      res.send({
        status: 200
      })
    }
  })
}

// 匹配用户表元素
exports.countUserValue = function(data, type, res) {
  let wherestr = {}
  // wherestr = { 'type': data }
  wherestr[type] = data

  User.countDocuments(wherestr, (err, result) => {
    if (err) {
      res.send({
        status: 500
      })
    } else {
      res.send({
        status: 200,
        result,
      })
    }
  })
}

// 用户验证
exports.userMatch = function(data, pwd, res) {
  let wherestr = { $or:[{'name': data}, {'email': data}] }
  let out = {
    'name': 1, 
    'imgurl': 1,  // 1 输出  0 不输出
    'psw': 1,
  }

  User.find(wherestr, out, (err, result) => {
    if(err) {
      res.send({
        status: 500
      })
    } else {
      if(result == '') {
        res.send({
          status: 400
        })
      }
      result.map((e) => {
        const pwdMatch = bcrypt.verification(pwd, e.psw)
        let token = jwt.generateToken(e._id)
        if (pwdMatch) {
          let back = {
            id: e._id,
            name: e.name,
            imgurl: e.imgurl,
            token: token,
          }
          res.send({
            status: 200,
            back
          })
        } else {
          res.send({
            status: 400
          })
        }
      })
    }
  })
}