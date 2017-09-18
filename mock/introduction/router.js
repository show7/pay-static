var Router = require("express").Router;

var router = new Router();

router.get("/introduction/mycourse", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "msg": {
        "myCourses": [
          {
            "myProgress": 0.06667, //我的课程进度
            "courseProgress": 0.1, //课程实际进度
            "course": {
              "id": 1,
              "courseId": 1, //课程id
              "courseName": "结构化思维", //课程名称
              "free": false,
              "fee": 0.0,
              "length": 21, //课程总长度
              "week": 3, //课程周数
              "type": 3,
              "introPic": 'http://www.iquanwai.com/images/cintro1_3.png', //介绍头图
              "intro": null, //太长，已置空
              "voice": "http://www.iquanwai.com/images/cintro1_3.png" //课程语音介绍
            }
          }
        ],
        "otherCourses": [{
          "id": 1,
          "courseId": 1,
          "courseName": "结构化思维",
          "free": false,
          "fee": 0.01,
          "length": 21,
          "week": 3,
          "voice": null,
          "intro": null,
          "introPic": "http://www.iquanwai.com/images/cintro1_3.png"
        }, {
          "id": 2,
          "courseId": 2,
          "courseName": "结构化思维",
          "free": false,
          "fee": 0.0,
          "length": 21,
          "week": 3,
          "voice": null,
          "intro": null,
          "type": 3,
          "introPic": "http://www.iquanwai.com/images/c5intro_big.jpg"
        }, {
          "id": 3,
          "courseId": 3,
          "courseName": "结构化思维",
          "free": false,
          "fee": 0.0,
          "length": 21,
          "week": 3,
          "voice": null,
          "intro": null,
          "type": 1,
          "introPic": "http://www.iquanwai.com/images/cintro1_3.png"
        }]
      }, "code": 200
    }), Math.random() * 1500)
});

router.get("/introduction/course/*", (req, res) => {
  setTimeout(() =>
    res.status(200).json(
      {
        "msg": {
          "id": 2,
          "courseId": 2,
          "courseName": "求职背后的秘密",
          "free": false,
          "fee": 0.01,
          "length": 7,
          "taskLength": 6,
          "week": 1,
          "type": 2,
          "intro": "<b>课程目标</b><br/>- 了解企业的真正需求<br/>- 更有效地进行求职<br/>- 更正确地进行职业选择<br/><br/><b>课程大纲</b><br/>- 知己知彼，才不被拒<br/>- 好简历不只是格式<br/>- 面试官究竟想听什么<br/>- 群面考察的是什么<br/>- 如何选对 Offer<br/><br/><b>如何学习</b><br/>- 手机端自行学课程：知识点、案例、选择题<br/>- QQ 群交流答疑：求职者相互交流；老师群内答疑<br/>- 一次线上直播：共性问题，通过一次线上直播解答<br/><br/>有问题就联系我们的运营喵 小Q<br/>微信号：quanwaizhushou",
          "introPic": "http://www.iquanwai.com/images/cintro2_2.png",
          "hidden": false,
          "sequence": 2
        }, "code": 200
      }
    ), Math.random() * 1500)

});
router.get("/introduction/allcourse", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "code": 200,
      "msg": [
        {
          "id": 1,
          "courseId": 1, //课程id
          "courseName": "结构化思维", //课程名称
          "free": false,
          "fee": 0.0,
          "length": 21,
          "week": 3,
          "introPic": "http://www.iquanwai.com/images/cintro1.png",
          "intro": "中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文中文", //课程简介
          "voice": "http://www.iquanwai.com/audio/%E4%B8%89%E5%A4%A7%E7%89%B9%E5%BE%81.m4a" //课程语音介绍
        }
      ]
    }), Math.random() * 1500)
});

router.post("/signup/course/*", (req, res) => {
  setTimeout(() =>
    res.status(200).json(
      {
        "msg": {
          "remaining": 1,
          "qrcode": "http://www.confucius.mobi/images/qrcode/tubwizclwfzmxhz4.jpg",
          "course": {
            "id": 2,
            "courseId": 2,
            "courseName": "求职背后的秘密",
            "free": false,
            "fee": 0.01,
            "length": 7,
            "taskLength": 6,
            "week": 1,
            "type": 2,
            "intro": "<b>课程目标</b><br/>- 了解企业的真正需求<br/>- 更有效地进行求职<br/>- 更正确地进行职业选择<br/><br/><b>课程大纲</b><br/>- 知己知彼，才不被拒<br/>- 好简历不只是格式<br/>- 面试官究竟想听什么<br/>- 群面考察的是什么<br/>- 如何选对 Offer<br/><br/><b>如何学习</b><br/>- 手机端自行学课程：知识点、案例、选择题<br/>- QQ 群交流答疑：求职者相互交流；老师群内答疑<br/>- 一次线上直播：共性问题，通过一次线上直播解答<br/><br/>有问题就联系我们的运营喵 小Q<br/>微信号：quanwaizhushou",
            "introPic": "http://www.iquanwai.com/images/cintro2_2.png",
            "hidden": false,
            "sequence": 2
          },
          "productId": "tubwizclwfzmxhz4",
          "fee": 0.01,
          "normal": null,
          "discount": null,
          "quanwaiClass": {
            "id": 9,
            "classNumber": 1,
            "openTime": "2017-01-06",
            "closeTime": "2017-01-10",
            "courseId": 2,
            "progress": 7,
            "limit": 100,
            "season": 1,
            "open": true,
            "weixinGroup": null,
            "openDate": null,
            "broadcastUrl": null,
            "broadcastRoomNo": null,
            "broadcastPassword": null,
            "qqGroup": "http://www.iquanwai.com/images/qqc_1.png",
            "qqGroupNo": "346952912"
          },
          "promoCode": {
            "id": 2,
            "code": "defefweffgew",
            "activityCode": "CAREER_COURSE_PACKAGE",
            "useCount": 4,
            "owner": "o5h6ywsiXYMcLlex2xt7DRAgQX-A",
            "expiredDate": "2017-02-28",
            "discount": 9.0
          },
          "free": false
        }, "code": 200
      }
    ), Math.random() * 1500)
});

router.post("/signup/paid/*", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "code": 200,
      "msg": {
        "username": "风之伤", //微信昵称
        "headUrl": "http://wx.qlogo.cn/mmopen/Q3auHgzwzM7jtWGMoHYWcJVvuaamv7YV5xETt0uy66sH2RicicQiaYAITvxIbjM0XBNCoF8q08Ovyy3O1ccicxtOwYgyyViamG4FwfVgAo1DVMC0/0", //微信头像url
        "memberId": "4", //学号
        "quanwaiClass": {
          "id": 1,
          "openTime": "2016-08-29",
          "closeTime": "2016-09-30",
          "courseId": 1,
          "progress": 3,
          "limit": 100,
          "open": true,
          "weixinGroup": null //班级微信群二维码url
        },
        "course": {
          "id": 1,
          "type": 1,
          "name": "结构化思维",
          "difficulty": 1,
          "free": true,
          "fee": 10,
          "length": 30,
          "week": 4,
          "pic": null,
          "introPic": 'http://www.iquanwai.com/images/cintro1.png',
          "chapterList": null
        }
      }
    }), Math.random() * 1500)
});


module.exports = router;
