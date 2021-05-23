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
				<view class="user" v-for="(item,index) in user" :key="index" @tap="selectFriend(index)">
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
			<view class="bottom-btn btn1" :class="{unselect:select&&name.length>0}">立即创建({{selectedNumber}})</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	export default {
		components: { ImageCropper },
		data() {
			return {
				cropFilePath: '../../static/images/group/group.png', // 裁剪的图片
				tempFilePath: '', // 裁剪后的图片
				headimg: '', // 要上传的图片
				selectedNumber: 0, // 已选择好友数
				name: '', // 群名
				user: [
					{
						selected: false, // 是否选择
						imgurl:  '../../static/images/test_imgs/one.png',
						name: '你好呀呀呀',
					},
					{
						selected: true, // 是否选择
						imgurl:  '../../static/images/test_imgs/two.png',
						name: '小南0.0',
					},
					{
						selected: true, // 是否选择
						imgurl:  '../../static/images/test_imgs/three.png',
						name: '小耿OvO',
					},
					{
						selected: false, // 是否选择
						imgurl:  '../../static/images/test_imgs/four.png',
						name: '桃乃木香奈',
					},
					{
						selected: false, // 是否选择
						imgurl:  '../../static/images/test_imgs/one.png',
						name: '你好呀呀呀',
					},
					{
						selected: true, // 是否选择
						imgurl:  '../../static/images/test_imgs/two.png',
						name: '小南0.0',
					},
					{
						selected: true, // 是否选择
						imgurl:  '../../static/images/test_imgs/three.png',
						name: '小耿OvO',
					},
					{
						selected: false, // 是否选择
						imgurl:  '../../static/images/test_imgs/four.png',
						name: '桃乃木香奈',
					},
					{
						selected: false, // 是否选择
						imgurl:  '../../static/images/test_imgs/one.png',
						name: '你好呀呀呀',
					},
					{
						selected: true, // 是否选择
						imgurl:  '../../static/images/test_imgs/two.png',
						name: '小南0.0',
					},
					{
						selected: true, // 是否选择
						imgurl:  '../../static/images/test_imgs/three.png',
						name: '小耿OvO',
					},
					{
						selected: false, // 是否选择
						imgurl:  '../../static/images/test_imgs/four.png',
						name: '桃乃木香奈',
					},
				]
			};
		},
		onLoad: function(){
			this.selectedNum()
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
			},
			tconfirm(e) {
				this.tempFilePath = "";
				this.cropFilePath = e.detail.tempFilePath;
				this.headimg = e.detail.tempFilePath;
				uni.uploadFile({
					url: this.serverUrl + '/files/upload',      //后端地址上传图片接口地址,
					filePath: this.headimg,
					name: "file",
					fileType: "image",
					formData:{
						url: 'user',
						name: this.uid,
						token: this.token
					}, // 传递参数
					success: (uploadFileRes) => {
						let backstr = uploadFileRes.data;
						// 本地存储用户信息修改
						try {
						  uni.setStorageSync('user', { 'id': this.uid, 'name': this.myname, 'imgurl': backstr, 'token': this.token });
						} catch (e) {
						  // error
							console.log('数据存储出错')
						}
						// 修改头像保存到数据库
						this.update(backstr, 'imgurl', undefined)
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
				for (let i = 0; i < this.user.length; i++) {
					if (this.user[i].selected) {
						this.selectedNumber++
					}
				}
			},
			// 动态选择好友
			selectFriend: function(e) {
				if (this.user[e].selected) {
					this.user[e].selected = false
					this.selectedNumber--
				} else {
					this.user[e].selected = true
					this.selectedNumber++
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
