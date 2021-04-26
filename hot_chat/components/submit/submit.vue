<template>
	<view>
		<view class="submit">
			<view class="submit-chat">
				<view class="bt-img">
					<image :src="toc" @tap="records"></image>
				</view>
				<textarea auto-height="true" class="chat-send btn" :class="{displaynone:isrecord}" @input="inputs" v-model="msg" @focus="focus"></textarea>
				<view class="record btn" :class="{displaynone:!isrecord}">按住说话</view>
				<view class="bt-img" @tap="emoji">
					<image src="../../static/images/submit/bq.png"></image>
				</view>
				<view class="bt-img">
					<image src="../../static/images/submit/tj.png"></image>
				</view>
			</view>
			<view class="emoji" :class="{displaynone:!isemoji}">
				<view class="emoji-send">
					<view class="emoji-send-det" @tap="emojiBack">
						<image src="../../static/images/submit/back.png"></image>
					</view>
					<view class="emoji-send-btn" @tap="emojiSend">发送</view>
				</view>
				<emoji @emotion="emotion" :height="260"></emoji>
			</view>
		</view>
	</view>
</template>

<script>
	import emoji from './emoji/emoji.vue'
	
	export default {
		name:"submit",
		components: { emoji },
		data() {
			return {
				isrecord: false, // 是否在录音
				isemoji: false, // 是否显示表情框
				toc: '../../static/images/submit/yy.png', // 语音 / 键盘图标
				msg: '', // 消息内容
				height: '', // 模块高度
			};
		},
		methods: {
			// 获取模块高度
			getElementHeight: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.submit').boundingClientRect(data => {
				  this.$emit('heights', data.height)
				}).exec();
			},
			// 点击切换为录音
			records: function() {
				if(this.isrecord) {
					this.isrecord = false
					this.toc = '../../static/images/submit/yy.png'
				} else {
					this.isrecord = true
					this.toc = '../../static/images/submit/jp.png'
				}
			},
			// 表情
			emoji: function () {
				this.isemoji = !this.isemoji
				setTimeout(()=> {
					this.getElementHeight()
				}, 10)
			},
			// 接收表情
			emotion: function(e) {
				this.msg = this.msg + e
			},
			// 回车发送
			inputs: function (e) {
				var chatm = e.detail.value
				var pos = chatm.indexOf('\n')
				if (pos !== -1 && chatm.length > 1) {
					this.$emit('inputs', this.msg)
					setTimeout(() => {
						this.msg = ''
					}, 0)
				}
			},
			// 输入框聚焦
			focus:function() {
				this.isemoji = false
				setTimeout(()=> {
					this.getElementHeight()
				}, 10)
			},
			// 按钮发送
			emojiSend:function() {
				if (this.msg.length > 0) {
					this.$emit('inputs', this.msg)
					setTimeout(() => {
						this.msg = ''
					}, 0)
				}
			},
			// 表情内退格
			emojiBack:function() {
				if (this.msg.length > 0) {
					this.msg = this.msg.substring(0, this.msg.length - 1)
				}
			},
		}
	}
</script>

<style lang="scss">
	.submit {
		background: rgba(244,244,244,0.96);
		border-top: 1px solid $uni-border-color;
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 100;
		padding-bottom: env(safe-area-inset-bottom);
		.submit-chat {
			width: 100%;
			display: flex;
			align-items: flex-end;
			box-sizing: border-box;
			padding: 14rpx 14rpx;
			image {
				flex: auto;
				width: 56rpx;
				height: 56rpx;
				margin: 0 10rpx;
			}
			.btn {
				flex: auto;
				padding: 20rpx;
				margin: 0 10rpx;
				background-color: #FFFFFF;
				border-radius: 10rpx;
				max-height: 160rpx;
			}
			.chat-send {
				line-height: 44rpx;
			}
			.record {
				line-height: 44rpx;
				text-align: center;
				font-size: $uni-font-size-lg;
				color: $uni-text-color-grey;
			}
		}
		.displaynone {
			display: none;
		}
		.emoji {
			width: 100%;
			height: 436rpx;
			background: rgba(236,237,238,1);
			box-shadow: 0rpx -1rpx 0rpx 0rpx rgba(0,0,0,0.1);
			.emoji-send {
				width: 300rpx;
				height: 104rpx;
				padding-top: 24rpx;
				background-color: rgba(236,237,238,0.9);
				position: fixed;
				bottom: env(safe-area-inset-bottom);
				right: 0;
				display: flex;
				.emoji-send-btn {
					flex: 1;
					margin: 0 32rpx 0 20rpx;
					height: 88rpx;
					background: rgba(255,228,49,1);
					font-size: 32rpx;
					text-align: center;
					line-height: 88rpx;
					border-radius: 12rpx;
				}
				.emoji-send-det {
					flex: 1;
					margin-left: 24rpx;
					height: 82rpx;
					background: #fff;
					font-size: 32rpx;
					text-align: center;
					line-height: 88rpx;
					border-radius: 12rpx;
					padding-top: 6rpx;
					image {
						width: 48rpx;
						height: 34rpx;
					}
				}
			}
		}
	}
</style>
