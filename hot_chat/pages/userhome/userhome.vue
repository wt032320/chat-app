<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/common/back.png" class="back-img"></image>
			</view>
			<view class="top-bar-right" @tap="toDetial">
				<view class="more-img" v-if="relation == 0 || relation == 1">
					<image src="../../static/images/userhome/more.png"></image>
				</view>
			</view>
		</view>
		<view class="bg">
			<view class="bg-bai" :animation="animationData4"></view>
			<image :src="user.imgurl" class="bg-img" mode="aspectFill"></image>
		</view>
		<view class="mian">
			<view class="user-header">
				<view class="sex" :style="{background:sexBg}" :animation="animationData3">
					<image :src="seximg"></image>
				</view>
				<image :src="user.imgurl" mode="aspectFill" class="user-img" :animation="animationData2"></image>
			</view>
			<view class="user-info">
				<view class="name">{{markname}}</view>
				<view class="nick">昵称：{{user.name}}</view>
				<view class="sign">{{user.explain}}</view>
			</view>
		</view>
		<view class="bottom-bar">
			<view class="bottom-btn btn1" @tap="addFriend" v-if="relation == 2">加为好友</view>
			<view class="bottom-btn btn1" v-if="relation == 1">发送消息</view>
		</view>
		
		<!-- 添加好友弹框 -->
		<view class="add-message" :style="{height:addHeight+'px',bottom:-+addHeight+'px'}" :animation="animationData">
			<view class="name">{{user.name}}</view>
			<textarea v-model="msg" maxlength="120" class="add-main"></textarea>
		</view>
		<view class="add-bt bottom-bar" :animation="animationData1">
			<view class="close btn1" @tap="addFriendAnimat">取消</view>
			<view class="send btn1" @tap="addSubmit">发送</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '', // 对象
				uid: '', // 用户id
				myname: '',
				markname: '',
				token: '',
				user: {},
				msg: '', // 请求信息
				seximg: '../../static/images/userhome/asexual.png',   // 性别符号
 				sexBg: 'rgba(39, 40, 50, 1)',
				relation: '', // 用户关系 0: 你自己  1: 好友 2: 陌生人
				addHeight: '', // 页面高度
				animationData: {}, // 动画数据
				animationData1: {}, // 动画数据
				animationData2: {}, // 动画数据
				animationData3: {}, // 动画数据
				animationData4: {}, // 动画数据
				isAdd: false, // 动画监听
			};
		},
		onLoad: function(e) {
			this.id = e.id
			this.getStorages()
			this.getUser()
			this.judgeFriend()
		},
		onReady: function(){
			this.getElementStyle()
		},
		methods: {
			// 获取缓存数据
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id
						this.myname = value.name
						this.token = value.token
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
			// 获取用户信息
			getUser: function() {
				uni.request({
					url: this.serverUrl + '/user/detial',
					data: {
						id: this.id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						// 访问后端成功
						if(status == 200) {
							let res = data.data.result
							// 处理头像链接
							res.imgurl = this.serverUrl + res.imgurl
							// 处理简介
							if(res.explain == undefined) {
								res.explain = '这个人很懒，什么也没有留下~'
							}
							// 处理markname
							if(this.markname.length == 0) {
								this.markname = res.name
							}
							this.sexJudge(res.sex)
							this.user = res
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
			// 性别判断
			sexJudge: function(e) {
				if (e == 'female') {
					this.seximg = '../../static/images/userhome/female.png'
					this.sexBg = 'rgba(255, 93, 91, 1)'
				} else if (e == 'male') {
					this.seximg = '../../static/images/userhome/male.png'
					this.sexBg = 'rgba(87, 153, 255, 1)'
				} else {
					this.seximg = '../../static/images/userhome/asexual.png'
					this.sexBg = 'rgba(39, 40, 50, 1)'
				}
			},
			// 判断用户关系
			judgeFriend: function() {
				if(this.id == this.uid) {
					this.relation = 0
				} else {
					// 如果不是自己,进行后端验证
					uni.request({
						url: this.serverUrl + '/search/isfriend',
						data: {
							uid: this.uid,
							fid: this.id,
							token: this.token,
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
							// 访问后端成功
							if(status == 200) {
								// 好友
								this.relation = 1
								this.getMarkname()
							} else if (status == 400) {
								// 陌生人
								this.relation = 2
							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错啦！',
									icon: 'none',
									duration: 2000
								})
							}
						}
					})
				}
			},
			// 获取好友昵称
			getMarkname: function() {
				uni.request({
					url: this.serverUrl + '/friend/getname',
					data: {
						uid: this.uid,
						fid: this.id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						// 访问后端成功
						if(status == 200) {
							let res = data.data.result
							if(res.markname != undefined) {
								this.markname = res.markname
							}
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							})
						}
					}
				})
			},
			// 返回上一页
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 跳转到详细信息页
			toDetial: function() {
				uni.navigateTo({
					url: '../userdetials/userdetials?id=' + this.id
				})
			},
			// 动态获取页面高度
			getElementStyle: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.bg').boundingClientRect(data => {
				  this.addHeight = data.height - 186
				}).exec();
			},
			// 添加好友动画
			addFriendAnimat: function() {
				this.isAdd = !this.isAdd;
				var animation = uni.createAnimation({
					duration: 300, // 动画持续时间
					timingFunction: 'ease', // 定义动画的效果
				})
				var animation1 = uni.createAnimation({
					duration: 300, // 动画持续时间
					timingFunction: 'ease', // 定义动画的效果
				})
				var animation2 = uni.createAnimation({
					duration: 300, // 动画持续时间
					timingFunction: 'ease', // 定义动画的效果
				})
				var animation3 = uni.createAnimation({
					duration: 300, // 动画持续时间
					timingFunction: 'ease', // 定义动画的效果
				})
				var animation4 = uni.createAnimation({
					duration: 300, // 动画持续时间
					timingFunction: 'ease', // 定义动画的效果
				})
				if (this.isAdd) {
					animation.bottom(0).step()
					animation1.bottom(0).step()
					animation2.width(120).height(120).step()
					animation3.opacity(0).step()
					animation4.backgroundColor('rgba(255, 228, 49, 0.6)').step()
				} else {
					animation.bottom(-this.addHeight).step()
					animation1.bottom(-100).step()
					animation2.width().height().step()
					animation3.opacity(1).step()
					animation4.backgroundColor('rgba(255, 228, 69, 0)').step()
				}
				this.animationData = animation.export()
				this.animationData1 = animation1.export()
				this.animationData2 = animation2.export()
				this.animationData3 = animation3.export()
				this.animationData4 = animation4.export()
			},
			// 添加好友按钮
			addFriend: function() {
				this.msg = this.myname + ' 请求添加好友~'
				this.addFriendAnimat()
			},
			// 确定添加好友
			addSubmit: function() {
				if (this.msg.length > 0) {
					this.addFriendAnimat()
					uni.request({
						url: this.serverUrl + '/friend/apply',
						data: {
							uid: this.uid,
							fid: this.id,
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
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	.bg {
		position: fixed;
		z-index: -2;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		.bg-bai {
			width: 100%;
			height: 100%;
		}
		.bg-img {
			opacity: 0.4;
			position: absolute;
			z-index: -1;
			left: -10rpx;
			top: -10rpx;
			width: 110%;
			height: 110%;
			filter: blur(20px); // CSS3处理图片模糊
		}
	}
	.mian {
		text-align: center;
		padding-top: 240rpx;
		.user-header {
			position: relative;
			width: 412rpx;
			height: 412rpx;
			margin: 0 auto;
			.sex {
				z-index: 11;
				position: absolute;
				bottom: 22rpx;
				right: 22rpx;
				width: 64rpx;
				height: 64rpx;
				border-radius: $uni-border-radius-circle;
				image {
					padding: 16rpx;
					width: 32rpx;
					height: 32rpx;
				}
			}
			.user-img {
				z-index: 10;
				top: 0;
				width: 400rpx;
				height: 400rpx;
				border-radius: 48rpx;
				border: 6rpx solid rgba(255, 255, 255, 1);
				box-shadow: 0rpx 36rpx 40rpx 0rpx rgba(39, 40, 50, 0.1);
			}
		}
		.user-info {
			padding-top: 42rpx;
			.name {
				font-size: 52rpx;
				color: $uni-text-color;
				line-height: 74rpx;
			}
			.nick {
				font-size: $uni-font-size-base;
				line-height: 40rpx;
				color: $uni-text-color;
			}
			.sign {
				padding: 20rpx 100rpx;
				font-size: $uni-font-size-base;
				font-weight: 300;
				color: $uni-text-color;
				line-height: 48rpx;
			}
		}
	}
	.bottom-bar {
		.bottom-btn {
			background: $uni-color-primary;
			margin: 0 $uni-spacing-col-base;
		}
	}

	.add-message {
		position: fixed;
		width: 100%;
		box-sizing: border-box;
		padding: 0 56rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		.name {
			padding: 168rpx 0 40rpx;
			font-size: 52rpx;
			color: $uni-text-color;
			line-height: 74rpx;
		}
		.add-main {
			box-sizing: border-box;
			width: 100%;
			height: 420rpx;
			padding: 18rpx 22rpx;
			border-radius: $uni-border-radius-base;
			background: $uni-bg-color-grey;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
		}
	}
	.add-bt {
		z-index: 100;
		bottom: -200rpx;
		display: flex;
		.close {
			width: 172rpx;
			background: $uni-bg-color-hover;
			margin-left: $uni-spacing-col-base;
		}
		.send {
			margin:0 $uni-spacing-col-base;
			flex: auto;
			background: $uni-color-primary;
		}
	}
</style>
