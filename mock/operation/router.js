var Router = require("express").Router;
var router = new Router();

router.get("/operation/my/promoCode", (req, res) => {
  setTimeout(() =>
    res.status(200).json(
      {"msg":{"id":1,"code":"1l02", "name":"小猴几", "url": "http://www.confucius.mobi/static/course/promotion/share?id=1",
        "avatar": "http://wx.qlogo.cn/mmopen/siaKjia9aBPcJHOCEV6z4AyzcnUwia2Yx70AdmdWPmZ6HGOhkhEgH1rlAdXLYabSXZjibfCNfMlFGP5xY8uV2aoshQ3ggFfQ5ibk0/0"},"code":200}
    ), Math.random() * 1500)
});

router.get("/operation/promoCode/**", (req, res) => {
  setTimeout(() =>
    res.status(200).json(
      {"msg":{"id":1,"code":"1l02", "name":"小猴几",
        "avatar": "http://wx.qlogo.cn/mmopen/siaKjia9aBPcJHOCEV6z4AyzcnUwia2Yx70AdmdWPmZ6HGOhkhEgH1rlAdXLYabSXZjibfCNfMlFGP5xY8uV2aoshQ3ggFfQ5ibk0/0"},"code":200}
    ), Math.random() * 1500)
});

router.get("/operation/discount", (req, res) => {
    setTimeout(() =>
        res.status(200).json(
            {code: 200, msg: '200'}
        ), Math.random() * 1500);
})

router.get("/operation/discount/valid", (req, res) => {
    setTimeout(() =>
        res.status(200).json(
            {code: 200, msg: 'ok'}
        ), Math.random() * 1500);
})

module.exports = router;
