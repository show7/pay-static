var Router = require("express").Router;

var router = new Router();


router.post("/rise/operation/group/create", (req, res) => {
  setTimeout(() =>
res.status(200).json(
  {
    "msg": "ddd013cml1", "code": 200
  }
), Math.random() * 1500)
});

router.get("/rise/operation/group/following", (req, res) => {
  setTimeout(() =>
res.status(200).json(
  {
    "msg": "ok", "code": 200
  }
), Math.random() * 1500)
});

router.post("/rise/operation/group/participate", (req, res) => {
  setTimeout(() =>
res.status(200).json(
  {
    "msg": "ok", "code": 200
  }
), Math.random() * 1500)
});

module.exports = router;