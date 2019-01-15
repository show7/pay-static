var Router = require("express").Router;

var router = new Router();

router.get("/rise/customer/info", (req, res) => {
  setTimeout(() => {
    res.status(200).json({
      "msg": {
        "id": 0,
        "openid": null,
        "nickname": "薛定谔的猫",
        "city": null,
        "country": null,
        "province": null,
        "headimgurl": "https://thirdwx.qlogo.cn/mmopen/Q3auHgzwzM7ZzH69MKticPuHia0BQrSp3urQbKuwAEvs7ibtYWOQxCrIOkZfkdBKzsNNsqHdo3V4NJN7pBpZYuON9hGt1uGtYMHZxgWoiasfHm4/132",
        "headImgUrlCheckTime": null,
        "mobileNo": null,
        "email": null,
        "industry": null,
        "function": null,
        "workingLife": null,
        "realName": null,
        "signature": null,
        "point": null,
        "isFull": null,
        "riseId": null,
        "openRise": null,
        "unionid": null,
        "expireDate": null,
        "riseMember": null,
        "openNavigator": null,
        "openApplication": null,
        "openConsolidation": null,
        "openWelcome": null,
        "learningNotify": null,
        "requestCommentCount": null,
        "role": null,
        "address": null,
        "workingYear": null,
        "weixinId": null,
        "receiver": null,
        "married": null
      }, "code": 200
    });
  }, Math.random() * 1500)
})

router.post("/signup/load/goods", (req, res) => {
  setTimeout(() => {
    res.status(200).json({
      "msg": {
        "goodsType": "bs_application",
        "fee": 0.01,
        "name": "电话面试预约",
        "goodsId": 7,
        "coupons": [],
        "startTime": null,
        "endTime": null,
        "activity": null,
        "initPrice": null,
        "multiCoupons": false,
        "autoCoupons": []
      }, "code": 200
    });
  }, Math.random() * 1500)
})

router.get("/signup/mark/**", (req, res) => {
  setTimeout(() => {
    res.status(200).json({ code: 200, msg: "ok" })
  }, Math.random() * 1500)
})

router.post("/rise/b/mark", (req, res) => {
  setTimeout(() => {
    res.status(200).json({ "msg": "ok", "code": 200 })
  }, Math.random() * 1500)
})

router.get("/signup/info/load", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "msg": {
        "mobileNo": "13712345678",
        "email": "aaa@mail.com",
        "industry": "IT",
        "function": "软件开发",
        "workingLife": "10"
      },
      "code": 200
    }), Math.random() * 1500)
});

router.post("/signup/load/goods", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "msg": {
        "goodsType": "fragment_member",
        "fee": 2280.0,
        "name": "会员购买",
        "goodsId": 3,
        "coupons": [],
        "startTime": "2017.09.18",
        "endTime": "2018.09.30",
        "activity": null
      }, "code": 200
    }), Math.random() * 1500)
});

router.post("/b/log", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "msg": {
        "mobileNo": "13712345678",
        "email": "aaa@mail.com",
        "industry": "IT",
        "function": "软件开发",
        "workingLife": "10"
      },
      "code": 200
    }), Math.random() * 1500)
});

router.get("/signup/welcome/*", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "msg": {
        "username": "风之伤",
        "headUrl": "http://wx.qlogo.cn/mmopen/Q3auHgzwzM4j579r72ltlZK0uBEz3klv57pOrqolSjZONIIlyffo4ib5p7sneIH4MgXyCKzKOKBiaCTkQUyu15XKiaeSppaJ0U3j1OBLIOrxrk/0",
        "memberId": "0101004", //学号
        "quanwaiClass": {
          "id": 1,
          "openTime": "2016-09-07", //开课时间
          "closeTime": "2016-10-06", //结业时间
          "courseId": 1,
          "progress": 4,
          "limit": 100,
          "open": true,
          "weixinGroup": null
        },
        "course": {
          "id": 1,
          "courseId": 1,
          "courseName": "结构化思维",
          "free": false,
          "fee": 0.01,
          "discount": 0.99,
          "normal": 1,
          "length": 21,
          "week": 3,
          "voice": null,
          "intro": null, //课程介绍
          "introPic": 'http://www.iquanwai.com/images/cintro1.png'
        }
      },
      "code": 200
    }), Math.random() * 1500)
});

