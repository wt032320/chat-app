<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/common/back.png" class="back-img"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">
					详细信息
				</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
			</view>
		</view>
		<view class="main">
			<view class="column heads">
				<view class="row head">
					<view class="title">头像</view>
					<view class="user-head">
						<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
							<image :src="cropFilePath" @tap="upload" class="user-img"></image>
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="row" @tap="modify('签名', dataarr.sign, false)">
					<view class="title">签名</view>
					<view class="cont">
						{{dataarr.sign}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="row">
					<view class="title">注册</view>
					<view class="cont">
						{{changeTime(dataarr.gdate)}}
					</view>
				</view>
			</view>
			<view class="column">
				<view class="row" @tap="modify('昵称', dataarr.name, false)">
					<view class="title">昵称</view>
					<view class="cont">
						{{dataarr.name}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="row">
					<view class="title">性别</view>
					<view class="cont">
						<picker @change="bindPickerChange" :value="index" :range="array">
							<view class="uni-input">{{array[index]}}</view>
						</picker>
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="row">
					<view class="title">生日</view>
					<view class="cont">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{date}}</view>
						</picker>
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">电话</view>
					<view class="cont">
						{{dataarr.tell}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">邮箱</view>
					<view class="cont" @tap="modify('邮箱', dataarr.mail, true)">
						{{dataarr.mail}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>	
			<view class="column">
				<view class="row">
					<view class="title">密码</view>
					<view class="cont">
						******
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<view class="btn2">退出登录</view>
		</view>
		<view class="modify" :style="{bottom:-+modifyHeight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close"  @tap="modify">取消</view>
				<view class="title">签名</view>
				<view class="define"  @tap="modifySubmit">确定</view>
			</view>
			<view class="modify-main">
				<input type="text" v-model="psw" class="modify-psw" placeholder="请输入原密码" placeholder-style="color:#aaa; font-weight:400" :style="{display:ispsw}"></input>
				<textarea v-model="data" class="modify-content"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import myfun from "@/commons/js/myFun.js";
	
	export default {
		components: { ImageCropper },
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				dataarr: {
					// 模拟数据
					sign: '我一直以为你是懂我的，懂我的臭脾气 懂我的小任性，直到你走的那一刻我才知道，你懂个屁 你从来就没懂过我 ，没懂我对你的爱 对你的占有欲，对你的口是心非。',
					name: '小耿OvO',
					gdate: new Date(),
					sex: '男',
					birth: '1998-12-21',
					tell: '13643213465',
					mail: '122131@163.com',
				}, 
				cropFilePath: '../../static/images/test_imgs/four.png', // 裁剪的图片
				array: ['男', '女', '未知'],
				index: 0, // 默认性别
				date: currentDate, // 日期
				tempFilePath: "", // 裁剪后的图片
				data: '修改的内容', // 修改的内容
				ispsw: 'none', // 是否显示密码输入框
				psw: '', // 原密码
				animationData: {}, // 动画数据
				isModify: false, // 动画监听
				modifyHeight: '', // 页面高度
				modifyTitle: '', // 弹出框标题
			};
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onReady: function() {
			this.getElementStyle()
		},
		methods: {
			// 返回上一页
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 处理时间
			changeTime: function (date) {
			  return myfun.detialTime(date);
			},
			// 性别选择器方法
			bindPickerChange: function(e) {
				this.index = e.target.value
			},
			// 日期选择器方法
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			// 获取日期
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
						year = year - 60;
				} else if (type === 'end') {
						year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
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
				uni.uploadFile({
					url: "后端地址上传图片接口地址",
					filePath: this.cropFilePath,
					name: "file",
					fileType: "image",
					//formData:{},传递参数
					success: (uploadFileRes) => {
						var backstr = uploadFileRes.data;
						//自定义操作
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
			
			// 动态获取页面高度
			getElementStyle: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
				  this.modifyHeight = data.height
				}).exec();
			},
			
			// 修改项弹框
			modify: function(type, data, ispsw) {
				if (ispsw) {
					this.ispsw = 'block'					
				} else {
					this.ispsw = 'none'
				}
				this.modifyTitle = type
				this.data = data
				this.isModify = !this.isModify
				var animation = uni.createAnimation({
					duration: 300,
					timingFunction: 'ease'
				})
				if (this.isModify) {
					animation.bottom(0).step()
				} else {
					animation.bottom(-this.modifyHeight).step()
				}
				this.animationData = animation.export()
			},
			
			// 弹框修改确定
			modifySubmit: function() {
				// 进行处理
				
				this.modify()
			}
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	.top-bar {
		background-color: rgba(255, 255, 255, 0.96);
		border-bottom: 1px solid $uni-border-color;
	}
	.main {
		padding-top: 118rpx;
		display: flex;
		flex-direction: column;
		.column {
			display: flex;
			flex-direction: column;
			padding-top: 12rpx;
			width: 100%;
			border-bottom: 1px solid $uni-border-color;
			.head {
				height: 148rpx;
				display: flex;
				align-items: center;
			}
			.row {
				display: flex;
				flex-direction: row;
				.title {
					flex: none;
					padding: 0 $uni-spacing-col-base;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 112rpx;
				}
				.user-head {
					flex: auto;
					.user-img {
						width: $uni-img-size-lg;
						height: $uni-img-size-lg;
						border-radius: $uni-border-radius-base;
					}
				}
				.cont {
					flex: auto;
					font-size: $uni-font-size-lg;
					color: $uni-text-color-grey;
					line-height: 112rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.more {
					flex: none;
					height: 112rpx;
					display: flex;
					align-items: center;
					image {
						width: 80rpx;
						height: 28rpx;
					}
				}
			}
		}
		.btn2 {
			margin-top: 160rpx;
			text-align: center;
			font-size: $uni-font-size-lg;
			color: $uni-color-warning;
			line-height: 88rpx;
		}
	}
	
	// 修改内容弹框
	.modify {
		position: fixed;
		z-index: 1002;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
		.modify-header {
			width: 100%;
			height: 88rpx;
			padding-top: var(--status-bar-height);
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid $uni-border-color;
			.close {
				padding-left: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
			.title {
				font-size: 48rpx;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.define {
				padding-right: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-color-success;
				line-height: 44rpx;
			}
		}
		.modify-main {
			display: flex;
			flex-direction: column;
			padding: $uni-spacing-col-base;
			.modify-psw {
				margin-bottom: $uni-spacing-col-base;
				box-sizing: border-box;
				padding: 0 20rpx;
				width: 100%;
				flex: auto;
				height: 88rpx;
				background: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.modify-content {
				box-sizing: border-box;
				padding: 16rpx 20rpx;
				flex: auto;
				width: 100%;
				height: 386rpx;
				padding: 16rpx 20rpx;
				background: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
		}
	}
</style>
