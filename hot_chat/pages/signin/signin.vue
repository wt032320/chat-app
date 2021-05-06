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
				<input type="text" v-model="user" placeholder="用户名/邮箱" class="user" placeholder-style="color:#aaa; font-weight:400" @blur="getUser"/>
				<input type="password" placeholder="密码" class="psw" placeholder-style="color:#aaa; font-weight:400" @blur="getPassword"/>
			</view>
			<view class="tip">输入用户名或密码错误</view>
		</view>
		<view class="submit" @tap="testFun">登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: '', // 用户名/邮箱
				psw: '', // 密码
				token: '',
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
			}
		},
		methods: {
			// 跳转到注册页
			toRegist: function() {
				uni.navigateTo({
					url: '../regist/regist'
				})
			},
			// 获取用户名
			getUser: function(e) {
				this.user = e.detail.value
			},
			// 获取密码
			getPassword: function(e) {
				this.psw = e.detail.value
			},
			// 后端接口测试
			testFun: function() {
				uni.request({
					url: 'http://127.0.0.1:8081/friend/newstate',
					data: {
						uid: '60894f4fa04edb7a6496ee3b',
						fid: '608e9a9d2db50f6f14a6cc88',
						// msg: '桥本有菜',
						// data: '1476081727@qq.com',
						// type: 'email',
						// pwd: '333333'
					},
					method: 'POST',
					success: (data) => {
						// this.token = data.data.back.token
						console.log(data)
					}
				})
			},
			testFun1: function() {
				uni.request({
					url: 'http://127.0.0.1:8081/regist/judge',
					data: {
						data: '小虎',
						type: 'name',
					},
					method: 'POST',
					success: (data) => {
						// this.token = data.data.back.token
						console.log(data)
					}
				})
			},
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
