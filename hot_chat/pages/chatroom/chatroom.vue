<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/common/back.png" class="back-img"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">
					{{fname}}
				</view>
			</view>
			<view class="top-bar-right" @tap="toDetials">
				<view class="more-img">
					<image src="../../static/images/userhome/more.png"></image>
				</view>
			</view>
		</view>
		<scroll-view class="chat" scroll-y="true" :scroll-with-animation="swanition" :scroll-into-view="scrollToView" @scrolltoupper="nextPage">
			<view class="chat-main" :style="{paddingBottom:inputh+'px'}">
				<view class="loading" :class="{displaynone:!isloading}">
					<image src="../../static/images/common/loading.png" class="loading-img" :animation="animationData"></image>
				</view>
				<view class="chat-ls" v-for="(item,index) in msgs" :key="index" :id="'msg' + item.id">
					<view class="chat-time" v-if="item.time!=''">{{changeTime(item.time)}}</view>
					<view class="msg-m msg-left" v-if="item.senderId !== uid">
						<image :src="item.imgurl" class="user-img"></image>
						<!-- 文字 -->
						<view class="message" v-if="item.types == 0">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<!-- 图片 -->
						<view class="message" v-if="item.types == 1">
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg(item.message)"></image>
						</view>
						<!-- 音频 -->
						<view class="message" v-if="item.types == 2">
							<view class="msg-text voice" :style="{width:item.message.time*4+'px'}" @tap="playVoice(item.message.voice)">
								<image src="../../static/images/chatroom/yy.png" class="voice-img"></image>
								{{item.message.time}}″
							</view>
						</view>
						<!-- 位置 -->
						<view class="message" v-if="item.types == 3">
							<view class="msg-map">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>
								<image src="../../static/images/chatroom/map.png" mode="aspectFit" class="map-img"></image>
								<!-- <map class="map" :longitude="item.message.longitude" :latitude="item.message.latitude" :markers="covers(item.message)"></map> -->
							</view>
						</view>
					</view>
					<view class="msg-m msg-right" v-if="item.senderId === uid">
						<image :src="item.imgurl" class="user-img"></image>
						<!-- 文字 -->
						<view class="message" v-if="item.types == 0">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<!-- 图片 -->
						<view class="message" v-if="item.types == 1">
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg(item.message)"></image>
						</view>
						<!-- 音频 -->
						<view class="message" v-if="item.types == 2">
							<view class="msg-text voice" :style="{width:item.message.time*4+'px'}" @tap="playVoice(item.message.voice)">
								{{item.message.time}}″
								<image src="../../static/images/chatroom/yy.png" class="voice-img"></image>
							</view>
						</view>
						<!-- 位置 -->
						<view class="message" v-if="item.types == 3">
							<view class="msg-map" @tap="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>
								<image src="../../static/images/chatroom/map.png" mode="aspectFit" class="map-img"></image>
								<!-- <map class="map" :longitude="item.message.longitude" :latitude="item.message.latitude" :markers="covers(item.message)"></map> -->
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<submit @inputs="inputs" @heights="heights"></submit>
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js'
	import myfun from '../../commons/js/myFun.js'
	import submit from '../../components/submit/submit.vue'
	
	// 音频播放
	const innerAudioContext = uni.createInnerAudioContext()
	
	export default {
		comments: { submit },
		data() {
			return {
				uid: '',
				token: '',
				uname: '',
				uimgurl: '',
				fid: '', // 好友id / 群id
				fname: '', // 好友名 / 群名
				fimgurl: '',
				type: '', // 标识是群聊天还是一对一聊天 0: 一对一   1: 群
				msgs: [], // 聊天数据
				imgMsg: [], // 图片消息数组
				scrollToView: '',
				oldTime: 0,
				inputh: '72',
				animationData: {}, // 动画数据
				pagesize: 10, // 一页条数
				nowpage: 0, // 页码
				loading: '', // 加载定时器
				isloading: false, // 加载转圈
				swanition: true,
				beginloading: true, // 是否开始加载 
			};
		},
		onLoad: function(e) {
			this.fid = e.id
			this.fname = e.name
			this.fimgurl = e.imgurl
			this.type = e.type
			this.getStorages()
			this.getMsg1()
			this.receiveSocketMsg()
		},
		methods: {
			// 获取缓存数据
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id
						this.token = value.token
						this.uimgurl = this.serverUrl + value.imgurl
						this.uname = value.name
					} else {
						// 如果没有用户缓存，跳转到登录页
						uni.navigateTo({
							url: '../siginin/siginin'
						})
					}
				} catch (e) {
				   // error
				}
			},
			// 返回上一页
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 跳转到详情页
			toDetials: function() {
				uni.navigateTo({
					url: '../userdetials/userdetials'
				})
			},
			// 滚动顶部加载下一页
			nextPage: function(){
				if (this.nowpage > 0 && this.beginloading) {
					// 出现转圈
					this.isloading = true
					
					// 禁止重复加载
					this.beginloading = false
					
					var animation = uni.createAnimation({
						duration: 1000,
						timingFunction: 'step-start',
					})
					this.animation = animation
							
					let i = 1
					this.loading = setInterval(function() {
						animation.rotate(i*30).step()
						this.animationData = animation.export()
						i++
						// 加载旧的聊天数据
						if (i > 20) {
							this.getMsg(this.nowpage)						
						}
					}.bind(this), 100)
				}
			},
			// 处理时间
			changeTime: function(date) {
				return myfun.dataTime1(date)
			},
			// 获取聊天数据
			getMsg1: function(page) {
				uni.request({
					url: this.serverUrl + '/chat/msg',
					data: {
						uid: this.uid,
						fid: this.fid,
						nowPage: this.nowpage,
						pageSize: this.pagesize,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						// 访问后端成功
						if(status == 200) {
							let msg = data.data.result
							// 将获得的数组倒序
							msg.reverse()
							if (msg.length > 0) {
								let oldtime = msg[0].time
								msg[0].imgurl = this.serverUrl + msg[0].imgurl
								let imgarr = []
								if (msg[0].types == 1) {
									msg[0].message = this.serverUrl + msg[0].message
									imgarr.push(msg[0].message)
								}
								for (let i = 1; i< msg.length; i++) {
									msg[i].imgurl = this.serverUrl + msg[i].imgurl
									// 时间间隔
									if (i < msg.length - 1) {
										let t = myfun.spaceTime(oldtime, msg[i].time)
										if (t) {
											oldtime = t
										}
										msg[i].time = t
									}
									// 匹配最大时间
									if(this.nowpage == 0) {
										if(msg[i].time > this.oldTime) {
											this.oldTime = msg[i].time
										}
									}
									// 补充图片消息地址
									if (msg[i].types === 1) {
										msg[i].message = this.serverUrl + msg[i].message
										imgarr.push(msg[i].message)
									}
									// json 字符串还原
									if (msg[i].types === 3) {
										msg[i].message = JSON.parse(msg[i].message)
									}
								}
								this.msgs = msg.concat(this.msgs)
								this.imgMsg = imgarr.concat(this.imgMsg) // 保存图片到预览数组
							}
							// 判断nowPage
							if (msg.length == 10) {
								// 页面加一
								this.nowpage++
							}else {
								// 数据获取完毕
								this.nowpage = -1
							}
							this.$nextTick(function(){
								this.swanition = false
								this.scrollToView = 'msg' + this.msgs[msg.length-1].id
							})
							clearInterval(this.loading)
							// 关闭转圈
							this.isloading = false
							
							// 开启加载
							this.beginloading = true
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							})
						} else if (status == 300) {
							// token过期
							// 跳到登陆页
							uni.navigateTo({
								url: '../siginin/siginin?name=' + this.myname
							})
						}
					}
				})
			},
			// 预览图片
			previewImg: function(e) {
				let index = 0 // 记录点击图片的位置
				for (let i = 0; i < this.imgMsg.length; i++) {
					if (this.imgMsg[i] == e) {
						index = i
					}
				}
				uni.previewImage({
					current: index,
					urls: this.imgMsg,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片')
						},
						fail: function(err) {
							console.log(err.errMsg)
						}
					}
				})
			},
			// 音频播放
			playVoice: function(e) {
				innerAudioContext.src = e
				innerAudioContext.play()
			},
			// 地图定位
			covers: function(e) {
				let mapdata = [{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../static/images/chatroom/dw.png',
				}]
				return mapdata
			},
			// 查看位置
			openLocation: function(e) {
				uni.openLocation({
						latitude: e.latitude,
						longitude: e.longitude,
						name: e.name,
						address: e.address,
						success: function () {
							// console.log('success');
						}
				})
			},
			// 接受消息内容
			inputs: function(e) {
				this.receiveMsg(e, this.uid, this.uimgurl, 0)
			},
			// 接受消息
			receiveMsg: function(e, id, img, tip) {
				// socket提交
				if (e.types == 0 || e.types == 3) {
					// 发送给后端
					this.sendSocket(e)
				}
				if (e.types == 1) {
					this.imgMsg.push(e.message)
					// 提交图片
					// 当前日期文件夹
					let url = myfun.fileTime(new Date())
					const uploadTask = uni.uploadFile({
						url: this.serverUrl + '/files/upload', 
						filePath: e.message,
						name: 'file',
						formData: {
								url: url,
								name: new Date().getTime()+ this.uid + Math.ceil(Math.random() * 10)
						},
						success: (uploadFileRes) => {
							let data = {
								message: uploadFileRes.data,
								types: e.types
							}
							this.sendSocket(data)
							// let path = this.serverUrl + uploadFileRes.data
							// this.img.push(path)
							// console.log(uploadFileRes.data);
						}
					});
							
					uploadTask.onProgressUpdate((res) => {
						// console.log('上传进度' + res.progress);
						// console.log('已经上传的数据长度' + res.totalBytesSent);
						// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
						
						// 测试条件，取消上传任务。
						// if (res.progress > 50) {
						// 		uploadTask.abort();
						// }
					});
				}
				if (e.types == 2) {
					// 提交音频
					// 当前日期文件夹
					let url = myfun.fileTime(new Date())
					const uploadTask = uni.uploadFile({
						url: this.serverUrl + '/files/upload', 
						filePath: e.message.voice,
						name: 'file',
						formData: {
								url: url,
								name: new Date().getTime()+ this.uid + Math.ceil(Math.random() * 10)
						},
						success: (uploadFileRes) => {
							console.log(uploadFileRes)
							let data = {
								message: uploadFileRes.data,
								types: e.types
							}
							this.sendSocket(data)
							// let path = this.serverUrl + uploadFileRes.data
							// this.img.push(path)
							// console.log(uploadFileRes.data);
						}
					});
							
					uploadTask.onProgressUpdate((res) => {
						// console.log('上传进度' + res.progress);
						// console.log('已经上传的数据长度' + res.totalBytesSent);
						// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
						
						// 测试条件，取消上传任务。
						// if (res.progress > 50) {
						// 		uploadTask.abort();
						// }
					});
				}
				// tip: 0  表示自己发的  tip: 1  服务器发的
				this.swanition = true
				let len = this.msgs.length
				let nowTime = new Date()
				// 时间间隔
				let t = myfun.spaceTime(this.oldTime, nowTime)
				if (t) {
					this.oldTime = t
				}
				nowTime = t
				if (e.types == 3) {
					e.message = JSON.parse(e.message)
				}
				// 接收的消息
				let amsg = {
					senderId: id, // 发送者id
					imgurl: img, // 用户头像
					message: e.message, // 用户消息
					types: e.types,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
					time: nowTime, // 发送时间
					id: len,
				}
				this.msgs.push(amsg)
				this.$nextTick(function(){
					this.scrollToView = 'msg' + len
				})
				
			},
			// 聊天数据发送后端
			sendSocket: function(e) {
				if (this.type == 0) {
					// 一对一聊天
					this.socket.emit('msg', e, this.uid, this.fid)
				} else {
					// 群消息
					this.socket.emit('groupmsg', e, this.uid, this.fid)
				}
			},
			// socket聊天数据接收
			receiveSocketMsg: function() {
				this.socket.on('msg', (msg, fromid, tip) => {
					if (fromid == this.fid && tip == 0) {
						this.swanition = true
						let len = this.msgs.length
						let nowTime = new Date()
						// 时间间隔
						let t = myfun.spaceTime(this.oldTime, nowTime)
						if (t) {
							this.oldTime = t
						}
						// 判断是否需要添加ip
						if (msg.types == 1 || msg.types == 2) {
							msg.message = this.serverUrl + msg.message
						}
						nowTime = t
						// 接收的消息
						let amsg = {
							senderId: fromid, // 发送者id
							imgurl: this.fimgurl, // 发送者头像
							message: msg.message, // 用户消息
							types: msg.types,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
							time: nowTime, // 发送时间
							id: len,
						}
						this.msgs.push(amsg)
						if (msg.types == 1) {
							this.imgMsg.push(msg.message)
						}
						this.$nextTick(function(){
							this.scrollToView = 'msg' + len
						})
					}
				})
			},
			// 输入框高度
			heights: function(e) {
				this.inputh = e
				this.goBottom()
			},
			// 滚动到底部
			goBottom: function() {
				this.swanition = true
				this.scrollToView = ''
				this.$nextTick(function(){
					let len = this.msgs.length - 1
					this.scrollToView = 'msg' + this.msgs[len].id
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	page {
		height: 100%;
	}
	.content {
		height: 100%;
		background-color: rgba(244, 244, 244, 0.96);
	}
	.top-bar {
		background-color: rgba(244, 244, 244, 1);
		border-bottom: 1px solid $uni-border-color;
	}
	.displaynone {
		display: none;
	}
	.chat {
		height: 100%;
		.loading {
			text-align: center;
			.loading-img {
				width: 60rpx;
				height: 60rpx;
			}
		}
		.chat-main {
			padding-left: $uni-spacing-col-base;
			padding-right: $uni-spacing-col-base;
			padding-top: 100rpx;
			font-display: flex;
			flex-direction: column;
			.chat-ls {
				.chat-time {
					font-size: $uni-font-size-sm;
					color: rgba(39,40,50,0.3);
					line-height: 34rpx;
					padding: 20rpx 0;
					text-align: center;
				}
				.msg-m {
					display: flex;
					padding: 20rpx 0;
					.user-img {
						width: $uni-img-size-sm;
						height: $uni-img-size-sm;
						border-radius: $uni-border-radius-base;
					}
					.message {
						max-width: 480rpx;
						.msg-text {
							font-size: $uni-font-size-lg;
							color: $uni-text-color;
							line-height: 44rpx;
							padding: 18rpx 24rpx;
						}
						.msg-img {
							max-width: 400rpx;
							border-radius: $uni-border-radius-base;
						}
						.voice {
							min-width: 80rpx;
							max-width: 400rpx;
							.voice-img {
								width: 28rpx;
								height: 36rpx;
							}
						}
						.msg-map {
							background: #fff;
							width: 464rpx;
							height: 284rpx;
							overflow: hidden;
							.map-name {
								font-size: $uni-font-size-lg;
								color: $uni-text-color;
								line-height: 44rpx;
								padding: 18rpx 24rpx 0 24rpx;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 1;
								overflow: hidden;
							}
							.map-address {
								font-size: $uni-font-size-sm;
								color: $uni-text-color-disable;
								padding: 0rpx 24rpx;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 1;
								overflow: hidden;
							}
							.map-img {
								padding-top: 8rpx;
								width: 480rpx;
								height: 180rpx;
							}
						}
					}
				}
				.msg-left {
					justify-content: flex-start;
					.msg-text {
						margin-left: 16rpx;
						background-color: #FFFFFF;
						border-radius: 0 20rpx 20rpx 20rpx;
					}
					.msg-img {
						margin-left: 16rpx;
					}
					.voice {
						text-align: right;
						.voice-img {
							float: left;
							transform: rotate(180deg);
							width: 28rpx;
							height: 36rpx;
							padding-bottom: 4rpx;
						}
					}
					.msg-map {
						margin-left: 16rpx;
						border-radius: 0 20rpx 20rpx 20rpx;
					}
				}
				.msg-right {
					flex-direction: row-reverse;
					justify-content: flex-start;
					.msg-text {
						margin-right: 16rpx;
						background-color: #fff260;
						border-radius: 20rpx 0rpx 20rpx 20rpx;
					}
					.msg-img {
						margin-right: 16rpx;
					}
					.voice {
						text-align: left;
						padding-top: 4rpx;
						.voice-img {
							float: right;
							width: 28rpx;
							height: 36rpx;
						}
					}
					.msg-map {
						margin-right: 16rpx;
						border-radius: 20rpx 0 20rpx 20rpx;
					}
				}
			}
		}
	}

</style>
