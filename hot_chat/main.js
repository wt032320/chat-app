import Vue from 'vue'
import App from './App'
// 引入socket模块
import io from'./components/socket/weapp.socket.io.js' 

Vue.config.productionTip = false

// 服务器地址
Vue.prototype.serverUrl = 'http://127.0.0.1:8081'

Vue.prototype.socket = io('http://127.0.0.1:8082')

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
