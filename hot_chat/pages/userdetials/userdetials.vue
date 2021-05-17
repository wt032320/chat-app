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
					<view class="user-head" v-if="id == uid">
						<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
							<image :src="cropFilePath" @tap="upload" class="user-img"></image>
					</view>
					<view class="more" v-if="id == uid">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
					<view class="user-head" v-if="id != uid">
						<image :src="cropFilePath" class="user-img" v-if="id!=uid"></image>
					</view>
				</view>
				
				<view class="row" @tap="modify('explain', '签名', user.explain, false)" v-if="id == uid">
					<view class="title">签名</view>
					<view class="cont">
						{{user.explain}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" v-if="id != uid">
					<view class="title">签名</view>
					<view class="cont">
						{{user.explain}}
					</view>
				</view>
				<view class="row">
					<view class="title">注册</view>
					<view class="cont">
						{{changeTime(user.time)}}
					</view>
				</view>
			</view>
			<view class="column">
				<view class="row" @tap="modify('name', '昵称', user.name, false)" v-if="id == uid">
					<view class="title">昵称</view>
					<view class="cont">
						{{user.name}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" @tap="modify('markname', '昵称', markname, false)" v-if="id != uid">
					<view class="title">昵称</view>
					<view class="cont">
						{{markname}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="row">
					<view class="title">性别</view>
					<view class="cont">
						<picker @change="bindPickerChange" :value="index" :range="array" v-if="id==uid">
							<view class="uni-input">{{array[index]}}</view>
						</picker>
						<view class="uni-input" v-if="id!=uid">{{array[index]}}</view>
					</view>
					<view class="more" v-if="id == uid">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="row">
					<view class="title">生日</view>
					<view class="cont">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" v-if="id==uid" >
							<view class="uni-input">{{date}}</view>
						</picker>
						<view class="uni-input" v-if="id!=uid">{{date}}</view>
					</view>
					<view class="more" v-if="id==uid">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" @tap="modify('phone', '电话', user.phone, false)" v-if="id == uid">
					<view class="title">电话</view>
					<view class="cont">
						{{user.phone}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" v-if="id!=uid">
					<view class="title">电话</view>
					<view class="cont">
						{{user.phone}}
					</view>
				</view>

				<view class="row" @tap="modify('email', '邮箱', user.email, true)" v-if="id==uid">
					<view class="title">邮箱</view>
					<view class="cont" >
						{{user.email}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>

				<view class="row" v-if="id!=uid">
					<view class="title">邮箱</view>
					<view class="cont">
						{{user.email}}
					</view>
				</view>
			</view>	
			<view class="column" v-if="id == uid">
				<view class="row" @tap="modify('psw', '密码', '', true)">
					<view class="title">密码</view>
					<view class="cont">
						******
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<view class="btn2" v-if="id==uid" @tap="quit">退出登录</view>
			<view class="btn2" v-if="id!=uid" @tap="deleteFriend">删除好友</view>
		</view>
		<view class="modify" :style="{bottom:-+modifyHeight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close"  @tap="modifyCancel">取消</view>
				<view class="title">{{modifyTitle}}</view>
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
				user: {}, // 用户信息
				id: '',
				uid: '',
				myname: '',
				markname: '',
				token: '',
				headimg: '', // 头像
				cropFilePath: '', // 裁剪的图片
				array: ['男', '女', '未知'],
				index: 0, // 默认性别
				date: currentDate, // 日期
				tempFilePath: "", // 裁剪后的图片
				data: '', // 修改的内容
				olddata: '', // 原始数据
				ispsw: 'none', // 是否显示密码输入框
				psw: undefined, // 原密码
				type: '',       // 修改项类型
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
		onLoad: function(e) {
			this.id = e.id
			this.getStorages()
			this.getUser()
			this.getMarkname()
		},
		onReady: function() {
			this.getElementStyle()
		},
		methods: {
			// 性别判断
			sexJudge: function(e) {
				if (e == 'female') {
					this.index = 1
				} else if (e == 'male') {
					this.index = 0
				} else {
					this.index = 2
				}
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
			// 获取用户信息
			getUser: function() {
				uni.request({
					url: this.serverUrl + '/user/detial',
					data: {
						id: this.id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						// 访问后端成功
						if(status == 200) {
							let res = data.data.result
							// 处理头像链接
							this.cropFilePath = this.serverUrl + res.imgurl
							// 处理简介
							if(res.explain == undefined) {
								res.explain = '这个人很懒，什么也没有留下~'
							}
							// 处理生日
							if(res.birth == undefined) {
								this.date = '0000-00-00'
							} else {
								let birth = myfun.birthTime(res.birth)
								this.date = birth
							}
							// 处理电话
							if(res.phone == undefined) {
								res.phone = '000'
							}
							// 处理markname
							if(this.markname.length == 0) {
								this.markname = res.name
							}
							this.sexJudge(res.sex)
							this.user = res
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							})
						}
					}
				})
			},
			// 获取好友昵称
			getMarkname: function() {
				if(this.id != this.uid) {
					uni.request({
						url: this.serverUrl + '/friend/getname',
						data: {
							uid: this.uid,
							fid: this.id,
							token: this.token,
						},
						method: 'POST',
						success: (data) => {
							// console.log(data)
							let status = data.data.status
							// 访问后端成功
							if(status == 200) {
								let res = data.data.result
								if(res.markname != undefined) {
									this.markname = res.markname
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
				}
			},
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
				let oldIndex = this.index
				this.index = e.target.value
				if(this.index != oldIndex) {
					let sex = 'asexual'
					if(this.index == 0) {
						sex = 'male'
					} else if (this.index == 1) {
						sex = 'female'
					}
					this.update(sex, 'sex', undefined)
				}
			},
			// 日期选择器方法
			bindDateChange: function(e) {
				let oldDate = this.date
				this.date = e.target.value
				if(this.date != oldDate) {
					this.update(this.date, 'birth', undefined)
				}
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
			// 修改数据
			update: function(udata, itype, password) {
				uni.request({
					url: this.serverUrl + '/user/update',
					data: {
						id: this.uid,
						data: udata,
						type: itype,
						pwd: password,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						// 访问后端成功
						if(status == 200) {
							if(itype == 'psw') {
								// 用户需要重新登录
								// 跳到登陆页
								uni.navigateTo({
									url: '../siginin/siginin?cgpwd=' + this.myname
								})
								// 清除缓存
								try {
								    uni.removeStorageSync('user');
								} catch (e) {
								    // error
								}
							} else {
								this.user[itype] = udata
								uni.showToast({
									title: '修改成功啦！',
									icon: 'none',
									duration: 2000
								})
							}
							
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							})
						} else if (status == 400) {
							uni.showToast({
								title: '密码错误啦！',
								icon: 'none',
								duration: 2000
							})
						} else if (status == 201) {
							uni.showToast({
								title: '已被占用！',
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
			
			// 动态获取页面高度
			getElementStyle: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
				  this.modifyHeight = data.height
				}).exec();
			},
			
			// 修改项弹框
			modify: function(whats, type, data, ispsw) {
				if (ispsw) {
					this.ispsw = 'block'	
					this.psw = '0'
				} else {
					this.ispsw = 'none'
					this.psw = undefined
				}
				if (type !== null) {
					this.modifyTitle = type
				}
				this.type = whats
				this.data = data
				this.olddata = data
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
			
			// 取消修改
			modifyCancel: function () {
				this.modify()
			},
			
			// 弹框修改确定
			modifySubmit: function() {
				// 提交修改
				if(this.data.length > 0 && this.data != this.olddata) {
					if(this.type == 'markname') {
						this.updateFriend()
						this.markname = this.data
					} else if (this.type == 'email') {
						// 匹配邮箱格式
						let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
						if(reg.test(this.data)) {
							this.update(this.data, this.type, this.psw)
							// 前端替换修改
						} else {
							uni.showToast({
								title: '请输入正确的邮箱格式！',
								icon: 'none',
								duration: 2000
							})
						}
					} else {
						this.update(this.data, this.type, this.psw)
					}
				}
				this.modify()
			},
			// 好友昵称修改
			updateFriend: function() {
				if(this.data.length > 0  && this.data != this.olddata) {
					uni.request({
						url: this.serverUrl + '/friend/markname',
						data: {
							uid: this.uid,
							fid: this.id,
							name: this.data,
							token: this.token,
						},
						method: 'POST',
						success: (data) => {
							// console.log(data)
							let status = data.data.status
							// 访问后端成功
							if(status == 200) {
								uni.showToast({
									title: '修改成功啦！',
									icon: 'none',
									duration: 2000
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
			},
			// 退出登录
			quit: function() {
				// 跳到登陆页
				uni.navigateTo({
					url: '../signin/signin'
				})
				// 清除缓存
				try {
				    uni.removeStorageSync('user');
				} catch (e) {
				    // error
				}
			},
			// 删除好友
			deleteFriend: function() {
				uni.showModal({
					title: '提示',
					content: '确定删除该好友吗？',
					success: (res)=> {
						if (res.confirm) {
							uni.request({
								url: this.serverUrl + '/friend/delete',
								data: {
									uid: this.uid,
									fid: this.id,
									token: this.token,
								},
								method: 'POST',
								success: (data) => {
									// console.log(data)
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
						} else if (res.cancel) {
								console.log('用户点击取消');
						}
					}
				})
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
