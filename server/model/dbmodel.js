var mongoose = require('mongoose')
var db = require('../config/db')

var Schema = mongoose.Schema

// 用户表
var UserSchema = new Schema({
  name: { type: String },                            // 用户名
  psw: { type: String },                             // 密码
  email: { type: String },                           // 邮箱
  sex: { type: String, default: 'asexual' },         // 性别
  birth: { type: Date },                             // 生日
  phone: { type: String },                           // 电话
  explain: { type: String },                         // 签名
  imgurl: { type: String, default: 'user.png' },     // 头像链接
  time: { type: Date },                              // 注册时间
})

// 好友表
var FriendSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' },               // 用户ID
  friendID: { type: Schema.Types.ObjectId, ref: 'User' },             // 好友ID
  state: { type: Number },                                            // 好友状态 (0表示已为好友 1表示申请中 2表示申请已发送，对方未同意)
  markname: { type: String },                                         // 好友备注
  time: { type: Date },                                               // 生成时间
  lastTime: { type: Date },                                           // 最后通讯时间
})

// 一对一消息表
var MessageSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' },               // 用户ID(发送者)
  friendID: { type: Schema.Types.ObjectId, ref: 'User' },             // 好友ID(接收者)
  message: { type: String },                                          // 发送内容
  types: { type: Number },                                            // 内容类型 (0文字 1图片链接 2音频链接)
  time: { type: Date },                                               // 发送时间
  state: { type: Number },                                            // 消息状态 (0已读 1未读)
  // tip: { type: Number },                                              // 未读消息数
})

// 群表
var GroupSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' },               // 群主ID
  name: { type: String },                                             // 群名称
  imgurl: { type: String, default: 'group.png' },                     // 群封面链接
  time: { type: Date },                                               // 建群时间
  notices: { type: String },                                          // 群公告
})

// 群成员表
var GroupUserSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: 'Group' },             // 群ID
  userID: { type: Schema.Types.ObjectId, ref: 'User' },               // 用户ID
  name: { type: String },                                             // 群内名称
  tip: { type: Number, default: 0 },                                  // 未读消息数
  time: { type: Date },                                               // 加群时间
  lastTime: { type: Date },                                           // 最后通讯时间
  shield: { type: Number },                                           // 是否屏蔽消息
})

// 群消息表
var GroupMessageSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: 'Group' },             // 群ID
  userID: { type: Schema.Types.ObjectId, ref: 'User' },               // 发送者ID
  message: { type: String },                                          // 发送内容
  types: { type: Number },                                            // 内容类型 (0文字 1图片链接 2音频链接)
  time: { type: Date },                                               // 发送时间
})

module.exports = db.model('User', UserSchema)
module.exports = db.model('Friend', FriendSchema)
module.exports = db.model('Message', MessageSchema)
module.exports = db.model('Group', GroupSchema)
module.exports = db.model('GroupUser', GroupUserSchema)
module.exports = db.model('GroupMsg', GroupMessageSchema)