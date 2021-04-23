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
	}
}