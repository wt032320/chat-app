<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-div">
				<image src="../../static/images/search/search.png" class="search-img"></image>
				<input type="search" placeholder="搜索用户/群" class="search-info" placeholder-style="color:#aaa; font-weight:400" @input="search" />
			</view>
			<view class="top-bar-right">
				<view class="text" @tap="backOne">取消</view>
			</view>
		</view>
		<view class="main">
			<view class="search-user result">
				<view class="title" v-if="userarr.length>0">用户</view>
				<view class="list user" v-for="(item, index) in userarr" :key="index">
					<navigator :url="'/pages/userhome/userhome?id='+item._id" hover-class="none">
						<image :src="item.imgurl"></image>
					</navigator>
					<view class="names">
						<view class="name" v-html="item.name"></view>
						<view class="email" v-html="item.email"></view>
					</view>
					<view class="right-btn send" v-if="item.tip===1">发消息</view>
					<view class="right-btn add" v-if="item.tip===0" @tap="addFriend(item._id)">加好友</view>
				</view>
			</view>
		</view>
		<!-- 添加好友弹窗 -->
		<view class="modify" :style="{bottom:-+modifyHeight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close"  @tap="modifyCancel">取消</view>
				<view class="title">添加好友</view>
				<view class="define"  @tap="addSubmit">确定</view>
			</view>
			<view class="modify-main">
				<textarea v-model="msg" class="modify-content"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from "../../commons/js/datas.js"
	import myfun from "../../commons/js/myFun.js"

	export default {
		data() {
			return {
				userarr: [],
				token: '',
				uid: '',
				fid: '',
				myname: '',
				msg: '', // 添加好友信息
				animationData: {}, // 动画数据
				isModify: false, // 动画监听
				modifyHeight: '', // 页面高度
			}
		},
		onLoad: function() {
			this.getStorages()
		},
		onReady: function() {
			this.getElementStyle()
		},
		methods: {
			// 获取缓存数据
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id
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
		  search: myfun.debunce(function(e) {
				this.userarr = []
				let searchval = e.detail.value
				if (searchval.length > 0) {
					this.searchUser(searchval)
				}
			}, 500),
			// 寻找关键词匹配的用户
			searchUser: function(e) {
				uni.request({
					url: this.serverUrl + '/search/user',
					data: {
						data: e,
						token: this.token,
					},
					method: 'POST',
					success:(data) => {
						let status = data.data.status
						// 访问后端成功
						if (status == 200) {
							let arr = data.data.result
							for (let i = 0; i < arr.length; i++) {
								this.isFriend(arr[i], e)
							}
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
			// 判断是否为好友
			isFriend: function(arr, e) {
				let tip = 0 // 默认不是好友 为0
				let exp = eval("/" + e + "/g")
				if(arr._id == this.uid) {
					tip = 2
					arr.tip = tip
					arr.imgurl = this.serverUrl + arr.imgurl
					arr.name = arr.name.replace(exp, "<span style='color:#4AAAFF;'>" + e + "</span>")
					arr.email = arr.email.replace(exp, "<span style='color:#4AAAFF;'>" + e + "</span>")
					this.userarr.push(arr)
				} else {
					uni.request({
						url: this.serverUrl + '/search/isfriend',
						data: {
							uid: this.uid,
							fid: arr._id,
							token: this.token,
						},
						method: 'POST',
						success:(data) => {
							let status = data.data.status
							// 访问后端成功
							if (status == 200) {
								// 是好友
								tip = 1
							} else if(status == 400) {
								// 不是好友
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
							arr.tip = tip
							arr.imgurl = this.serverUrl + arr.imgurl
							arr.name = arr.name.replace(exp, "<span style='color:#4AAAFF;'>" + e + "</span>")
							arr.email = arr.email.replace(exp, "<span style='color:#4AAAFF;'>" + e + "</span>")
							this.userarr.push(arr)
						}
					})
				}
			},
			// 动态获取页面高度
			getElementStyle: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
				  this.modifyHeight = data.height
				}).exec();
			},
			// 修改项弹框
			modify: function(type, data, ispsw) {
				if (ispsw) {
					this.ispsw = 'block'					
				} else {
					this.ispsw = 'none'
				}
				if (type !== null) {
					this.modifyTitle = type
				}
				this.data = data
				this.isModify = !this.isModify
				var animation = uni.createAnimation({
					duration: 300,
					timingFunction: 'ease'
				})
				if (this.isModify) {
					animation.bottom(0).step()
				} else {
					animation.bottom(-this.modifyHeight).step()
				}
				this.animationData = animation.export()
			},
			
			// 取消修改
			modifyCancel: function () {
				this.modify()
			},
			
			// 添加好友按钮
			addFriend: function(fid) {
				this.msg = this.myname + ' 请求添加好友~'
				this.fid = fid
				this.modify()
			},
			// 确定添加好友
			addSubmit: function() {
				if (this.msg.length > 0) {
					this.modify()
					uni.request({
						url: this.serverUrl + '/friend/apply',
						data: {
							uid: this.uid,
							fid: this.fid,
							msg: this.msg,
							token: this.token,
						},
						method: 'POST',
						success:(data) => {
							let status = data.data.status
							// 访问后端成功
							if (status == 200) {
								uni.showToast({
									title: '好友请求发送成功！',
									icon: 'none',
									duration: 2000
								})
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
				}
			},
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	.top-bar {
		background-color: rgba(255, 255, 255, 0.96);
		border-bottom: 1px solid $uni-border-color;
		.search-div {
			box-sizing: border-box;
			padding-left: $uni-spacing-col-base;
			.search-info {
				padding: 0 60rpx 0 12rpx;
				width: 528rpx;
				height: 60rpx;
				background: $uni-bg-color-grey;
				border-radius: 10rpx;
			}
			.search-img {
				position: absolute;
				right: 130rpx;
				top: 22rpx;
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
	.main {
		padding: 88rpx $uni-spacing-col-base;
		.result {
			padding-top: $uni-spacing-col-base;
			.title {
				font-size: 44rpx;
				font-weight: 600;
				color: $uni-text-color;
				line-height: 60rpx;
			}
			.list {
				width: 100%;
				height: 80rpx;
				padding: 20rpx 0;
				image {
					float: left;
					width: 80rpx;
					height: 80rpx;
					border-radius: $uni-border-radius-base;
				}
				.names {
					float: left;
					padding-left: $uni-spacing-col-base;
					.name {
						font-size: 36rpx;
						color: $uni-text-color;
						line-height: 50rpx;
					}
					.email {
						font-size: $uni-font-size-sm;
						color: $uni-text-color;
						line-height: 28rpx;
					}
				}
				.right-btn {
					float: right;
					width: 120rpx;
					height: 48rpx;
					border-radius: 24rpx;
					font-size: $uni-font-size-sm;
					line-height: 48rpx;
					margin-top: 16rpx;
					text-align: center;
				}
				.send {
					background: $uni-color-primary;
					color: $uni-text-color;
				}
				.add {
					background: rgba(74, 170, 255, 0.1);
					color: $uni-color-success;
				}
			}		
		}
	}
	// 修改内容弹框
	.modify {
		position: fixed;
		z-index: 1002;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
		.modify-header {
			width: 100%;
			height: 88rpx;
			padding-top: var(--status-bar-height);
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid $uni-border-color;
			.close {
				padding-left: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
			.title {
				font-size: 48rpx;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.define {
				padding-right: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-color-success;
				line-height: 44rpx;
			}
		}
		.modify-main {
			display: flex;
			flex-direction: column;
			padding: $uni-spacing-col-base;
			.modify-psw {
				margin-bottom: $uni-spacing-col-base;
				box-sizing: border-box;
				padding: 0 20rpx;
				width: 100%;
				flex: auto;
				height: 88rpx;
				background: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.modify-content {
				box-sizing: border-box;
				padding: 16rpx 20rpx;
				flex: auto;
				width: 100%;
				height: 386rpx;
				padding: 16rpx 20rpx;
				background: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
		}
	}
</style>
