/**
 * @description: 连接数据库
 * @param {*}
 * @return {*}
 */

var mongoose = require('mongoose')

var db = mongoose.createConnection('mongodb://localhost:27017/hot_chat', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }) 

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.info('链接到数据库hot_chat')
})

module.exports = db