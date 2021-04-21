<template>
	<view class="content">
		<!-- 首页顶部栏 -->
		<view class="top-bar">
			<view class="top-bar-left">
				<image src="../../static/images/test_imgs/two.png"></image>
			</view>

			<view class="top-bar-center">
				<image src="../../static/images/index/logo.png"></image>
			</view>

			<view class="top-bar-right">
				<view class="search">
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
				<view class="friend-list">
					<view class="friend-list-left">
						<text class="tips">1</text>
						<image src="../../static/images/test_imgs/four.png"></image>
					</view>
					<view class="friend-list-right">
						<view class="top">
							<view class="name">小耿OvO</view>
							<view class="time">14:23</view>
						</view>
						<view class="message">我是沙口，哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈！</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.top-bar {
		box-sizing: border-box;
		z-index: 1001;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: $uni-bg-color;
		box-shadow: 0px 1px 0px 1px rgba(0, 0, 0, 0.1);
		.top-bar-left {
			padding-left: $uni-spacing-col-base;
			image {
				margin-top: 10rpx;
				width: 68rpx;
				height: 68rpx;
				border-radius: 16rpx;
			}
		}
		.top-bar-center {
			margin-left: 80rpx;
			image {
				width: 88rpx;
				height: 42rpx;
			}
		}
		.top-bar-right {
			padding-right: 14rpx;
			.search {
				width: 88rpx;
				height: 88rpx;
				display: inline-block;
			}
			.add {
				width: 88rpx;
				height: 88rpx;
				display: inline-block;
			}
			image {
				padding: 18rpx 0 0 18rpx;
				width: 52rpx;
				height: 52rpx;
			}
		}
	}
	.main {
		padding: 88rpx $uni-spacing-col-base 0;
	}
	.friend-list {
		height: 96rpx;
		padding: 16rpx 0;
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
				top: -6rpx;
				left: 68rpx;
				min-width: 36rpx;
				height: 36rpx;
				background: $uni-color-warning;
				border-radius: $uni-border-radius-circle;
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
</style>
