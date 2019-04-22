var Router = require("express").Router;

var router = new Router();

router.post("/rise/operation/group/create", (req, res) => {
  const {
    ee, // ffef
    fewf //fwefwe
  } = req.body;
  res.status(200).json(
    {
      "msg": "ddd013cml1", // fff
      "code": 200 // 错误的
    });
});

router.get("/rise/operation/group/following", (req, res) => {
  res.status(200).json(
    {
      "msg": "ok",
      "code": 201
    });
});

router.post("/rise/operation/group/participate", (req, res) => {
  setTimeout(() =>
    res.status(200).json(
      {
        "msg": "ok", "code": 200
      }
    ), Math.random() * 1500)
});

router.get("/rise/operation/group/leader", (req, res) => {
  setTimeout(() =>
    res.status(200).json(
      {
        "msg": {
          "nickname": "风之伤",
          "headimgurl": "https://wx.qlogo.cn/mmopen/Q3auHgzwzM6LrkJRYApibxYsAEYm2CmS7JZwX09AmHsP0X2VJQSpibHyoHsQKNcvqf1hzFgJr6l40vyhH7KtGWupGmgKHwFibbiaOOS0qKuvjsQ/0"
        }, "code": 200
      }
    ), Math.random() * 1500)
});

module.exports = router;