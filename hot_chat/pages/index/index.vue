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
				<view class="add">
					<image src="../../static/images/index/add.png"></image>
				</view>
			</view>
		</view>
		
		<!-- 消息列表 -->
		<view class="main">
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
				<view class="friend-list" v-for="(item, index) in friends" :key="index" @tap="toChat">
					<view class="friend-list-left">
						<text class="tips" v-if="item.tips>0">{{item.tips}}</text>
						<image :src="item.imgurl"></image>
					</view>
					<view class="friend-list-right">
						<view class="top">
							<view class="name">{{item.name}}</view>
							<view class="time">{{changeTime(item.time)}}</view>
						</view>
						<view class="message">{{item.message}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
  import datas from '../../commons/js/datas';
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
			}
		},
		onLoad() {
      this.getFriends()
			this.getStorages()
			this.friendRequest()
		},
		methods: {
      changeTime: function (date) {
        return myfun.dataTime(date);
      },
			// 获取消息列表
      getFriends:function () {
        this.friends = datas.friends()
        for (let i = 0; i < this.friends.length; i++) {
          this.friends[i].imgurl = '../../static/images/test_imgs/' + this.friends[i].imgurl
        }
      },
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
							this.requestData = res.length
							if (res.length > 0) {
								this.requestTime = res[0].lastTime
								for (let i = 1; i < res.length; i++) {
									if(this.requestTime < res[i].lastTime) {
										this.requestTime = res[i].lastTime
									}
								}
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
			// 获取缓存数据
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id
						this.imgurl = this.serverUrl + '/user/' + value.imgurl
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
			toChat: function() {
				uni.navigateTo({
					url:'../chatroom/chatroom'
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
