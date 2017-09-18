var express = require("express")
var bodyParser = require("body-parser")
var path = require("path");

var app = express()

// 参考文档: https://codeforgeek.com/2014/09/handle-get-post-request-express-4/
// 可以解析 request payload, 即 res.body
app.use(bodyParser.json())

app.get("/test", function(req, res) {
	res.status(200).json({
		"msg": "ok"
	})
})

app.use("/assets/", express.static(path.join(__dirname, "../assets")))
app.use("/js/", express.static(path.join(__dirname, "../js")))

// API
app.use(require('./course/router'))
app.use(require('./chapter/router'))
app.use(require('./introduction/router'))
app.use(require('./signup/router'))
app.use(require('./homework/router'))
app.use(require('./file/router'))
app.use(require('./personal/router'))
app.use(require('./operation/router'))

module.exports = app
