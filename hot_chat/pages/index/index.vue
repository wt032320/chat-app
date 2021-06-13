<template>
	<view class="content">
		<!-- 首页顶部栏 -->
		<view class="top-bar">
			<navigator :url="'/pages/userhome/userhome?id='+uid" hover-class="none" class="top-bar-left">
				<image :src="imgurl"></image>
			</navigator>

			<view class="top-bar-center">
				<image src="../../static/images/index/logo.png"></image>
			</view>

			<view class="top-bar-right">
				<view class="search" @tap="toSearch">
					<image src="../../static/images/index/search.png"></image>
				</view>
				<view class="add" @tap="toGroup">
					<image src="../../static/images/index/add.png"></image>
				</view>
			</view>
		</view>
		
		<!-- 消息列表 -->
		<view class="main">
			<view class="refresh" v-if="!refresh">
				<image src="../../static/images/index/refresh.png"></image>
				<view class="ref-title">下拉刷新</view>
			</view>
			<view class="none" v-if="noone">
				<image src="../../static/images/index/noone.png" mode="aspectFill"></image>
				<view class="no-title">你还没有好友</view>
				<view class="search-btn" @tap="toSearch">搜索好友</view>
			</view>
			<!-- 好友申请 -->
			<view class="apply" @tap="toRequest" v-if="requestData>0">
				<view class="friend-list">
					<view class="friend-list-left">
						<text class="tips">{{requestData}}</text>
						<image src="../../static/images/index/apply.png"></image>
					</view>
					<view class="friend-list-right">
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">{{changeTime(requestTime)}}</view>
						</view>
						<view class="message">茫茫人海，相聚便是缘分</view>
					</view>
				</view>
			</view>
			<!-- 消息 -->
			<view class="friends">
				<view class="friend-list" v-for="(item, index) in friends" :key="index" @tap="toChat(item)">
					<view class="friend-list-left">
						<text class="tips" v-if="item.tips>0">{{item.tips}}</text>
						<image :src="item.imgurl"></image>
					</view>
					<view class="friend-list-right">
						<view class="top">
							<view class="name">{{item.name}}</view>
							<view class="time">{{changeTime(item.lastTime)}}</view>
						</view>
						<view class="message">{{item.msg}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
  import myfun from '../../commons/js/myFun';

	export default {
		data() {
			return {
				friends: [],
				uid: '',  // 用户id
				imgurl: '', // 用户头像
				token: '',  // token
				myname: '',
				requestData: 0, // 申请数
				requestTime: '', // 最后申请时间
				refresh: false, // 下拉刷新状态
				noone: false, // 是否没有好友
			}
		},
		onLoad() {
			this.getStorages()
			this.friendRequest()
			this.getFriends()
			this.join(this.uid)
			this.receiveSocketMsg()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.friends = []
			this.getStorages()
			this.friendRequest()
			this.getFriends()
			setTimeout(function () {
					uni.stopPullDownRefresh()
			}, 1000)
		},
		methods: {
      changeTime: function (date) {
        return myfun.dataTime(date);
      },
			// 获取好友请求数据
			friendRequest: function() {
				uni.request({
					url: this.serverUrl + '/index/friends',
					data: {
						uid: this.uid,
						state: 1,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						this.refresh = true
						let status = data.data.status
						// 访问后端成功
						if(status == 200) {
							this.noone = false
							let res = data.data.result
							this.requestData = res.length
							if (res.length > 0) {
								this.requestTime = res[0].lastTime
								for (let i = 1; i < res.length; i++) {
									if(this.requestTime < res[i].lastTime) {
										this.requestTime = res[i].lastTime
									}
								}
							} else {
								this.noone = true
							}
							// console.log(res)
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
			// 获取好友数据
			getFriends: function() {
				uni.request({
					url: this.serverUrl + '/index/friends',
					data: {
						uid: this.uid,
						state: 0,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						this.refresh = true
						let status = data.data.status
						// 访问后端成功
						if(status == 200) {
							this.noone = false
							let res = data.data.result
							if (res.length > 0) {
								for (let i = 0; i < res.length; i++) {
									res[i].imgurl = this.serverUrl + res[i].imgurl
									if (res[i].markname) {
										res[i].name = res[i].markname
									}
									this.friends.push(res[i])
								}
								this.friends = myfun.sortArr(this.friends, 'lastTime', 0)
								// 获取好友信息
								for (let i = 0; i < this.friends.length; i++) {
									this.getMessage(this.friends, i)
									this.getUnread(this.friends, i)
								}
							} else {
								this.noone = true
							}
							// 群列表
							// this.getGroups()
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
			// 获取最后消息
			getMessage: function(arr, i) {
				uni.request({
					url: this.serverUrl + '/index/endmessage',
					data: {
						uid: this.uid,
						fid: arr[i].id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						// 访问后端成功
						if(status == 200) {
							let res = data.data.result
							if(res.types == 0) {
								// 文字类型消息
							} else if (res.types == 1) {
								// 图片
								res.message = '[图片]'
							} else if (res.types == 2) {
								// 音频
								res.message = '[语音消息]'
							} else if (res.types == 3) {
								// 位置
								res.message = '[位置]'
							} 
							let e = arr[i]
							e.msg = res.message
							arr.splice(i, 1, e)
							// console.log(res)
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
			// 获取未读消息数
			getUnread: function(arr, i) {
				uni.request({
					url: this.serverUrl + '/index/msgnumber',
					data: {
						uid: this.uid,
						fid: arr[i].id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						// 访问后端成功
						if(status == 200) {
							let res = data.data.result
							let e = arr[i]
							e.tips = res
							arr.splice(i, 1, e)
							// console.log(res)
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
			// 获取群列表
			getGroups: function() {
				uni.request({
					url: this.serverUrl + '/index/groups',
					data: {
						uid: this.uid,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						// 访问后端成功
						if(status == 200) {
							let res = data.data.result
							if (res.length > 0) {
								for (let i = 0; i < res.length; i++) {
									res[i].imgurl = this.serverUrl + res[i].imgurl
									this.friends.push(res[i])
								}
							}
							this.friends = myfun.sortArr(this.friends, 'lastTime', 0)
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
			// 获取缓存数据
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id
						this.imgurl = this.serverUrl + value.imgurl
						this.token = value.token
						this.myname = value.name
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
			// socket模块
			// 用户登录socket注册
			join: function(uid) {
				this.socket.emit('login', uid)
			},
			// socket聊天数据接收
			receiveSocketMsg: function() {
				this.socket.on('msg', (msg, fromid) => {
					let nmsg = ''
					if (msg.types == 0) {
						nmsg = msg.message
					} else if (msg.types == 1) {
						nmsg = '[图片]'
					} else if (msg.types == 2) {
						nmsg = '[语音消息]'
					} else if (msg.types == 3) {
						nmsg = '[位置信息]'
					} 
					
					for (let i = 0; i < this.friends.length; i++) {
						if (this.friends[i].id == fromid) {
							let e = this.friends[i]
							e.lastTime = new Date()
							e.msg = nmsg
							e.tips++
							// 删除原来数据项
							this.friends.splice(i, 1)
							// 插入消息到最顶部
							this.friends.unshift(e)
						}
					}
				})
			},
			// 跳转到好友请求页
			toRequest: function() {
				uni.navigateTo({
					url: '../friendrequest/friendrequest'
				})
			},
			// 跳转到搜索页面
			toSearch: function() {
				uni.navigateTo({
					url: '../search/search'
				})
			},
			// 跳转到聊天页
			toChat: function(data) {
				uni.navigateTo({
					url:'../chatroom/chatroom?id=' + data.id + '&name=' + data.name + '&type=' + data.type + '&imgurl=' + data.imgurl
				})
			},
			// 跳转到建群页面
			toGroup: function() {
				uni.navigateTo({
					url: '../group/group'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	.content {
		padding-bottom: $uni-spacing-col-base;
		.top-bar {
			background-color: rgba(255, 255, 255, 0.96);
			border-bottom: 1px solid $uni-border-color;
		}
		.main {
			padding-top: 104rpx;
		}
		.refresh {
			text-align: center;
			padding-top: 480rpx;
			image {
				width: 32rpx;
				height: 32rpx;
			}
			.ref-title {
				padding-top: 10rpx;
				font-size: $uni-font-size-base;
				color: rgba(39,40,50,0.4);
				line-height: 40rpx;
			}
		}
		.none {
			padding-top: 400rpx;
			text-align: center;
			image {
				width: 158rpx;
				height: 250rpx;
			}
			.no-title {
				padding-top: 32rpx 0;
				padding-bottom: 32rpx;
				font-size: $uni-font-size-base;
				color: rgba(39,40,50,0.4);
				line-height: 40rpx;
			}
			.search-btn {
				display: inline-block;
				width: 240rpx;
				height: 96rpx;
				background-color: $uni-color-primary;
				box-shadow: 0 52rpx 36rpx -32rpx rgba(255,228,49,0.4);
				border-radius: 48rpx;
				font-size: $uni-font-size-base;
				color: $uni-text-color;
				line-height: 96rpx;
			}
		}
		.friend-list {
			height: 96rpx;
			padding: 16rpx $uni-spacing-col-base;
		  &:active {
		    background-color: $uni-bg-color-grey;
		  }
			.friend-list-left {
				position: relative;
				float: left;
				image {
					width: 96rpx;
					height: 96rpx;
					border-radius: $uni-border-radius-base;
					background-color: $uni-color-primary;
				}
				.tips {
					z-index: 10;
					position: absolute;
					top: -8rpx;
					left: 68rpx;
					min-width: 20rpx;
					padding: 0 8rpx;
					height: 36rpx;
					background: $uni-color-warning;
					border-radius: 18rpx;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-inverse;
					line-height: 36rpx;
					text-align: center;
				}
			}
			.friend-list-right {
				padding-left: 128rpx;
				.top {
					height: 50rpx;
					.name {
						float: left;
						font-size: 36rpx;
						font-weight: 400;
						color: $uni-text-color;
						line-height: 50rpx;
					}
					.time {
						float: right;
						font-size: $uni-font-size-sm;
						color: $uni-text-color-disable;
						line-height: 50rpx;
					}
				}
				.message {
					font-size: $uni-font-size-base;
					color: $uni-text-color-grey;
					line-height: 40rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
			}
		}
	}
</style>
