/**
 * @description: 连接数据库
 * @param {*}
 * @return {*}
 */

var mongoose = require('mongoose')

var db = mongoose.createConnection('mongodb://localhost:27017/hot_chat', { useNewUrlParser: true, useUnifiedTopology: true }) 

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.info('链接数据库test')
})

module.exports = db