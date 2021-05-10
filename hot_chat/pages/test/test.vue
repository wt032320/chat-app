<template>
	<view>
		<view class="test" @tap="testFun">测试</view>
		<view class="upload" @tap="upload">上传图片</view>
		<image v-for="(item,index) in img" :key="index" :src="item"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 'adsdsd',
				img: [],
			};
		},
		methods: {
			testFun: function() {
				uni.request({
					url: this.serverUrl + '/index/messaged',
					data: {
						uid: '609138ec2226269ba8dc7e4e',
						fid: '6091387f2226269ba8dc7e4d',
						// state: 1,
						// token: '"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOTEzOGVjMjIyNjI2OWJhOGRjN2U0ZSIsInRpbWUiOiIyMDIxLTA1LTEwVDA2OjI3OjM2LjI2N1oiLCJpYXQiOjE2MjA2MjgwNTYsImV4cCI6MTYzMDk5NjA1Nn0.7TNz8Q2BZELNyem4Ulg2NnyNnHF2tqj13PmlOQvMKvw"'
					},
					method: 'POST',
					success: (data) => {
						console.log(data)
					}
				})
			},
			upload: function() {
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						for (let i = 0; i < tempFilePaths.length; i++) {
							const uploadTask = uni.uploadFile({
								url: 'http://127.0.0.1:8081/files/upload', 
								filePath: tempFilePaths[i],
								name: 'file',
								formData: {
										url: 'user',
										name: new Date().getTime()+ this.id + i
								},
								success: (uploadFileRes) => {
							
									let path = 'user/' + uploadFileRes.data
									this.img.push('http://127.0.0.1:8081/' + path)
									console.log(path);
								}
							});
									
							uploadTask.onProgressUpdate((res) => {
								console.log('上传进度' + res.progress);
								console.log('已经上传的数据长度' + res.totalBytesSent);
								console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
								
								// 测试条件，取消上传任务。
								// if (res.progress > 50) {
								// 		uploadTask.abort();
								// }
							});
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.upload {
		padding-top: 40rpx;
		text-align: center;
	}
	.test {
		padding-top: 80rpx;
		text-align: center;
	}
</style>