router.post("/signup/info/submit", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "code": 200,
      "msg": 1
    }), Math.random() * 1500)
});

router.post("/personal/info/submit", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "code": 200,
      "msg": 1
    }), Math.random() * 1500)
});

router.get("/course/certificate/info/*", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "code": 200,
      "msg": {
        "certificateNo": "IQW102131010313100", //证书号
        "name": "张三", //学员名称
        "certificateBg": 'http://www.iquanwai.com/images/cintro1.png', //证书背景url
        "comment": "恭喜成功毕业" //证书祝贺文字
      }
    }), Math.random() * 1500)
});

router.get("/personal/info/load", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "msg": {
        "mobileNo": "12345678912",
        "email": "",
        "industry": null,
        "function": "链接",
        "workingLife": "1",
        "courseId": null,
        "realName": "丁志君",
        "city": null,
        "province": null,
        "provinceId": 6
      }, "code": 200
    }), Math.random() * 1500)
});

router.get("/signup/rise/member/check/*", (req, res) => {
  setTimeout(() => {
    res.status(200).json({ "msg": "ok", "code": 200 })
  })
})

router.post("/signup/coupon/calculate", (req, res) => {
  setTimeout(() => {
    res.status(200).json({ "msg": 0.0, "code": 200 })
  });
})

router.get("/signup/rise/member", (req, res) => {
  setTimeout(() => {
    res.status(200).json({
      "msg": {
        "memberType": null,
        "openId": null,
        "couponIdGroup": null,
        "remainHour": 0,
        "remainMinute": 0,
        "memberTypes": [ {
          "id": 3,
          "fee": 2680.0,
          "name": "圈外商学院",
          "description": "精英版（一年）",
          "openMonth": 12,
          "startTime": "2017.11.12",
          "endTime": "2018.11.11",
          "del": false
        }, {
          "id": 5,
          "fee": 299.0,
          "name": "课程训练营",
          "description": "小课训练营",
          "openMonth": 1,
          "startTime": "2017.11.12",
          "endTime": "2017.12.24",
          "del": false
        } ],
        "coupons": [],
        "privilege": true,
        "elite": null,
        "buttonStr": "升级商学院",
        "auditionStr": null
      }, "code": 200
    });
  })
});

