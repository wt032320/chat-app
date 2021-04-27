export default {
  friends: function() {
    let friendarr = [
      {
        id: '01',
        imgurl: 'one.png',
        tips: 2,
        name: '小黄O.o',
				email: '3413@qq.com',
        time: new Date(),
        message: '我也是沙口，嘿嘿嘿嘿嘿嘿嘿嘿嘿额嘿嘿额嘿嘿额嘿嘿嘿'
      },
      {
        id: '02',
        imgurl: 'two.png',
        tips: 4,
        name: '桃乃木香奈',
				email: '123@qq.com',
        time: new Date(),
        message: '？？？？？'
      },
      {
        id: '03',
        imgurl: 'three.png',
        tips: 10,
        name: '桥本有菜',
				email: '6662@qq.com',
        time: new Date(),
        message: '，，，，，'
      },
      {
        id: '04',
        imgurl: 'four.png',
        tips: 2,
        name: '相泽南',
				email: '243566@qq.com',
        time: new Date(),
        message: '。。。。。'
      }
    ]
		return friendarr
  },
	
	// 好友关系
	isFiend: function() {
		let isfriend = [
			{
				userid: '01',
				friendid: '02',
			},
			{
				userid: '01',
				friendid: '03',
			},
		]
		return isfriend
	},
	
	// 聊天消息
	messages: function() {
		let msgs = [
			{
				id: 'a', // 用户id
				imgurl: 'one.png', // 用户头像
				message: {
					name: '天安门城楼售票处',
					address: '东长安街天安门城楼内',
					latitude: '39.909473',
					longitude: '116.39730899999999',
					
				}, // 用户消息
				types: 3,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接 3: 位置。。。)
				time: new Date(), // 发送时间
				tip: 0,
			},
			{
				id: 'b', // 用户id
				imgurl: 'two.png', // 用户头像
				message: {
					name: '天安门城楼售票处天安门城楼售票处天安门城楼售票处',
					address: '东长安街天安门城楼内东长安街天安门城楼内',
					latitude: '39.909473',
					longitude: '116.39730899999999',
				}, // 用户消息
				types: 3,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接 3: 位置。。。)
				time: new Date(), // 发送时间
				tip: 1,
			},
			{
				id: 'a', // 用户id
				imgurl: 'one.png', // 用户头像
				message: {
					voice: 'a',
					 time: 22,
				}, // 用户消息
				types: 2,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date(), // 发送时间
				tip: 2,
			},
			{
				id: 'b', // 用户id
				imgurl: 'two.png', // 用户头像
				message: {
					voice: 'b',
					 time: 60,
				}, // 用户消息
				types: 2,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date(), // 发送时间
				tip: 3,
			},
			{
				id: 'a', // 用户id
				imgurl: 'one.png', // 用户头像
				message: '不要眼眶一红，就觉得人间不值得，散伙是人间常态，你我怎能例外。', // 用户消息
				types: 0,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date() - 1000, // 发送时间
				tip: 4,
			},
			{
				id: 'a', // 用户id
				imgurl: 'one.png', // 用户头像
				message: '我也有自己的傲气，但因为对方是你，才迁就这份嚣张。', // 用户消息
				types: 0,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date() - 1000 * 16, // 发送时间
				tip: 5,
			},
			{
				id: 'b', // 用户id
				imgurl: 'two.png', // 用户头像
				message: '互相心里有对方的人不应该错过。', // 用户消息
				types: 0,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date() - 1000 * 60, // 发送时间
				tip: 6,
			},
			{
				id: 'a', // 用户id
				imgurl: 'one.png', // 用户头像
				message: 'wu.jpg', // 用户消息
				types: 1,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date() - 1000 * 16 * 36, // 发送时间
				tip: 7,
			},
			{
				id: 'a', // 用户id
				imgurl: 'one.png', // 用户头像
				message: '人间失格里有这样一句话：无论对谁太过热情，就增加了不被珍惜的概率。', // 用户消息
				types: 0,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date() - 1000 * 16 * 40, // 发送时间
				tip: 8,
			},
			{
				id: 'b', // 用户id
				imgurl: 'two.png', // 用户头像
				message: '如果你并不期待，那么我翻山越岭便毫无意义。', // 用户消息
				types: 0,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date() - 1000 * 60 * 57, // 发送时间
				tip: 9,
			},
			{
				id: 'a', // 用户id
				imgurl: 'one.png', // 用户头像
				message: '提起满是遗憾。', // 用户消息
				types: 0,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date() - 1000 * 60 * 58, // 发送时间
				tip: 10,
			},
			{
				id: 'b', // 用户id
				imgurl: 'two.png', // 用户头像
				message: 'yi.jpg', // 用户消息
				types: 1,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date() - 1000 * 60 * 60, // 发送时间
				tip: 11,
			},
			{
				id: 'b', // 用户id
				imgurl: 'two.png', // 用户头像
				message: '再热情的心也经不起冷漠 再爱你的人也经不起冷落', // 用户消息
				types: 0,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date() - 1000 * 60 * 58 * 24, // 发送时间
				tip: 12,
			},
			{
				id: 'a', // 用户id
				imgurl: 'one.png', // 用户头像
				message: '偏偏这世界唯有感情努力不来', // 用户消息
				types: 0,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date() - 1000 * 60 * 60 * 24, // 发送时间
				tip: 13,
			},
			{
				id: 'b', // 用户id
				imgurl: 'two.png', // 用户头像
				message: '我有你拿不走的旧回忆，可以一个人安静的忘记你。', // 用户消息
				types: 0,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date() - 1000 * 60 * 60 * 30, // 发送时间
				tip: 14,
			},
			{
				id: 'a', // 用户id
				imgurl: 'one.png', // 用户头像
				message: '幸好思念无声 否则你震耳欲聋', // 用户消息
				types: 0,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date() - 1000 * 60 * 60 * 33, // 发送时间
				tip: 15,
			},
			{
				id: 'b', // 用户id
				imgurl: 'two.png', // 用户头像
				message: 'yi.jpg', // 用户消息
				types: 1,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date() - 1000 * 60 * 60 * 34, // 发送时间
				tip: 16,
			},
			{
				id: 'b', // 用户id
				imgurl: 'two.png', // 用户头像
				message: '夜色匆忙 暮暮是你', // 用户消息
				types: 0,     // 消息类型(0: 文字  1: 图片链接 2: 音频链接。。。)
				time: new Date() - 1000 * 60 * 60 * 40, // 发送时间
				tip: 17,
			},
		];
		return msgs
	}
}