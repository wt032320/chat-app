<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/common/back.png" class="back-img"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">
					好友请求
				</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
			</view>
		</view>
		<view class="main">
			<view class="requester" v-for="(item,index) in requesters" :key="index">
				<view class="request-top">
					<view class="reject btn" @tap="refuse(item.id)">拒绝</view>
					<view class="header-img">
						<image :src="item.imgurl"></image>
					</view>	
					<view class="agree btn" @tap="agree(item.id)">同意</view>
				</view>
				
				<view class="request-center">
					<view class="title">{{item.name}}</view>
					<view class="time">{{changeTime(item.lastTime)}}</view>
				</view>
				
				<view class="notic">
					<text>留言：</text>
					{{item.msg}}
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
				requesters: [], // 好友请求数据
				uid: '',  // 用户id
				myname: '',
				token: '',  // token
			};
		},
		onLoad() {
			this.getStorages()
			this.friendRequest()
		},
		// 获取时间修改
		methods: {
			changeTime: function (date) {
			  return myfun.dataTime(date);
			},
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
			// 好友申请列表数据
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
						let status = data.data.status
						// 访问后端成功
						if(status == 200) {
							let res = data.data.result
							for (let i = 0; i < res.length; i++) {
								res[i].imgurl = this.serverUrl + '/user/' + res[i].imgurl
								this.getMessage(res, i)
							}
							this.requesters = res
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
			// 获取留言
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
							let e = arr[i]
							e.msg = res.message
							arr.splice(i, 1, e)
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
			// 拒绝好友申请
			refuse: function(fid) {
				uni.request({
					url: this.serverUrl + '/friend/delete',
					data: {
						uid: this.uid,
						fid: fid,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						// 访问后端成功
						if(status == 200) {
							for (let i = 0; i < this.requesters.length; i++) {
								if (this.requesters[i].id == fid) {
									this.requesters.splice(i, 1)
								}
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
			// 同意好友申请
			agree: function(fid) {
				uni.request({
					url: this.serverUrl + '/friend/newstate',
					data: {
						uid: this.uid,
						fid: fid,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						// 访问后端成功
						if(status == 200) {
							for (let i = 0; i < this.requesters.length; i++) {
								if (this.requesters[i].id == fid) {
									this.requesters.splice(i, 1)
								}
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
			// 返回上一页
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
	.content {
		padding-bottom: $uni-spacing-col-base;
	}
	.top-bar {
		background-color: rgba(255, 255, 255, 0.96);
		border-bottom: 1px solid $uni-border-color;
	}
	.main {
		padding: 108rpx $uni-spacing-row-base $uni-spacing-col-base;
		.requester {
			margin-top: 112rpx;
			padding: $uni-spacing-col-base;
			background: rgba(255,255,255,1);
			box-shadow: 0 24rpx 64rpx -8rpx rgba(0,0,0,0.1);
			border-radius: $uni-border-radius-base;
			.request-top {
				display: flex;
				justify-content: space-between;
				.btn {
					text-align: center;
					width: 160rpx;
					height: 64rpx;
					border-radius: $uni-border-radius-lg;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 64rpx;
				}
				.reject {
					color: $uni-color-warning;
					background: rgba(255,93,92,0.1);
				}
				.agree {
					color: $uni-text-color;
					background: $uni-color-primary;
				}
				.header-img {
					margin-top: -104rpx;
					image {
						width: 144rpx;
						height: 144rpx;
						border-radius: $uni-border-radius-circle;
						background-color: $uni-color-primary;
					}
				}
			}
			.request-center {
				text-align: center;
				padding-top: 20rpx;
				padding-bottom: 40rpx;
				.title {
					font-size: 36rpx;
					font-weight: 500;
					color: $uni-text-color;
					line-height: 50rpx;
				}
				.time {
					font-size: $uni-font-size-sm;
					color: $uni-text-color-disable;
					line-height: 34rpx;
				}
			}
			.notic {
				padding: $uni-spacing-row-sm $uni-spacing-col-base;
				border-radius: $uni-border-radius-base;
				background-color: $uni-bg-color-grey;
				font-size: $uni-font-size-base;
				color: $uni-text-color;
				line-height: 40rpx;
			}
		}
	}
	
</style>
