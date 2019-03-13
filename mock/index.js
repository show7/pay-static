var app = require("./app")

var port = process.env.EXPRESS_PORT || 3000
var ip = "localhost"

console.info("正在启动 server")

app.listen(port, ip, function(err) {
  if (err) {
    console.log(err);
    return
  }
  console.info("==> 🌎 启动完毕, 地址为: http://localhost:%s/", port)
})
