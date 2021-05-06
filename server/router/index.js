var dbserver = require('../dom/dbserver')
// 引入邮箱发送方法
var emailserver = require('../dom/emailserver')
// 注册页面服务
var regist = require('../server/regist')
// 登录页服务
var login = require('../server/login')
// 搜索页面服务
var search = require('../server/search')
// 详情页服务
var detial = require('../server/userdetial')
// 好友服务
var friend = require('../server/friend')

module.exports = function (app) {
  app.get('/test', (req, res) => {
    res.send('hhhhhh')
  })

  // 邮箱测试
  app.post('/mail', (req, res) => {
    let mail = req.body.mail
    emailserver.emailSignUp(mail, res)
  })

  // 注册页面
  // 注册
  app.post('/regist/add', (req, res) => {
    regist.signUp(req, res)
  })

  // 用户名或邮箱是否占用
  app.post('/regist/judge', (req, res) => {
    regist.judgeValue(req, res)
  })

  // 登录页面
  // 登录
  app.post('/login/match', (req, res) => {
    login.userLogin(req, res)
  })

  // 搜索页面
  // 搜索用户
  app.post('/search/user', (req, res) => {
    search.searchUser(req, res)
  })
  // 判断是否为好友
  app.post('/search/isfriend', (req, res) => {
    search.isFriend(req, res)
  })
  // 搜索群
  app.post('/search/group', (req, res) => {
    search.searchGroup(req, res)
  })
  // 判断是否在群里
  app.post('/search/ingroup', (req, res) => {
    search.isInGroup(req, res)
  })

  // 用户详情
  // 详情
  app.post('/user/detial', (req, res) => {
    detial.userDetial(req, res)
  })
  // 信息修改
  app.post('/user/update', (req, res) => {
    detial.userUpdate(req, res)
  })
  // 修改好友备注
  app.post('/friend/markname', (req, res) => {
    detial.friendMarkName(req, res)
  })

  // 获取好友备注
  app.post('/friend/getname', (req, res) => {
    detial.getMarkName(req, res)
  })
  
  // 好友操作
  // 申请好友
  app.post('/friend/apply', (req, res) => {
    friend.applyFriend(req, res)
  })
  // 好友状态修改
  app.post('/friend/newstate', (req, res) => {
    friend.updateFriendState(req, res)
  })
  // 拒绝好友或删除好友
  app.post('/friend/delete', (req, res) => {
    friend.deleteFriend(req, res)
  })


  // token测试
  // app.post('/login/test', (req, res) => {
  //   login.test(req, res)
  // })
}
