<template>
	<view class="contents">
		<!-- 注册头部 -->
		<view class="top-bar">
			<view class="top-bar-left" @tap="toSign">
				<image src="../../static/images/common/back.png" class="back-img"></image>
			</view>
		</view>
		<!-- logo -->
		<view class="logo">
			<image src="../../static/images/sign/logo1.png"></image>
		</view>
		
		<view class="main_content">
			<view class="title">注册</view>
			<view class="inputs">
				<view class="inputs-div">
					<input type="text" placeholder="请取个名字" class="username" placeholder-style="color:#aaa; font-weight:400" @input="getUser"/>
					<view class="employ" v-if="useremploy">已占用</view>
					<image src="../../static/images/sign/right1.png" class="ok" v-if="isuser"></image>
				</view>
				<view class="inputs-div">
					<input type="text" placeholder="请输入邮箱" class="useremail" placeholder-style="color:#aaa;font-weight:400" @input="isEmail"/>
					<view class="employ" v-if="emailemploy">已占用</view>
					<view class="invalid" v-if="invalid">邮箱无效</view>
					<image src="../../static/images/sign/right1.png" class="ok" v-if="isemail"></image>
				</view>
				<view class="inputs-div">
					<input :type="type" placeholder="这里输入密码" class="psw" placeholder-style="color:#aaa; font-weight:400" @input="getPsw"/>
					<image :src="lookurl" class="look" @tap="looks"></image>
				</view>
				
			</view>
		</view>
		<view :class="[{submit:isok}, {submit1:!isok}]">注册</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'password',
				isuser: true, // 用户名是否可用
				isemail: true, // 邮箱是否可用
				look: false, // 是否显示密码
				invalid: false, // 邮箱是否符合
				useremploy: false, // 用户名是否占有
				emailemploy: false,// 邮箱是否占有
				lookurl: '../../static/images/sign/biyan.png',
				isok: false,
				user: '', // 用户名
				email: '', // 邮箱
				psw: '', // 密码
			}
		},
		methods: {
			// 密码显示隐藏
			looks: function() {
				if (this.look) {
					this.type = 'password'
					this.look = !this.look
					this.lookurl = '../../static/images/sign/biyan.png'
				} else {
					this.type="text"
					this.look = !this.look
					this.lookurl = '../../static/images/sign/look.png'
				}
			},
			// 判断邮箱格式是否正确
			isEmail: function(e) {
				let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
				this.email = e.detail.value
				if (this.email.length > 0) {
					if(reg.test(this.email)) {
						this.invalid = false
					} else {
						this.invalid = true
					}
				}
				this.isOk()
			},
			// 跳转到登录页
			toSign: function() {
				uni.navigateTo({
					url: '../signin/signin'
				})
			},
			// 获取用户名
			getUser: function(e) {
				this.user = e.detail.value
				this.isOk()
			},
			// 获取密码
			getPsw: function(e) {
				this.psw = e.detail.value
				this.isOk()
			},
			// 判断该注册了
			isOk: function() {
				if (this.isuser && this.isemail && this.psw.length > 5) {
					this.isok = true
				} else {
					this.isok = false
				}
			}
		}
	}
</script>

<style lang="scss">
	.contents {
		padding-top: var(--status-bar-height);
	}
	.top-bar {
		z-index: 1001;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding-top: var(--status-bar-height);
		background-color: $uni-bg-color;
		.top-bar-left {
			padding-left: 32rpx;
			width: 88rpx;
			height: 88rpx;
			.back-img {
				margin-top: 21rpx;
				width: 26rpx;
				height: 46rpx;
			}
		}
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
		.inputs-div {
			position: relative;
		}
		.employ, .invalid {
			position: absolute;
			right: 0;
			top: 40rpx;
			font-size: $uni-font-size-base;
			font-weight: 500;
			color: $uni-color-warning;
			line-height: 88rpx;
		}
		.ok {
			position: absolute;
			right: 0;
			top: 76rpx;
			width: 38rpx;
			height: 30rpx;
		}
		.look {
			position: absolute;
			right: 0;
			top: 76rpx;
			width: 32rpx;
			height: 18rpx;
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
	.submit1 {
		width: 520rpx;
		height: 96rpx;
		margin: 0 auto;
		background: rgba(39, 40, 50, 0.2);
		border-radius: 48rpx;
		font-size: $uni-font-size-lg;
		font-weight: 500;
		color: $uni-text-color-inverse;
		line-height: 96rpx;
		text-align: center;
	}
</style>
