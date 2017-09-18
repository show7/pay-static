var Router = require("express").Router;

var router = new Router();

router.get("/course/load/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": {
				"openid": "oK881wQekezGpw6rq790y_vAY_YY", //用户openid
				"username": "风之伤", //微信名
				"week": 1, //当前课程周
				"userProgress": 2, //用户的课程进度序号
				"topic": 'ashdaksjhd',
				"weekIndex": [
					{
						"index": 1,
						"indexName": "第一周"
					},
					{
						"index": 2,
						"indexName": "第二周"
					},
					{
						"index": 3,
						"indexName": "第三周"
					}
				],
				"course": {
					"id": 1,
					"type": null,
					"name": "结构化思维", //课程名字
					"difficulty": null,
					"free": null,
					"fee": null,
					"length": null,
					"week": 4, //课程周总长
					"pic": "http://www.iquanwai.com/images/cintro1.png", //课程头图
					"chapterList": [
						{
							"id": 1,
							"courseId": null,
							"name": "结构化思维基础（1）", //章节名
							"type": 1, //章节类型，1-试炼
							"sequence": 1, //章节序号
							"week": null,
							"startDay": null,
							"endDay": null,
							"unlock": true, //是否已解锁
							"icon": "http://www.confucius.mobi/images/%E9%94%81%E5%AE%9A%E5%9B%BE%E6%A0%87.png", //章节icon
							"comment": null
						},
						{
							"id": 2,
							"courseId": null,
							"name": "结构化思维基础（2）",
							"type": 1,
							"sequence": 2,
							"week": null,
							"startDay": null,
							"endDay": null,
							"unlock": true,
							"icon": "http://www.confucius.mobi/images/%E9%94%81%E5%AE%9A%E5%9B%BE%E6%A0%87.png"
						},
						{
							"id": 3,
							"courseId": null,
							"name": "结构化思维基础（3）",
							"type": 1,
							"sequence": 3,
							"week": null,
							"startDay": null,
							"endDay": null,
							"unlock": false,
							"icon": "http://www.confucius.mobi/images/%E9%94%81%E5%AE%9A%E5%9B%BE%E6%A0%87.png"
						},
						{
							"id": 4,
							"courseId": null,
							"name": "大作业",
							"type": 2,
							"sequence": 4,
							"week": null,
							"startDay": null,
							"endDay": null,
							"unlock": false,
							"icon": "http://www.confucius.mobi/images/%E9%94%81%E5%AE%9A%E5%9B%BE%E6%A0%87.png"
						},
						{
							"id": 5,
							"courseId": null,
							"name": "8：00pm群里点评咯",
							"type": 3,
							"sequence": 5,
							"week": null,
							"startDay": null,
							"endDay": null,
							"unlock": false,
							"icon": "http://www.confucius.mobi/images/%E9%94%81%E5%AE%9A%E5%9B%BE%E6%A0%87.png"
						}
					]
				}
			}
		}), Math.random() * 1500)
});

router.get("/course/week/*/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": {
				"openid": "oK881wQekezGpw6rq790y_vAY_YY", //用户openid
				"username": "风之伤", //微信名
				"week": 1, //当前课程周
				"userProgress": 2, //用户的课程进度序号
				"weekIndex": [
					{
						"index": 1,
						"indexName": "第一周"
					},
					{
						"index": 2,
						"indexName": "第二周"
					},
					{
						"index": 3,
						"indexName": "第三周"
					}
				],
				"course": {
					"id": 1,
					"type": null,
					"name": "结构化思维", //课程名字
					"difficulty": null,
					"free": null,
					"fee": null,
					"length": null,
					"week": 4, //课程周总长
					"pic": "http://www.iquanwai.com/images/cintro1.png", //课程头图
					"chapterList": [
						{
							"id": 1,
							"courseId": null,
							"name": "结构化思维基础（1）", //章节名
							"type": 1, //章节类型，1-试炼
							"sequence": 1, //章节序号
							"week": null,
							"startDay": null,
							"endDay": null,
							"unlock": true, //是否已解锁
							"icon": "http://someurl" //章节icon
						},
						{
							"id": 2,
							"courseId": null,
							"name": "结构化思维基础（2）",
							"type": 1,
							"sequence": 2,
							"week": null,
							"startDay": null,
							"endDay": null,
							"unlock": true,
							"icon": "http://someurl"
						},
						{
							"id": 3,
							"courseId": null,
							"name": "结构化思维基础（3）",
							"type": 1,
							"sequence": 3,
							"week": null,
							"startDay": null,
							"endDay": null,
							"unlock": false,
							"icon": "http://someurl"
						},
						{
							"id": 4,
							"courseId": null,
							"name": "大作业",
							"type": 2,
							"sequence": 4,
							"week": null,
							"startDay": null,
							"endDay": null,
							"unlock": false,
							"icon": "http://someurl"
						},
						{
							"id": 5,
							"courseId": null,
							"name": "8：00pm群里点评咯",
							"type": 3,
							"sequence": 5,
							"week": null,
							"startDay": null,
							"endDay": null,
							"unlock": false,
							"icon": "http://someurl",
              "comment": "圈圈叫你去红点房间做游戏啦，微信群里获取参与方式；当天晚上8：30准时开始~",
						}
					]
				}
			}
		}), Math.random() * 1500)
});

module.exports = router;
