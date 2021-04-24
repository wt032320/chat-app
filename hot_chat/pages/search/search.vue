<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-div">
				<image src="../../static/images/search/search.png" class="search-img"></image>
				<input type="search" placeholder="搜索用户/群" class="search-info" placeholder-style="color:#aaa; font-weight:400" @input="searchInfo" />
			</view>
			<view class="top-bar-right">
				<view class="text" @tap="backOne">取消</view>
			</view>
		</view>
		<view class="main">
			<view class="search-user result">
				<view class="title" v-if="userarr.length>0">用户</view>
				<view class="list user" v-for="(item, index) in userarr" :key="index">
					<navigator url="/pages/userhome/userhome?id=aaa" hover-class="none">
						<image :src="item.imgurl"></image>
					</navigator>
					<view class="names">
						<view class="name" v-html="item.name"></view>
						<view class="email" v-html="item.email"></view>
					</view>
					<view class="right-btn send" v-if="item.tip===1">发消息</view>
					<view class="right-btn add" v-if="item.tip===0">加好友</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from "../../commons/js/datas.js"
	export default {
		data() {
			return {
				userarr: [],
			}
		},
		methods: {
			// 获取关键词
			searchInfo: function(e) {
				this.userarr = []
				let searchval = e.detail.value
				if (searchval.length > 0) {
					this.searchUser(searchval)
				}
			},
			// 寻找关键词匹配的用户
			searchUser: function(e) {
				let arr = datas.friends() // 模拟后端返回的用户信息表
				let exp = eval("/" + e + "/g")
				for (let i = 0; i < arr.length; i++) {
					if(arr[i].name && arr[i].email) {
						if(arr[i].name.search(e) != -1 || arr[i].email.search(e) != -1) {
							this.isFriend(arr[i])
							arr[i].imgurl = '../../static/images/test_imgs/' + arr[i].imgurl
							arr[i].name = arr[i].name.replace(exp, "<span style='color:#4AAAFF;'>" + e + "</span>")
							arr[i].email = arr[i].email.replace(exp, "<span style='color:#4AAAFF;'>" + e + "</span>")
							this.userarr.push(arr[i])
						}
					}
				}
			},
			// 判断是否为好友
			isFriend: function(e) {
				let tip = 0 // 默认不是好友 为0
				let arr = datas.isFiend() // 模拟后端返回的好友表
				for (let i = 0; i < arr.length; i++) {
					if (arr[i].friendid == e.id) {
						tip = 1
					}
				}
				e.tip = tip
			},
			// 返回首页
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
	.top-bar {
		background-color: rgba(255, 255, 255, 0.96);
		border-bottom: 1px solid $uni-border-color;
		.search-div {
			box-sizing: border-box;
			padding-left: $uni-spacing-col-base;
			.search-info {
				padding: 0 60rpx 0 12rpx;
				width: 528rpx;
				height: 60rpx;
				background: $uni-bg-color-grey;
				border-radius: 10rpx;
			}
			.search-img {
				position: absolute;
				right: 130rpx;
				top: 22rpx;
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
	.main {
		padding: 88rpx $uni-spacing-col-base;
		.result {
			padding-top: $uni-spacing-col-base;
			.title {
				font-size: 44rpx;
				font-weight: 600;
				color: $uni-text-color;
				line-height: 60rpx;
			}
			.list {
				width: 100%;
				height: 80rpx;
				padding: 20rpx 0;
				image {
					float: left;
					width: 80rpx;
					height: 80rpx;
					border-radius: $uni-border-radius-base;
				}
				.names {
					float: left;
					padding-left: $uni-spacing-col-base;
					.name {
						font-size: 36rpx;
						color: $uni-text-color;
						line-height: 50rpx;
					}
					.email {
						font-size: $uni-font-size-sm;
						color: $uni-text-color;
						line-height: 28rpx;
					}
				}
				.right-btn {
					float: right;
					width: 120rpx;
					height: 48rpx;
					border-radius: 24rpx;
					font-size: $uni-font-size-sm;
					line-height: 48rpx;
					margin-top: 16rpx;
					text-align: center;
				}
				.send {
					background: $uni-color-primary;
					color: $uni-text-color;
				}
				.add {
					background: rgba(74, 170, 255, 0.1);
					color: $uni-color-success;
				}
			}		
		}
	}
</style>
