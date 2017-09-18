var Router = require("express").Router;

var router = new Router();

router.get("/chapter/load/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": {
				"openid": "oK881wQekezGpw6rq790y_vAY_YY", //用户openid
				"username": "风之伤", //用户名
				"chapterId": 1, //章节id
				"chapterType": 1, //章节类型,1-挑战
				"chapterName": "结构化思维（1）", //章节名
				"chapterPic": "http://www.iquanwai.com/images/cintro1.png", //章节头图
				"totalPage": 20,
				"page": {
					"id": 1, //页id
					"chapterId": 1, //章节id
					"sequence": 1, //页数
					"topic": "结构化思维（1）", //章节名
					"materialList": [
						{
							"id": 1,
							"type": 1, //素材类型-1文字
							"pageId": 1, //页id
							"sequence": 1, //序号
							"content": "文章正文文章正文文章正文文章正"
						},
						{
							"id": 2,
							"type": 2, //素材类型-2图片
							"pageId": 1,
							"sequence": 2,
							"content": "http://img3.duitang.com/uploads/item/201410/28/20141028224640_GwPz4.jpeg"
						},
						{
							"id": 3,
							"type": 3, //素材类型-3语音
							"pageId": 1,
							"sequence": 3,
							"content": "http://www.iquanwai.com/audio/%E5%96%9C%E6%AC%A2%E5%BD%92%E7%BA%B3%E6%84%8F%E4%B9%89.m4a"
						},
						{
							"id": 5,
							"type": 4, //素材类型-5选择题
							"pageId": 1,
							"sequence": 5,
							"content": "1" //选择题id
						}
					]
				}
			}
		}), Math.random() * 1500)
});

router.get("/chapter/page/*/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": {
				"openid": "oK881wQekezGpw6rq790y_vAY_YY", //用户openid
				"username": "风之伤", //用户名
				"chapterId": 1, //章节id
				"chapterType": 1, //章节类型,1-挑战
				"chapterName": "结构化思维（1）", //章节名
				"chapterPic": "http://www.iquanwai.com/images/cintro1.png", //章节头图
				"totalPage": 20,
        "page": {
          "id": 625,
          "chapterId": 56,
          "sequence": 29,
          "topic": "课后思考",
          "materialList": [
            {
              "id": 1473,
              "type": 1,
              "pageId": 625,
              "sequence": 1,
              "content": "试听部分已结束，是不是意犹未尽？<br/><br/>\n\n<b>正式课程还包括哪些内容？</b><br/><br/>\n\n-各类思维的应用场景<br/>\n-头脑风暴打开思路的方法<br/>\n-临场发言的三个步骤<br/>\n-用结构化思维来写作的技巧<br/>\n-用结构化思维解决问题的套路<br/><br/>\n\n<b>正式课程还包含哪些玩法呢？</b><br/><br/>\n\n-微信群实时答疑交流<br/>\n-每周讲师语音集中答疑和点评作业<br/>\n-同学间头脑风暴互相交流<br/>\n-丰富的课程奖项与校友会资源<br/><br/>\n\n<b>学完课程可以收获什么呢？</b><br/><br/>\n\n-面对问题的时候，不再脑子一团乱麻<br/>\n-与人沟通的时候，不在没有重点<br/>\n-写作的时候，不再把议论文写成散文<br/><br/>\n\n<b>感兴趣的话，请点击以下报名</b><br/><br/>"
            },
            {
              "id": 1474,
              "type": 1,
              "pageId": 625,
              "sequence": 2,
              "content": "<div class='btn-pay'><a href='http://www.confucius.mobi/pay?courseId=4'>正式课程报名</a></div>"
            },
            {
              "id": 1475,
              "type": 1,
              "pageId": 625,
              "sequence": 3,
              "content": "<br/>有问题就联系我们的运营喵Rosa<br/>\n微信号：quanwaizhushou<br/>"
            },
            {
              "id": 2,
              "type": 2, //素材类型-2图片
              "pageId": 1,
              "sequence": 4,
              "content": "http://someurl"
            },
            {
              "id": 3,
              "type": 3, //素材类型-3语音
              "pageId": 1,
              "sequence": 5,
              "content": "http://www.iquanwai.com/audio/喜欢归纳意义.m4a"
            },
            {
              "id": 5,
              "type": 5, //素材类型-5选择题
              "pageId": 1,
              "sequence": 6,
              "content": "1" //选择题id
            }
          ]
        }
			}
		}), Math.random() * 1500)
});

