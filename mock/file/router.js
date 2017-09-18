var Router = require("express").Router;

var router = new Router();

router.post("/file/upload/", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "code": 200,
      "msg": {
        status:"1",
        picUrl:"http://i1.mopimg.cn/img/dzh/2016-03/165/20160325182609444.jpg"
      }
    }), Math.random() * 1500)
});

module.exports = router;
