<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/common/back.png" class="back-img"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">
					小耿OvO
				</view>
			</view>
			<view class="top-bar-right" @tap="toDetials">
				<view class="more-img">
					<image src="../../static/images/userhome/more.png"></image>
				</view>
			</view>
		</view>
		<scroll-view class="chat" scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrollToView">
			<view class="chat-main" :style="{paddingBottom:inputh+'px'}">
				<view class="chat-ls" v-for="(item,index) in msgs" :key="index" :id="'msg' + item.tip">
					<view class="chat-time" v-if="item.time!=''">{{changeTime(item.time)}}</view>
					<view class="msg-m msg-left" v-if="item.id !== 'b'">
						<image :src="item.imgurl" class="user-img"></image>
						<view class="message" v-if="item.types == 0">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.types == 1">
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg(item.message)"></image>
						</view>
					</view>
					<view class="msg-m msg-right" v-if="item.id === 'b'">
						<image :src="item.imgurl" class="user-img"></image>
						<view class="message" v-if="item.types == 0">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.types == 1">
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg(item.message)"></image>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<submit @inputs="inputs" @heights="heights"></submit>
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js'
	import myfun from '../../commons/js/myFun.js'
	import submit from '../../components/submit/submit.vue'
	
	export default {
		comments: { submit },
		data() {
			return {
				msgs: [], // 聊天数据
				imgMsg: [], // 图片消息数组
				scrollToView: '',
				oldTime: new Date(),
				inputh: '60',
			};
		},
		onLoad: function() {
			this.getMsg()
		},
		methods: {
			// 返回上一页
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 跳转到详情页
			toDetials: function() {
				uni.navigateTo({
					url: '../userdetials/userdetials'
				})
			},
			// 处理时间
			changeTime: function(date) {
				return myfun.dataTime1(date)
			},
			// 获取聊天数据
			getMsg: function() {
				let msg = datas.messages()
				// 处理头像地址
				for (var i = 0; i< msg.length; i++) {
					msg[i].imgurl = '../../static/images/test_imgs/' + msg[i].imgurl
					// 时间间隔
					if (i < msg.length - 1) {
						let t = myfun.spaceTime(this.oldTime, msg[i].time)
						if (t) {
							this.oldTime = t
						}
						msg[i].time = t
					}
					// 补充图片消息地址
					if (msg[i].types === 1) {
						msg[i].message = '../../static/images/test_imgs/' + msg[i].message
						this.imgMsg.unshift(msg[i].message) // 保存图片到预览数组
					}
					this.msgs.unshift(msg[i])
				}
				this.$nextTick(function(){
					this.scrollToView = 'msg' + this.msgs[i-1].tip
				})
			},
			// 预览图片
			previewImg: function(e) {
				let index = 0 // 记录点击图片的位置
				for (let i = 0; i < this.imgMsg.length; i++) {
					if (this.imgMsg[i] == e) {
						index = i
					}
				}
				uni.previewImage({
					current: index,
					urls: this.imgMsg,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				})
			},
			// 接受消息内容
			inputs: function(e) {
				let len = this.msgs.length
				let amsg = {
					id: 'b', // 用户id
					imgurl: '../../static/images/test_imgs/one.png', // 用户头像
					message: e, // 用户消息
					types: 0,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
					time: new Date(), // 发送时间
					tip: len,
				}
				this.msgs.push(amsg)
				this.$nextTick(function(){
					this.scrollToView = 'msg' + len
				})
			},
			// 输入框高度
			heights: function(e) {
				this.inputh = e
				this.goBottom()
			},
			// 滚动到底部
			goBottom: function() {
				this.scrollToView = ''
				this.$nextTick(function(){
					let len = this.msgs.length - 1
					this.scrollToView = 'msg' + this.msgs[len].tip
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	page {
		height: 100%;
	}
	.content {
		height: 100%;
		background-color: rgba(244, 244, 244, 0.96);
	}
	.top-bar {
		background-color: rgba(244, 244, 244, 0.96);
		border-bottom: 1px solid $uni-border-color;
	}
	.chat {
		height: 100%;
		.chat-main {
			padding-left: $uni-spacing-col-base;
			padding-right: $uni-spacing-col-base;
			padding-top: 100rpx;
			font-display: flex;
			flex-direction: column;
			.chat-ls {
				.chat-time {
					font-size: $uni-font-size-sm;
					color: rgba(39,40,50,0.3);
					line-height: 34rpx;
					padding: 20rpx 0;
					text-align: center;
				}
				.msg-m {
					display: flex;
					padding: 20rpx 0;
					.user-img {

						width: $uni-img-size-sm;
						height: $uni-img-size-sm;
						border-radius: $uni-border-radius-base;
					}
					.message {
						max-width: 480rpx;
						.msg-text {
							font-size: $uni-font-size-lg;
							color: $uni-text-color;
							line-height: 44rpx;
							padding: 18rpx 24rpx;
						}
						.msg-img {
							max-width: 400rpx;
							border-radius: $uni-border-radius-base;
						}
					}
				}
				.msg-left {
					justify-content: flex-start;
					.msg-text {
						margin-left: 16rpx;
						background-color: #FFFFFF;
						border-radius: 0 20rpx 20rpx 20rpx;
					}
					.msg-img {
						margin-left: 16rpx;
					}
				}
				.msg-right {
					flex-direction: row-reverse;
					justify-content: flex-start;
					.msg-text {
						margin-right: 16rpx;
						background-color: #fff260;
						border-radius: 20rpx 0rpx 20rpx 20rpx;
					}
					.msg-img {
						margin-right: 16rpx;
					}
				}
			}
		}
	}

</style>
