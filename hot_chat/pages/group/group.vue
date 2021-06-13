<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<view class="text">取消</view>
			</view>
			<view class="top-bar-center">
				<view class="title">
					创建群聊
				</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
			</view>
		</view>
		<view class="main">
			<view class="top">
				<!-- 群头像 -->
				<view class="group-img" >
					<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
					<image src="../../static/images/group/change.png" class="edit" @tap="upload"></image>
					<image :src="cropFilePath" class="g-img" @tap="upload"></image>
				</view>
				<!-- 群名称 -->
				<view class="group-name">
					<input type="text" v-model="name" class="group-name-input" placeholder="为群取个名字" placeholder-style="color:#aaa;"/>
				</view>
				<view class="title">用户</view>
			</view>
			
			<!-- 选择用户 -->
			<view class="friends">
				<view class="user" v-for="(item,index) in friends" :key="index" @tap="selectFriend(index)">
					<view class="selected" :class="{isselected:item.selected}">
						<image src="../../static/images/group/choose.png" v-if="item.selected" class="selected-img"></image>
					</view>
					<image class="user-img" :src="item.imgurl"></image>
					<view class="name">
						{{item.name}}
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar">
			<view class="bottom-btn btn1" :class="{unselect:select&&name.length>0}" @tap="submit">立即创建({{selectedNumber}})</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	export default {
		components: { ImageCropper },
		data() {
			return {
				uid: '',
				token: '',
				gimgurl: '/group/group.png',
				cropFilePath: '../../static/images/group/group.png', // 裁剪的图片
				tempFilePath: '', // 裁剪后的图片
				headimg: '', // 要上传的图片
				selectedNumber: 0, // 已选择好友数
				name: '', // 群名
				friends: [],  // 好友数组
				users: [], // 已选择好友id数组
			};
		},
		onLoad: function(){
			this.getStorages()
			this.selectedNum()
			this.getFriends()
		},
		computed: {
			// 是否选择好友
			select: function() {
				if (this.selectedNumber > 0) {
					return true
				} else {
					return false
				}
			}
		},
		methods: {
			// 获取缓存数据
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id
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
			// 返回上一页
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 头像裁剪
			upload() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ["album", "camera"], //从相册选择 或者拍照上传
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift();
					},
				});
			},
			confirm(e) {
				this.tempFilePath = "";
				this.cropFilePath = e.detail.tempFilePath;
				this.headimg = e.detail.tempFilePath;
				uni.uploadFile({
					url: this.serverUrl + '/files/upload',      //后端地址上传图片接口地址,
					filePath: this.headimg,
					name: "file",
					fileType: "image",
					formData:{
						url: 'group',
						name: this.uid + new Date().getTime(),
						token: this.token
					}, // 传递参数
					success: (uploadFileRes) => {
						let backstr = uploadFileRes.data;
						console.log(backstr)
						// 获取群头像名称
						this.gimgurl = backstr
					},
				
					fail(e) {
						console.log("this is errormes " + e.message);
					},
				});
			},
			cancel() {
				console.log('canceled')
				this.tempFilePath = "";
			},
			// 获取已选择个数
			selectedNum: function() {
				for (let i = 0; i < this.friends.length; i++) {
					if (this.friends[i].selected) {
						this.selectedNumber++
					}
				}
			},
			// 获取好友
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
						/* this.refresh = true */
						let status = data.data.status
						// 访问后端成功
						if(status == 200) {
							this.noone = false
							let res = data.data.result
							if (res.length > 0) {
								for (let i = 0; i < res.length; i++) {
									res[i].selected = false
									res[i].imgurl = this.serverUrl + res[i].imgurl
									if (res[i].markname) {
										res[i].name = res[i].markname
									}
									this.friends.push(res[i])
								}
							} else {
								// this.noone = true
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
			// 动态选择好友
			selectFriend: function(e) {
				if (this.friends[e].selected) {
					this.friends[e].selected = false
					this.selectedNumber--
				} else {
					this.friends[e].selected = true
					this.selectedNumber++
				}
			},
			// 创建提交
			submit: function() {
				// 符合条件提交
				if (this.select && this.name.length > 0) {
					this.users.push(this.uid) // 加入群主
					for (let i = 0; i < this.friends.length; i++) {
						if (this.friends[i].selected) {
							this.users.push(this.friends[i].id)
						}
					}
					uni.request({
						url: this.serverUrl + '/group/create',
						data: {
							uid: this.uid,
							token: this.token,
							name: this.name,
							imgurl: this.gimgurl,
							user: this.users,
						},
						method: 'POST',
						success: (data) => {
							/* this.refresh = true */
							let status = data.data.status
							// 访问后端成功
							if(status == 200) {
								uni.navigateTo({
									url: '../index/index'
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
			}
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	.top-bar {
		background-color: rgba(255, 255, 255, 1);
		border-bottom: 1px solid $uni-border-color;
	}
	.main {
		display: flex;
		flex-direction: column;
		.top {
			padding-top: 148rpx;
			position: fixed;
			background-color: #fff;
			width: 100%;
			z-index: 100;
		}
		.group-img {
			position: relative;
			margin: 0 auto;
			width: 196rpx;
			height: 196rpx;
			background-color: $uni-color-primary;
			box-shadow: 0 36rpx 40rpx 0 rgba(39, 40, 50, 0.1);
			border-radius: 40rpx;
			overflow: hidden;
			.g-img {
				width: 196rpx;
				height: 196rpx;
			}
			.edit {
				position: absolute;
				z-index: 10;
				top: 0;
				right: 0;
				left: 0;
				bottom: 0;
				margin: auto;
				width: 56rpx;
				height: 56rpx;
			}
		}
		.group-name {
			padding: 62rpx $uni-spacing-col-base 0;
			.group-name-input {
				height: 92rpx;
				background: $uni-bg-color-grey;
				border-radius: 46rpx;
				text-align: center;
				font-size: 32rpx;
				color: $uni-text-color;
			}
		}
		.title {
			padding: $uni-spacing-row-base $uni-spacing-col-base 20rpx;
			font-size: 44rpx;
			font-weight: 600;
			color: $uni-text-color;
			line-height: 60rpx;
		}
		.friends {
			padding: 600rpx $uni-spacing-col-base 100rpx;
			.user {
				display: flex;
				align-items: center;
				height: 120rpx;
				.selected {
					flex: none;
					width: 48rpx;
					height: 48rpx;
					margin-right: 32rpx;
					background: rgba(255, 228, 49, 0.5);
					border-radius: 24rpx;
					position: relative;
					.selected-img {
						position: absolute;
						left: 10rpx;
						top: 16rpx;
						width: 30rpx;
						height: 20rpx;
					}
				}
				.isselected {
					background: rgba(255, 228, 49, 1);
				}
				.user-img {
					flex: none;
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
				}
				.name {
					padding-left: 32rpx;
					font-size: 36rpx;
					color: $uni-text-color;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
			}
		}
	}
	.bottom-bar {
		background: rgba(250, 250, 250, 0.9);
		box-shadow: 0 1rpx 0 0 rgba(0, 0, 0, 0.25);
		.bottom-btn {
			background: $uni-bg-color-grey;
			margin: 0 $uni-spacing-col-base;
		}
		.unselect {
			background: $uni-color-primary;
		}
	}
</style>