router.get("/personal/province/load", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "msg": {
        "province": [ { id: null, name: "请选择" }, { "id": 1, "name": "北京市" }, { "id": 2, "name": "上海市" }, {
          "id": 3,
          "name": "天津市"
        }, { "id": 4, "name": "重庆市" }, { "id": 5, "name": "四川省" }, { "id": 6, "name": "贵州省" }, {
          "id": 7,
          "name": "云南省"
        }, { "id": 8, "name": "西藏省" }, { "id": 9, "name": "河南省" }, { "id": 10, "name": "湖北省" }, {
          "id": 11,
          "name": "湖南省"
        }, { "id": 12, "name": "广东省" }, { "id": 13, "name": "广西省" }, { "id": 14, "name": "陕西省" }, {
          "id": 15,
          "name": "甘肃省"
        }, { "id": 16, "name": "青海省" }, { "id": 17, "name": "宁夏省" }, { "id": 18, "name": "新疆省" }, {
          "id": 19,
          "name": "河北省"
        }, { "id": 20, "name": "山西省" }, { "id": 21, "name": "内蒙古省" }, { "id": 22, "name": "江苏省" }, {
          "id": 23,
          "name": "浙江省"
        }, { "id": 24, "name": "安徽省" }, { "id": 25, "name": "福建省" }, { "id": 26, "name": "江西省" }, {
          "id": 27,
          "name": "山东省"
        }, { "id": 28, "name": "辽宁省" }, { "id": 29, "name": "吉林省" }, { "id": 30, "name": "黑龙江省" }, {
          "id": 31,
          "name": "海南省"
        }, { "id": 32, "name": "香港特别行政区" }, { "id": 33, "name": "澳门特别行政区" } ],
        "city": {
          "福建省": [ { "id": 2501, "name": "福州市" }, { "id": 2502, "name": "厦门市" }, {
            "id": 2503,
            "name": "莆田市"
          }, { "id": 2504, "name": "三明市" }, { "id": 2505, "name": "泉州市" }, { "id": 2506, "name": "漳州市" }, {
            "id": 2507,
            "name": "南平市"
          }, { "id": 2508, "name": "龙岩市" }, { "id": 2509, "name": "宁德市" } ],
          "贵州省": [ { "id": 601, "name": "贵阳市" }, { "id": 602, "name": "六盘水市" }, { "id": 603, "name": "遵义市" }, {
            "id": 604,
            "name": "安顺市"
          }, { "id": 605, "name": "铜仁地区" }, { "id": 606, "name": "黔西南布依族苗族自治州" }, {
            "id": 607,
            "name": "毕节地区"
          }, { "id": 608, "name": "黔东南苗族侗族自治州" }, { "id": 609, "name": "黔南布依族苗族自治州" } ],
          "西藏省": [ { "id": 801, "name": "拉萨市" }, { "id": 802, "name": "昌都地区" }, { "id": 803, "name": "山南地区" }, {
            "id": 804,
            "name": "日喀则地区"
          }, { "id": 805, "name": "那曲地区" }, { "id": 806, "name": "阿里地区" }, { "id": 807, "name": "林芝地区" } ],
          "上海市": [ { "id": 201, "name": "上海市" } ],
          "湖北省": [ { "id": 1001, "name": "武汉市" }, { "id": 1002, "name": "黄石市" }, {
            "id": 1003,
            "name": "十堰市"
          }, { "id": 1004, "name": "宜昌市" }, { "id": 1005, "name": "襄阳市" }, { "id": 1006, "name": "鄂州市" }, {
            "id": 1007,
            "name": "荆门市"
          }, { "id": 1008, "name": "孝感市" }, { "id": 1009, "name": "荆州市" }, { "id": 1010, "name": "黄冈市" }, {
            "id": 1011,
            "name": "咸宁市"
          }, { "id": 1012, "name": "随州市" }, { "id": 1013, "name": "恩施土家族苗族自治州" }, { "id": 1014, "name": "省直辖行政单位" } ],
          "湖南省": [ { "id": 1101, "name": "长沙市" }, { "id": 1102, "name": "株洲市" }, {
            "id": 1103,
            "name": "湘潭市"
          }, { "id": 1104, "name": "衡阳市" }, { "id": 1105, "name": "邵阳市" }, { "id": 1106, "name": "岳阳市" }, {
            "id": 1107,
            "name": "常德市"
          }, { "id": 1108, "name": "张家界市" }, { "id": 1109, "name": "益阳市" }, { "id": 1110, "name": "郴州市" }, {
            "id": 1111,
            "name": "永州市"
          }, { "id": 1112, "name": "怀化市" }, { "id": 1113, "name": "娄底市" }, { "id": 1114, "name": "湘西土家族苗族自治州" } ],
          "广东省": [ { "id": 1201, "name": "广州市" }, { "id": 1202, "name": "韶关市" }, {
            "id": 1203,
            "name": "深圳市"
          }, { "id": 1204, "name": "珠海市" }, { "id": 1205, "name": "汕头市" }, { "id": 1206, "name": "佛山市" }, {
            "id": 1207,
            "name": "江门市"
          }, { "id": 1208, "name": "湛江市" }, { "id": 1209, "name": "茂名市" }, { "id": 1210, "name": "肇庆市" }, {
            "id": 1211,
            "name": "惠州市"
          }, { "id": 1212, "name": "梅州市" }, { "id": 1213, "name": "汕尾市" }, { "id": 1214, "name": "河源市" }, {
            "id": 1215,
            "name": "阳江市"
          }, { "id": 1216, "name": "清远市" }, { "id": 1217, "name": "东莞市" }, { "id": 1218, "name": "中山市" }, {
            "id": 1219,
            "name": "潮州市"
          }, { "id": 1220, "name": "揭阳市" }, { "id": 1221, "name": "云浮市" } ],
          "澳门特别行政区": [ { "id": 3301, "name": "澳门特别行政区" } ],
          "香港特别行政区": [ { "id": 3201, "name": "香港特别行政区" } ],
          "四川省": [ { "id": 501, "name": "成都市" }, { "id": 502, "name": "自贡市" }, { "id": 503, "name": "攀枝花市" }, {
            "id": 504,
            "name": "泸州市"
          }, { "id": 505, "name": "德阳市" }, { "id": 506, "name": "绵阳市" }, { "id": 507, "name": "广元市" }, {
            "id": 508,
            "name": "遂宁市"
          }, { "id": 509, "name": "内江市" }, { "id": 510, "name": "乐山市" }, { "id": 511, "name": "南充市" }, {
            "id": 512,
            "name": "眉山市"
          }, { "id": 513, "name": "宜宾市" }, { "id": 514, "name": "广安市" }, { "id": 515, "name": "达州市" }, {
            "id": 516,
            "name": "雅安市"
          }, { "id": 517, "name": "巴中市" }, { "id": 518, "name": "资阳市" }, { "id": 519, "name": "阿坝藏族羌族自治州" }, {
            "id": 520,
            "name": "甘孜藏族自治州"
          }, { "id": 521, "name": "凉山彝族自治州" } ],
          "安徽省": [ { "id": 2401, "name": "合肥市" }, { "id": 2402, "name": "芜湖市" }, {
            "id": 2403,
            "name": "蚌埠市"
          }, { "id": 2404, "name": "淮南市" }, { "id": 2405, "name": "马鞍山市" }, { "id": 2406, "name": "淮北市" }, {
            "id": 2407,
            "name": "铜陵市"
          }, { "id": 2408, "name": "安庆市" }, { "id": 2409, "name": "黄山市" }, { "id": 2410, "name": "滁州市" }, {
            "id": 2411,
            "name": "阜阳市"
          }, { "id": 2412, "name": "宿州市" }, { "id": 2413, "name": "巢湖市" }, { "id": 2414, "name": "六安市" }, {
            "id": 2415,
            "name": "亳州市"
          }, { "id": 2416, "name": "池州市" }, { "id": 2417, "name": "宣城市" } ],
          "广西省": [ { "id": 1301, "name": "南宁市" }, { "id": 1302, "name": "柳州市" }, {
            "id": 1303,
            "name": "桂林市"
          }, { "id": 1304, "name": "梧州市" }, { "id": 1305, "name": "北海市" }, { "id": 1306, "name": "防城港市" }, {
            "id": 1307,
            "name": "钦州市"
          }, { "id": 1308, "name": "贵港市" }, { "id": 1309, "name": "玉林市" }, { "id": 1310, "name": "百色市" }, {
            "id": 1311,
            "name": "贺州市"
          }, { "id": 1312, "name": "河池市" }, { "id": 1313, "name": "来宾市" }, { "id": 1314, "name": "崇左市" } ],
          "江苏省": [ { "id": 2201, "name": "南京市" }, { "id": 2202, "name": "无锡市" }, {
            "id": 2203,
            "name": "徐州市"
          }, { "id": 2204, "name": "常州市" }, { "id": 2205, "name": "苏州市" }, { "id": 2206, "name": "南通市" }, {
            "id": 2207,
            "name": "连云港市"
          }, { "id": 2208, "name": "淮安市" }, { "id": 2209, "name": "盐城市" }, { "id": 2210, "name": "扬州市" }, {
            "id": 2211,
            "name": "镇江市"
          }, { "id": 2212, "name": "泰州市" }, { "id": 2213, "name": "宿迁市" } ],
          "内蒙古省": [ { "id": 2101, "name": "呼和浩特市" }, { "id": 2102, "name": "包头市" }, {
            "id": 2103,
            "name": "乌海市"
          }, { "id": 2104, "name": "赤峰市" }, { "id": 2105, "name": "通辽市" }, { "id": 2106, "name": "鄂尔多斯市" }, {
            "id": 2107,
            "name": "呼伦贝尔市"
          }, { "id": 2108, "name": "巴彦淖尔市" }, { "id": 2109, "name": "乌兰察布市" }, {
            "id": 2110,
            "name": "兴安盟"
          }, { "id": 2111, "name": "锡林郭勒盟" }, { "id": 2112, "name": "阿拉善盟" } ],
          "吉林省": [ { "id": 2901, "name": "长春市" }, { "id": 2902, "name": "吉林市" }, {
            "id": 2903,
            "name": "四平市"
          }, { "id": 2904, "name": "辽源市" }, { "id": 2905, "name": "通化市" }, { "id": 2906, "name": "白山市" }, {
            "id": 2907,
            "name": "松原市"
          }, { "id": 2908, "name": "白城市" }, { "id": 2909, "name": "延边朝鲜族自治州" } ],
          "河南省": [ { "id": 901, "name": "郑州市" }, { "id": 902, "name": "开封市" }, { "id": 903, "name": "洛阳市" }, {
            "id": 904,
            "name": "平顶山市"
          }, { "id": 905, "name": "安阳市" }, { "id": 906, "name": "鹤壁市" }, { "id": 907, "name": "新乡市" }, {
            "id": 908,
            "name": "焦作市"
          }, { "id": 909, "name": "濮阳市" }, { "id": 910, "name": "许昌市" }, { "id": 911, "name": "漯河市" }, {
            "id": 912,
            "name": "三门峡市"
          }, { "id": 913, "name": "南阳市" }, { "id": 914, "name": "商丘市" }, { "id": 915, "name": "信阳市" }, {
            "id": 916,
            "name": "周口市"
          }, { "id": 917, "name": "驻马店市" } ],
          "河北省": [ { "id": 1901, "name": "石家庄市" }, { "id": 1902, "name": "唐山市" }, {
            "id": 1903,
            "name": "秦皇岛市"
          }, { "id": 1904, "name": "邯郸市" }, { "id": 1905, "name": "邢台市" }, { "id": 1906, "name": "保定市" }, {
            "id": 1907,
            "name": "张家口市"
          }, { "id": 1908, "name": "承德市" }, { "id": 1909, "name": "沧州市" }, { "id": 1910, "name": "廊坊市" }, {
            "id": 1911,
            "name": "衡水市"
          } ],
          "海南省": [ { "id": 3101, "name": "海口市" }, { "id": 3102, "name": "三亚市" }, { "id": 3103, "name": "省直辖县级行政单位" } ],
          "重庆市": [ { "id": 401, "name": "重庆市" } ],
          "江西省": [ { "id": 2601, "name": "南昌市" }, { "id": 2602, "name": "景德镇市" }, {
            "id": 2603,
            "name": "萍乡市"
          }, { "id": 2604, "name": "九江市" }, { "id": 2605, "name": "新余市" }, { "id": 2606, "name": "鹰潭市" }, {
            "id": 2607,
            "name": "赣州市"
          }, { "id": 2608, "name": "吉安市" }, { "id": 2609, "name": "宜春市" }, { "id": 2610, "name": "抚州市" }, {
            "id": 2611,
            "name": "上饶市"
          } ],
          "新疆省": [ { "id": 1801, "name": "乌鲁木齐市" }, { "id": 1802, "name": "克拉玛依市" }, {
            "id": 1803,
            "name": "吐鲁番地区"
          }, { "id": 1804, "name": "哈密地区" }, { "id": 1805, "name": "昌吉回族自治州" }, {
            "id": 1806,
            "name": "博尔塔拉蒙古自治州"
          }, { "id": 1807, "name": "巴音郭楞蒙古自治州" }, { "id": 1808, "name": "阿克苏地区" }, {
            "id": 1809,
            "name": "克孜勒苏柯尔克孜自治州"
          }, { "id": 1810, "name": "喀什地区" }, { "id": 1811, "name": "和田地区" }, {
            "id": 1812,
            "name": "伊犁哈萨克自治州"
          }, { "id": 1813, "name": "塔城地区" }, { "id": 1814, "name": "阿勒泰地区" }, { "id": 1815, "name": "省直辖行政单位" } ],
          "云南省": [ { "id": 701, "name": "昆明市" }, { "id": 702, "name": "曲靖市" }, { "id": 703, "name": "玉溪市" }, {
            "id": 704,
            "name": "保山市"
          }, { "id": 705, "name": "昭通市" }, { "id": 706, "name": "丽江市" }, { "id": 707, "name": "思茅市" }, {
            "id": 708,
            "name": "临沧市"
          }, { "id": 709, "name": "楚雄彝族自治州" }, { "id": 710, "name": "红河哈尼族彝族自治州" }, {
            "id": 711,
            "name": "文山壮族苗族自治州"
          }, { "id": 712, "name": "西双版纳傣族自治州" }, { "id": 713, "name": "大理白族自治州" }, {
            "id": 714,
            "name": "德宏傣族景颇族自治州"
          }, { "id": 715, "name": "怒江傈僳族自治州" }, { "id": 716, "name": "迪庆藏族自治州" } ],
          "北京市": [ { "id": 101, "name": "北京市" } ],
          "甘肃省": [ { "id": 1501, "name": "兰州市" }, { "id": 1502, "name": "嘉峪关市" }, {
            "id": 1503,
            "name": "金昌市"
          }, { "id": 1504, "name": "白银市" }, { "id": 1505, "name": "天水市" }, { "id": 1506, "name": "武威市" }, {
            "id": 1507,
            "name": "张掖市"
          }, { "id": 1508, "name": "平凉市" }, { "id": 1509, "name": "酒泉市" }, { "id": 1510, "name": "庆阳市" }, {
            "id": 1511,
            "name": "定西市"
          }, { "id": 1512, "name": "陇南市" }, { "id": 1513, "name": "临夏回族自治州" }, { "id": 1514, "name": "甘南藏族自治州" } ],
          "宁夏省": [ { "id": 1701, "name": "银川市" }, { "id": 1702, "name": "石嘴山市" }, {
            "id": 1703,
            "name": "吴忠市"
          }, { "id": 1704, "name": "固原市" }, { "id": 1705, "name": "中卫市" } ],
          "陕西省": [ { "id": 1401, "name": "西安市" }, { "id": 1402, "name": "铜川市" }, {
            "id": 1403,
            "name": "宝鸡市"
          }, { "id": 1404, "name": "咸阳市" }, { "id": 1405, "name": "渭南市" }, { "id": 1406, "name": "延安市" }, {
            "id": 1407,
            "name": "汉中市"
          }, { "id": 1408, "name": "榆林市" }, { "id": 1409, "name": "安康市" }, { "id": 1410, "name": "商洛市" } ],
          "山东省": [ { "id": 2701, "name": "济南市" }, { "id": 2702, "name": "青岛市" }, {
            "id": 2703,
            "name": "淄博市"
          }, { "id": 2704, "name": "枣庄市" }, { "id": 2705, "name": "东营市" }, { "id": 2706, "name": "烟台市" }, {
            "id": 2707,
            "name": "潍坊市"
          }, { "id": 2708, "name": "济宁市" }, { "id": 2709, "name": "泰安市" }, { "id": 2710, "name": "威海市" }, {
            "id": 2711,
            "name": "日照市"
          }, { "id": 2712, "name": "莱芜市" }, { "id": 2713, "name": "临沂市" }, { "id": 2714, "name": "德州市" }, {
            "id": 2715,
            "name": "聊城市"
          }, { "id": 2716, "name": "滨州市" }, { "id": 2717, "name": "荷泽市" } ],
          "浙江省": [ { "id": 2301, "name": "杭州市" }, { "id": 2302, "name": "宁波市" }, {
            "id": 2303,
            "name": "温州市"
          }, { "id": 2304, "name": "嘉兴市" }, { "id": 2305, "name": "湖州市" }, { "id": 2306, "name": "绍兴市" }, {
            "id": 2307,
            "name": "金华市"
          }, { "id": 2308, "name": "衢州市" }, { "id": 2309, "name": "舟山市" }, { "id": 2310, "name": "台州市" }, {
            "id": 2311,
            "name": "丽水市"
          } ],
          "青海省": [ { "id": 1601, "name": "西宁市" }, { "id": 1602, "name": "海东地区" }, {
            "id": 1603,
            "name": "海北藏族自治州"
          }, { "id": 1604, "name": "黄南藏族自治州" }, { "id": 1605, "name": "海南藏族自治州" }, {
            "id": 1606,
            "name": "果洛藏族自治州"
          }, { "id": 1607, "name": "玉树藏族自治州" }, { "id": 1608, "name": "海西蒙古族藏族自治州" } ],
          "天津市": [ { "id": 301, "name": "天津市" } ],
          "辽宁省": [ { "id": 2801, "name": "沈阳市" }, { "id": 2802, "name": "大连市" }, {
            "id": 2803,
            "name": "鞍山市"
          }, { "id": 2804, "name": "抚顺市" }, { "id": 2805, "name": "本溪市" }, { "id": 2806, "name": "丹东市" }, {
            "id": 2807,
            "name": "锦州市"
          }, { "id": 2808, "name": "营口市" }, { "id": 2809, "name": "阜新市" }, { "id": 2810, "name": "辽阳市" }, {
            "id": 2811,
            "name": "盘锦市"
          }, { "id": 2812, "name": "铁岭市" }, { "id": 2813, "name": "朝阳市" }, { "id": 2814, "name": "葫芦岛市" } ],
          "黑龙江省": [ { "id": 3001, "name": "哈尔滨市" }, { "id": 3002, "name": "齐齐哈尔市" }, {
            "id": 3003,
            "name": "鸡西市"
          }, { "id": 3004, "name": "鹤岗市" }, { "id": 3005, "name": "双鸭山市" }, { "id": 3006, "name": "大庆市" }, {
            "id": 3007,
            "name": "伊春市"
          }, { "id": 3008, "name": "佳木斯市" }, { "id": 3009, "name": "七台河市" }, { "id": 3010, "name": "牡丹江市" }, {
            "id": 3011,
            "name": "黑河市"
          }, { "id": 3012, "name": "绥化市" }, { "id": 3013, "name": "大兴安岭地区" } ],
          "山西省": [ { "id": 2001, "name": "太原市" }, { "id": 2002, "name": "大同市" }, {
            "id": 2003,
            "name": "阳泉市"
          }, { "id": 2004, "name": "长治市" }, { "id": 2005, "name": "晋城市" }, { "id": 2006, "name": "朔州市" }, {
            "id": 2007,
            "name": "晋中市"
          }, { "id": 2008, "name": "运城市" }, { "id": 2009, "name": "忻州市" }, { "id": 2010, "name": "临汾市" }, {
            "id": 2011,
            "name": "吕梁市"
          } ]
        }
      }, "code": 200
    }), Math.random() * 1500)
});
router.get("/signup/rise/member/*", (req, res) => {
  setTimeout(() => {
    res.status(200).json(
      {
        "msg": {
          "openId": null,
          "couponIdGroup": null,
          "memberTypes": null,
          "memberType": {
            "id": 8,
            "fee": 0.01,
            "initPrice": 2333.0,
            "name": "商业进阶课",
            "description": "商业进阶课",
            "openMonth": 6,
            "startTime": "2018.04.10",
            "endTime": "2018.10.09",
            "del": false
          },
          "tip": null,
          "privilege": true,
          "elite": null,
          "buttonStr": "立即入学",
          "auditionStr": null,
          "remainHour": 0,
          "remainMinute": 0
        }, "code": 200
      }
    );
  })
})

router.get("/wx/js/signature", (req, res) => {
  setTimeout(() =>
    res.status(200).json({
      "code": 200,
      "msg": {
        appId: '', // 必填，公众号的唯一标识
        timestamp: '', // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名，见附录1
      }
    }), Math.random() * 1500
  )
})

router.post("/signup/payment/coupon/calculate", (req, res) => {
  setTimeout(() =>
    res.status(200).json({ "msg": 2381.01, "code": 200 }), Math.random() * 1500
  )
})


module.exports = router;