router.get("/chapter/page/lazyLoad/*/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": {
				"openid": "oK881wQekezGpw6rq790y_vAY_YY", //用户openid
				"username": "风之伤", //用户名
				"chapterId": 1, //章节id
				"chapterType": 1, //章节类型,1-挑战
				"chapterName": "结构化思维（1）", //章节名
				"chapterPic": "http://www.iquanwai.com/images/cintro1.png", //章节头图
				"totalPage": 20,
				"page": {
					"id": 1, //页id
					"chapterId": 1, //章节id
					"sequence": 1, //页数
					"topic": "结构化思维（1）", //章节名
					"materialList": [
						{
							"id": 1,
							"type": 1, //素材类型-1文字
							"pageId": 1, //页id
							"sequence": 1, //序号
							"content": "文章正文文章正文文章正文文章正文文章正文文章正文"
						},
						{
							"id": 2,
							"type": 2, //素材类型-2图片
							"pageId": 1,
							"sequence": 2,
							"content": "http://someurl"
						},
						{
							"id": 3,
							"type": 3, //素材类型-3语音
							"pageId": 1,
							"sequence": 3,
							"content": "http://someurl"
						},
						{
							"id": 5,
							"type": 5, //素材类型-5选择题
							"pageId": 1,
							"sequence": 5,
							"content": "1" //选择题id
						}
					]
				}
			}
		}), Math.random() * 1500)
});
router.get("/chapter/question/lofad/*", (req, res) => {
  setTimeout(() =>
    res.status(400).json({
      "code": 203,
      "msg": "trest"
    }), Math.random() * 1500)
});

router.get("/chapter/question/load/*", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "code": 200,
      "msg": {
        "id": 1,
        "subject": "问题1-blabla", //问题题干
        "analysis": "问题解析问题解析问题解析问题解析", //问题解析
        "point": 100, //问题分值
        "answered": false, //是否回答过
        "type": 2,
        "emotionType": 2,
        "analysisType": 3,
        "choiceList": [
          {
            "id": 1,
            "questionId": 1, //问题id
            "subject": "选项1", //选项题干
            "sequence": 1, //选项顺序
            "right": false //是否是正确选项
          },
          {
            "id": 2,
            "questionId": 1,
            "subject": "选项2",
            "sequence": 2,
            "right": true
          },
          {
            "id": 3,
            "questionId": 1,
            "subject": "选项3",
            "sequence": 3,
            "right": true
          }
        ]
      }
    }), Math.random() * 1500)
});

router.get("/chapter/homework/load/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": {
				"id": 1,
				"subject": "作业题干作业题干作业题干作业题干作业题干", //题干
				"voice": "http://someurl", //语音链接
				"point": 100, //分值
				"pcurl": "http://someurl", //pc端url
				"submitted": false, //是否提交过
				"content": "balbal"
			}
		}), Math.random() * 1500)
});

router.post("/chapter/homework/submit/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": "ok"
		}), Math.random() * 1500)
});

router.post("/chapter/mark/page/*/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": "ok"
		}), Math.random() * 1500)
});

router.get("/wx/js/signature", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": {
				appId: '', // 必填，公众号的唯一标识
				timestamp: '', // 必填，生成签名的时间戳
				nonceStr: '', // 必填，生成签名的随机串
				signature: '',// 必填，签名，见附录1
			}
		}), Math.random() * 1500)
});

router.post("/chapter/answer/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": "ok"
		}), Math.random() * 1500)
});

module.exports = router;
