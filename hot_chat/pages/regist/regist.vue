<template>
	<view class="content">
		<!-- 注册头部 -->
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
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
					<input type="text" placeholder="请取个名字" class="username" placeholder-style="color:#aaa; font-weight:400" @blur="matchUser"/>
					<view class="employ" v-if="useremploy">已占用</view>
					<image src="../../static/images/sign/right1.png" class="ok" v-if="isuser"></image>
				</view>
				<view class="inputs-div">
					<input type="text" placeholder="请输入邮箱" class="useremail" placeholder-style="color:#aaa;font-weight:400" @blur="isEmail"/>
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
		<view :class="[{submit:isok}, {submit1:!isok}]" @tap="signUp">注册</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'password',
				isuser: false, // 用户名是否可用
				isemail: false, // 邮箱是否可用
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
		computed: {
			// 判断该注册了
			isOk: function() {
				let that = this
				if (that.isuser && that.isemail && that.psw.length > 5) {
					that.isok = true
				} else {
					that.isok = false
				}
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
						// 后端验证邮箱是否被占用
						this.matchEmail()
					} else {
						this.invalid = true
						this.emailemploy = false
						this.isemail = false
					}
				} else {
					this.invalid = false
					this.emailemploy = false
					this.isemail = false
					this.isOk
				}
				this.isOk
			},
			// 返回登录页
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 匹配邮箱
			matchEmail: function() {
				uni.request({
					url: this.serverUrl + '/regist/judge',
					data: {
						data: this.email,
						type: 'email',
					},
					method: 'POST',
					success: (data) => {
						// console.log(data)
						let status = data.data.status
						// 访问后端成功
						if(status == 200) {
							let res = data.data.result
							if (res > 0) {
								// 表示邮箱已存在
								this.emailemploy = true
								this.isemail = false
							} else {
								// 表示邮箱不存在
								this.emailemploy = false
								this.isemail = true
							}
							this.isOk
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
			// 匹配用户名
			matchUser: function(e) {
				this.user = e.detail.value
				if(this.user.length > 0) {
					uni.request({
						url: this.serverUrl + '/regist/judge',
						data: {
							data: this.user,
							type: 'name',
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
							// 访问后端成功
							if(status == 200) {
								let res = data.data.result
								if (res > 0) {
									// 表示用户名已存在
									this.useremploy = true
									this.isuser = false
								} else {
									// 表示用户不存在
									this.useremploy = false
									this.isuser = true
								}
								this.isOk
							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错啦！',
									icon: 'none',
									duration: 2000
								})
							}
						}
					})
				} else {
					this.useremploy = false
					this.isuser = false
					this.isOk
				}
			},
			// 获取密码
			getPsw: function(e) {
				this.psw = e.detail.value
				this.isOk
			},
			// 注册提交
			signUp: function() {
				if(this.isok) {
					uni.request({
						url: 'http://127.0.0.1:8081/regist/add',
						data: {
							name: this.user,
							mail: this.email,
							pwd: this.psw,
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
							if (status == 200) {
								// 注册成功跳转到登录页
								uni.navigateTo({
									url: '../signin/signin?user=' + this.user
								})
							} else if (status == 500) {
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
		justify-content: flex-start;
		align-items: center;
		background-color: $uni-bg-color;
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
