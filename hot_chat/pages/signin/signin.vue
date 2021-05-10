<template>
	<view class="content">
		<!-- 登录头部 -->
		<view class="top-bar">
			<view class="top-bar-right" @tap="toRegist">
				<view class="text">注册</view>
			</view>
		</view>
		<!-- logo -->
		<view class="logo" @tap="testFun1">
			<image src="../../static/images/sign/logo1.png"></image>
		</view>
		
		<view class="main_content">
			<view class="title">登录</view>
			<view class="slogan">您好，欢迎来到 W.W!</view>
			<view class="inputs">
				<input type="text" v-model="user" placeholder="用户名/邮箱" class="user" placeholder-style="color:#aaa; font-weight:400" />
				<input type="password" v-model="psw" placeholder="密码" class="psw" placeholder-style="color:#aaa; font-weight:400" />
			</view>
			<view class="tip" :style="{display: islook}">输入用户名或密码错误</view>
		</view>
		<view class="submit" @tap="login">登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: '', // 用户名/邮箱
				psw: '', // 密码
				token: '',
				islook: 'none',
			}
		},
		onLoad: function(e) {
			if (e.user) {
				this.user = e.user
				uni.showToast({
					title: '注册成功请登录',
					icon: 'none',
					duration: 2000
				})
			} else if(e.name) {
				this.user = e.name
				uni.showToast({
					title: '登录过期请重新登录',
					icon: 'none',
					duration: 2000
				})
			} else if(e.cgpwd) {
				this.user = e.cgpwd
				uni.showToast({
					title: '登录过期请重新登录',
					icon: 'none',
					duration: 2000
				})
			}
		},
		methods: {
			// 跳转到注册页
			toRegist: function() {
				uni.navigateTo({
					url: '../regist/regist'
				})
			},
			// 登录提交
			login: function() {
				if (this.user && this.psw) {
					uni.request({
						url: this.serverUrl + '/login/match',
						data: {
							data: this.user,
							pwd: this.psw,
						},
						method: 'POST',
						success: (data) => {
							// console.log(data)
							let status = data.data.status
							if (status == 200) {
								// 登录成功
								this.islook = 'none'
								let res = data.data.back
								// 本地存储用户信息
								try {
								  uni.setStorageSync('user', { 'id': res.id, 'name': res.name, 'imgurl': res.imgurl, 'token': res.token });
								} catch (e) {
								  // error
									console.log('数据存储出错')
								}
								// 跳转到首页
								uni.navigateTo({
									url: '../index/index'
								})
							} else if (status == 400) {
								// 用户匹配失败
								this.islook = 'block'
								this.psw = ''
							} else if (status == 500) {
								// 服务器失败
								uni.showToast({
									title: '服务器出错啦!',
									icon: 'none',
									duration: 2000
								})
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	.top-bar {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.96);
		border-bottom: 1px solid $uni-border-color;
	}
	.logo {
		display: flex;
		justify-content: center;
		image {
			padding-top: 256rpx;
			width: 194rpx;
			height: 92rpx;
		}
	}
	.main_content {
		padding: 54rpx $uni-spacing-col-lg 120rpx;
		.title {
			font-size: 56rpx;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 80rpx;
		}
		.slogan {
			font-size: 40rpx;
			color: $uni-text-color-grey;
			line-height: 56rpx;
		}
		.inputs {
			padding-top: 8rpx;
			input {
				padding-top: 40rpx;
				height: 88rpx;
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
				border-bottom: 1px solid $uni-border-color;
			}
		}
		.tip {
			float: left;
			font-size: $uni-font-size-lg;
			color: $uni-color-warning;
			line-height: 56rpx;
		}
	}
	.submit {
		width: 520rpx;
		height: 96rpx;
		margin: 0 auto;
		background: $uni-color-primary;
		box-shadow: 0rpx 50rpx 32rpx -36rpx rgba(255, 228, 49, 0.4);
		border-radius: 48rpx;
		font-size: $uni-font-size-lg;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 96rpx;
		text-align: center;
	}
</style>
