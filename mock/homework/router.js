var Router = require("express").Router;

var router = new Router();

router.get("/homework/load/*", (req, res) => {
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

router.post("/homework/submit/*", (req, res) => {
	setTimeout(() =>
		res.status(200).json({
			"code": 200,
			"msg": "ok"
		}), Math.random() * 1500)
});

module.exports = router;
