// 引入加密文件
var bcrypt = require('./bcrypt')
// 引入token
var jwt = require('./jwt')

const db = require('../config/db')
var dbmodel = require('../model/dbmodel')

var User = dbmodel.model('User') // 用户表
var Friend = dbmodel.model('Friend') // 好友表
var Group = dbmodel.model('Group') // 群表
var GroupUser = dbmodel.model('GroupUser') // 群成员表

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

// 搜索用户
exports.searchUser = function(data, res) {
  let wherestr
  if (data == 'w.w') {
    wherestr = {}
  } else {
    wherestr = { $or: [{'name': {$regex: data}}, {'email': {$regex: data}}] }   // $regex 模糊查找
  }
  let out = {
    'name': 1,
    'email': 1,
    'imgurl': 1,
  }

  User.find(wherestr, out, (err, result) => {
    if (err) {
      res.send({
        status: 500,
      })
    } else {
      res.send({
        status: 200,
        result,
      })
    }
  })
}

// 判断是否为好友
exports.isFriend = function(uid, fid, res) {
  let wherestr = {
    'userID': uid,
    'friendID': fid,
    'state': 0,
  }
  Friend.findOne(wherestr, (err, result) => {
    if (err) {
      res.send({
        status: 500
      })
    }
    else {
      if (result) {
        // 是好友
        res.send({
          status: 200,
        })
      } else {
        // 不是好友
        res.send({
          status: 400,
        })
      }
    }
  })
}

// 搜索群
exports.searchGroup = function(data, res) {
  let wherestr
  if (data == 'w.w') {
    wherestr = {}
  } else {
    wherestr = { 'name': {$regex: data} }
  }
  let out = {
    'name': 1,
    'imgurl': 1,
  }

  Group.find(wherestr, out, (err, result) => {
    if (err) {
      res.send({
        status: 500,
      })
    } else {
      res.send({
        status: 200,
        result,
      })
    }
  })
}

// 判断是否在群里
exports.isInGroup = function(uid, gid, res) {
  let wherestr = {
    'userID': uid,
    'groupID': gid,
  }
  GroupUser.findOne(wherestr, (err, result) => {
    if (err) {
      res.send({
        status: 500
      })
    }
    else {
      if (result) {
        // 是在群里
        res.send({
          status: 200,
        })
      } else {
        // 不在群里
        res.send({
          status: 400,
        })
      }
    }
  })
}