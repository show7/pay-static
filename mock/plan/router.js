var Router = require("express").Router;

var router = new Router();

router.post("/rise/plan/choose/audition/course", (req, res) => {
  setTimeout(() => {
    res.status(200).json({
      "msg": {
        "planId":1289,
        "goSuccess":true,
        "className":"1021",
        "subscribe":false
      }, "code": 200
    })
  }, Math.random() * 1500)
})


module.exports = router;