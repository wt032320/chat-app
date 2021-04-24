<template>
	<view class="content">
		<!-- 首页顶部栏 -->
		<view class="top-bar">
			<navigator url="/pages/userhome/userhome?id=aaa" hover-class="none" class="top-bar-left">
				<image src="../../static/images/test_imgs/two.png"></image>
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
			<view class="apply">
				<view class="friend-list">
					<view class="friend-list-left">
						<text class="tips">1</text>
						<image src="../../static/images/index/apply.png"></image>
					</view>
					<view class="friend-list-right">
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">14:23</view>
						</view>
						<view class="message">茫茫人海，相聚便是缘分</view>
					</view>
				</view>
			</view>
			<!-- 消息 -->
			<view class="friends">
				<view class="friend-list" v-for="(item, index) in friends" :key="index">
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
				friends: []
			}
		},
		onLoad() {
      this.getFriends()
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
			// 跳转到搜索页面
			toSearch: function() {
				uni.navigateTo({
					url: '../search/search'
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
