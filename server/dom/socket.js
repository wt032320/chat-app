let dbsrever = require('./dbserver')

module.exports = function(io) {
  var users = {} // socket注册用户
  io.on('connection', (socket) => {

    // console.log('ddddddd')
    socket.on('login', (id) => {
      // 回复客户端
      socket.name = id
      users[id] = socket.id
      socket.emit('login', socket.id)
    })

    // 用户一对一消息发送
    socket.on('msg', (msg, fromid, toid) => {
      // console.log(msg, fromid, users[toid])
      let data = {
        uid: fromid,
        fid: toid
      }
      // 修改好友最后通讯时间
      dbsrever.upFriendLastTime(data)
      // 存储一对一消息
      dbsrever.insertMsg(fromid, toid, msg.message, msg.types)
      // 发送给对方
      if (users[toid]) {
        socket.to(users[toid]).emit('msg', msg, fromid, 0)
      }
      // 发送给自己
      socket.emit('msg', msg, toid, 1)
    })

    // 用户离开
    socket.on('disconnecting', () => {
      // console.log(users)
      if (users.hasOwnProperty(socket.name)) {
        delete users[socket.name]
        // console.log(users)
        console.log(socket.id + '离开')
      }
    })
  })
}