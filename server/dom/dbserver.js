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

// 用户详情
exports.userDetial = function(id, res) {
  let wherestr = { '_id': id }
  let out = { 'psw': 0 }
  User.findOne(wherestr, out, function(err, result) {
    if(err) {
      res.send({ status: 500 })
    } else {
      res.send({
        status: 200,
        result,
      })
    }
  })
}

// 用户信息修改
exports.userUpdate = function(data, res) {
  let updateStr = {}

  // 判断是否有密码项
  if(typeof(data.pwd) != 'undefined') {
    // 有密码进行匹配
    User.find({'_id': data.id}, {'psw': 1 }, function(err, result) {
      if(err) {
        res.send({ status: 500 })
      } else {
        if(result == '') {
          res.send({ status: 400 })
        }
        result.map((e)=> {
          const pwdMatch = bcrypt.verification(data.pwd, e.psw)
          if (pwdMatch) {
            // 密码验证成功
            // 如果为修改密码先加密
            if(data.type == 'psw') {
              // 密码加密
              let password = bcrypt.encryption(data.data)
              updateStr[data.type] = password
            } else {
              updateStr[data.type] = data.data
            }
            User.findByIdAndUpdate(data.id, updateStr, function(err, resu) {
              if(err) {
                res.send({ status: 500 })
              } else {
                // 修改成功
                res.send({ status: 200 })
              }
            })
          } else {
            // 密码匹配失败
            res.send({ status: 400 })
          }
        })
      }
    })
  } else {
    updateStr[data.type] = data.data
    User.findByIdAndUpdate(data.id, updateStr, function(err, resu) {
      if(err) {
        res.send({ status: 500 })
      } else {
        // 修改成功
        res.send({ status: 200 })
      }
    })
  }
}

// 获取好友备注
exports.getMarkName = function(data, res) {
  let wherestr = {
    'userID': data.uid,
    'friendID': data.fid,
  }
  let out = { 'markname': 1 }
  Friend.findOne(wherestr, out, function(err, result) {
    if(err) {
      res.send({ status: 500 })
    } else {
      res.send({ 
        status: 200,
        result,
      })
    }
  })
}

// 修改好友备注
exports.friendMarkName = function(data, res) {
  let wherestr = {
    'userID': data.uid,
    'friendID': data.fid,
  }
  let updatestr = {
    'markname': data.name
  }
  Friend.updateOne(wherestr, updatestr, function(err, result) {
    if(err) {
      res.send({ status: 500 })
    } else {
      // 修改成功
      res.send({ status: 200 })
    }
  })
}