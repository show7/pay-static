var Router = require("express").Router;

var router = new Router();

router.get("/rise/business/load/questions", (req, res) => {
  setTimeout(() => {
  res.status(200).json({"msg":{"payApplyFlag":false,"questions":[{"series":1,"questions":[{"id":18,"sequence":1,"series":1,"question":"1. 请选择你目前从事的行业：","tips":null,"placeholder":null,"type":1,"request":true,"preChoiceId":null,"choices":[{"id":115,"subject":"互联网/电子商务","questionId":18,"sequence":1,"defaultSelected":false,"del":false},{"id":116,"subject":"IT/软硬件服务","questionId":18,"sequence":2,"defaultSelected":false,"del":false},{"id":117,"subject":"医疗健康","questionId":18,"sequence":3,"defaultSelected":false,"del":false},{"id":118,"subject":"快速消费品(食品/饮料/化妆品)","questionId":18,"sequence":4,"defaultSelected":false,"del":false},{"id":119,"subject":"耐用消费品(服饰家居/工艺玩具)","questionId":18,"sequence":5,"defaultSelected":false,"del":false},{"id":120,"subject":"贸易零售","questionId":18,"sequence":6,"defaultSelected":false,"del":false},{"id":121,"subject":"汽车及零配件制造","questionId":18,"sequence":7,"defaultSelected":false,"del":false},{"id":122,"subject":"工业设备制造","questionId":18,"sequence":8,"defaultSelected":false,"del":false},{"id":123,"subject":"通信电子","questionId":18,"sequence":9,"defaultSelected":false,"del":false},{"id":124,"subject":"物流交通","questionId":18,"sequence":10,"defaultSelected":false,"del":false},{"id":125,"subject":"能源化工","questionId":18,"sequence":11,"defaultSelected":false,"del":false},{"id":126,"subject":"金融行业","questionId":18,"sequence":12,"defaultSelected":false,"del":false},{"id":127,"subject":"管理咨询","questionId":18,"sequence":13,"defaultSelected":false,"del":false},{"id":128,"subject":"法律","questionId":18,"sequence":14,"defaultSelected":false,"del":false},{"id":129,"subject":"教育培训","questionId":18,"sequence":15,"defaultSelected":false,"del":false},{"id":130,"subject":"餐饮娱乐","questionId":18,"sequence":16,"defaultSelected":false,"del":false},{"id":131,"subject":"建筑地产","questionId":18,"sequence":17,"defaultSelected":false,"del":false},{"id":132,"subject":"中介/猎头/认证服务","questionId":18,"sequence":18,"defaultSelected":false,"del":false},{"id":133,"subject":"其他行业","questionId":18,"sequence":19,"defaultSelected":false,"del":false}],"del":false,"category":2},{"id":19,"sequence":2,"series":1,"question":"2. 请选择你目前从事的职业：","tips":null,"placeholder":null,"type":1,"request":true,"preChoiceId":null,"choices":[{"id":134,"subject":"互联网运营","questionId":19,"sequence":1,"defaultSelected":false,"del":false},{"id":135,"subject":"互联网产品","questionId":19,"sequence":2,"defaultSelected":false,"del":false},{"id":136,"subject":"研发/技术人员","questionId":19,"sequence":3,"defaultSelected":false,"del":false},{"id":137,"subject":"销售","questionId":19,"sequence":4,"defaultSelected":false,"del":false},{"id":138,"subject":"市场/公关","questionId":19,"sequence":5,"defaultSelected":false,"del":false},{"id":139,"subject":"客户服务","questionId":19,"sequence":6,"defaultSelected":false,"del":false},{"id":140,"subject":"人力资源","questionId":19,"sequence":7,"defaultSelected":false,"del":false},{"id":141,"subject":"财务审计","questionId":19,"sequence":8,"defaultSelected":false,"del":false},{"id":142,"subject":"行政后勤","questionId":19,"sequence":9,"defaultSelected":false,"del":false},{"id":143,"subject":"生产运营","questionId":19,"sequence":10,"defaultSelected":false,"del":false},{"id":144,"subject":"咨询顾问","questionId":19,"sequence":11,"defaultSelected":false,"del":false},{"id":145,"subject":"律师","questionId":19,"sequence":12,"defaultSelected":false,"del":false},{"id":146,"subject":"教师","questionId":19,"sequence":13,"defaultSelected":false,"del":false},{"id":147,"subject":"全日制学生","questionId":19,"sequence":14,"defaultSelected":false,"del":false},{"id":148,"subject":"专业人士(如记者、摄影师、医生等)","questionId":19,"sequence":15,"defaultSelected":false,"del":false},{"id":149,"subject":"其他职业","questionId":19,"sequence":16,"defaultSelected":false,"del":false}],"del":false,"category":2}]},{"series":2,"questions":[{"id":21,"sequence":3,"series":2,"question":"3. 是否有工作经验？","tips":null,"placeholder":null,"type":2,"request":true,"preChoiceId":null,"choices":[{"id":156,"subject":"是","questionId":21,"sequence":1,"defaultSelected":false,"del":false},{"id":157,"subject":"否","questionId":21,"sequence":2,"defaultSelected":false,"del":false}],"del":false,"category":2},{"id":20,"sequence":4,"series":2,"question":"3.1 请选择你的职位层级：","tips":null,"placeholder":null,"type":1,"request":true,"preChoiceId":156,"choices":[{"id":150,"subject":"普通员工","questionId":20,"sequence":1,"defaultSelected":false,"del":false},{"id":151,"subject":"承担管理权限的资深员工","questionId":20,"sequence":2,"defaultSelected":false,"del":false},{"id":152,"subject":"一线主管","questionId":20,"sequence":3,"defaultSelected":false,"del":false},{"id":153,"subject":"部门负责人","questionId":20,"sequence":4,"defaultSelected":false,"del":false},{"id":154,"subject":"公司高管","questionId":20,"sequence":5,"defaultSelected":false,"del":false},{"id":155,"subject":"CEO/公司创始人/董事","questionId":20,"sequence":6,"defaultSelected":false,"del":false}],"del":false,"category":2},{"id":36,"sequence":7,"series":2,"question":"3.1（选填）请上传一张你的学生信息证明照片（学生证、学生卡等）：","tips":"说明：<br/>上传照片将帮助招生委员会做出录取决定，增加申请成功概率。<br/>\n圈外会严格保密，不会用于任何其他用途。","placeholder":null,"type":8,"request":false,"preChoiceId":157,"choices":null,"del":false,"category":2}]},{"series":3,"questions":[{"id":22,"sequence":5,"series":3,"question":"3.2 请填写你的首次工作年份：","tips":null,"placeholder":null,"type":1,"request":true,"preChoiceId":156,"choices":[{"id":158,"subject":"1960","questionId":22,"sequence":1,"defaultSelected":false,"del":false},{"id":159,"subject":"1961","questionId":22,"sequence":2,"defaultSelected":false,"del":false},{"id":160,"subject":"1962","questionId":22,"sequence":3,"defaultSelected":false,"del":false},{"id":161,"subject":"1963","questionId":22,"sequence":4,"defaultSelected":false,"del":false},{"id":162,"subject":"1964","questionId":22,"sequence":5,"defaultSelected":false,"del":false},{"id":163,"subject":"1965","questionId":22,"sequence":6,"defaultSelected":false,"del":false},{"id":164,"subject":"1966","questionId":22,"sequence":7,"defaultSelected":false,"del":false},{"id":165,"subject":"1967","questionId":22,"sequence":8,"defaultSelected":false,"del":false},{"id":166,"subject":"1968","questionId":22,"sequence":9,"defaultSelected":false,"del":false},{"id":167,"subject":"1969","questionId":22,"sequence":10,"defaultSelected":false,"del":false},{"id":168,"subject":"1970","questionId":22,"sequence":11,"defaultSelected":false,"del":false},{"id":169,"subject":"1971","questionId":22,"sequence":12,"defaultSelected":false,"del":false},{"id":170,"subject":"1972","questionId":22,"sequence":13,"defaultSelected":false,"del":false},{"id":171,"subject":"1973","questionId":22,"sequence":14,"defaultSelected":false,"del":false},{"id":172,"subject":"1974","questionId":22,"sequence":15,"defaultSelected":false,"del":false},{"id":173,"subject":"1975","questionId":22,"sequence":16,"defaultSelected":false,"del":false},{"id":174,"subject":"1976","questionId":22,"sequence":17,"defaultSelected":false,"del":false},{"id":175,"subject":"1977","questionId":22,"sequence":18,"defaultSelected":false,"del":false},{"id":176,"subject":"1978","questionId":22,"sequence":19,"defaultSelected":false,"del":false},{"id":177,"subject":"1979","questionId":22,"sequence":20,"defaultSelected":false,"del":false},{"id":178,"subject":"1980","questionId":22,"sequence":21,"defaultSelected":false,"del":false},{"id":179,"subject":"1981","questionId":22,"sequence":22,"defaultSelected":false,"del":false},{"id":180,"subject":"1982","questionId":22,"sequence":23,"defaultSelected":false,"del":false},{"id":181,"subject":"1983","questionId":22,"sequence":24,"defaultSelected":false,"del":false},{"id":182,"subject":"1984","questionId":22,"sequence":25,"defaultSelected":false,"del":false},{"id":183,"subject":"1985","questionId":22,"sequence":26,"defaultSelected":false,"del":false},{"id":184,"subject":"1986","questionId":22,"sequence":27,"defaultSelected":false,"del":false},{"id":185,"subject":"1987","questionId":22,"sequence":28,"defaultSelected":false,"del":false},{"id":186,"subject":"1988","questionId":22,"sequence":29,"defaultSelected":false,"del":false},{"id":187,"subject":"1989","questionId":22,"sequence":30,"defaultSelected":false,"del":false},{"id":188,"subject":"1990","questionId":22,"sequence":31,"defaultSelected":false,"del":false},{"id":189,"subject":"1991","questionId":22,"sequence":32,"defaultSelected":false,"del":false},{"id":190,"subject":"1992","questionId":22,"sequence":33,"defaultSelected":false,"del":false},{"id":191,"subject":"1993","questionId":22,"sequence":34,"defaultSelected":false,"del":false},{"id":192,"subject":"1994","questionId":22,"sequence":35,"defaultSelected":false,"del":false},{"id":193,"subject":"1995","questionId":22,"sequence":36,"defaultSelected":false,"del":false},{"id":194,"subject":"1996","questionId":22,"sequence":37,"defaultSelected":false,"del":false},{"id":195,"subject":"1997","questionId":22,"sequence":38,"defaultSelected":false,"del":false},{"id":196,"subject":"1998","questionId":22,"sequence":39,"defaultSelected":false,"del":false},{"id":197,"subject":"1999","questionId":22,"sequence":40,"defaultSelected":false,"del":false},{"id":198,"subject":"2000","questionId":22,"sequence":41,"defaultSelected":true,"del":false},{"id":199,"subject":"2001","questionId":22,"sequence":42,"defaultSelected":false,"del":false},{"id":200,"subject":"2002","questionId":22,"sequence":43,"defaultSelected":false,"del":false},{"id":201,"subject":"2003","questionId":22,"sequence":44,"defaultSelected":false,"del":false},{"id":202,"subject":"2004","questionId":22,"sequence":45,"defaultSelected":false,"del":false},{"id":203,"subject":"2005","questionId":22,"sequence":46,"defaultSelected":false,"del":false},{"id":204,"subject":"2006","questionId":22,"sequence":47,"defaultSelected":false,"del":false},{"id":205,"subject":"2007","questionId":22,"sequence":48,"defaultSelected":false,"del":false},{"id":206,"subject":"2008","questionId":22,"sequence":49,"defaultSelected":false,"del":false},{"id":207,"subject":"2009","questionId":22,"sequence":50,"defaultSelected":false,"del":false},{"id":208,"subject":"2010","questionId":22,"sequence":51,"defaultSelected":false,"del":false},{"id":209,"subject":"2011","questionId":22,"sequence":52,"defaultSelected":false,"del":false},{"id":210,"subject":"2012","questionId":22,"sequence":53,"defaultSelected":false,"del":false},{"id":211,"subject":"2013","questionId":22,"sequence":54,"defaultSelected":false,"del":false},{"id":212,"subject":"2014","questionId":22,"sequence":55,"defaultSelected":false,"del":false},{"id":213,"subject":"2015","questionId":22,"sequence":56,"defaultSelected":false,"del":false},{"id":214,"subject":"2016","questionId":22,"sequence":57,"defaultSelected":false,"del":false},{"id":215,"subject":"2017","questionId":22,"sequence":58,"defaultSelected":false,"del":false},{"id":225,"subject":"2018","questionId":22,"sequence":59,"defaultSelected":false,"del":false}],"del":false,"category":2},{"id":35,"sequence":6,"series":3,"question":"3.3（选填）请上传一张你的职位信息证明照片（名片、工卡等）：","tips":"说明：<br/>上传照片将帮助招生委员会做出录取决定，增加申请成功概率。<br/>\n圈外会严格保密，不会用于任何其他用途。","placeholder":null,"type":8,"request":false,"preChoiceId":156,"choices":null,"del":false,"category":2}]},{"series":4,"questions":[{"id":23,"sequence":8,"series":4,"question":"4. 请选择你的最高学历：","tips":null,"placeholder":null,"type":1,"request":true,"preChoiceId":null,"choices":[{"id":216,"subject":"专科及以下","questionId":23,"sequence":1,"defaultSelected":false,"del":false},{"id":217,"subject":"本科","questionId":23,"sequence":2,"defaultSelected":false,"del":false},{"id":218,"subject":"硕士","questionId":23,"sequence":3,"defaultSelected":false,"del":false},{"id":219,"subject":"博士及以上","questionId":23,"sequence":4,"defaultSelected":false,"del":false}],"del":false,"category":2},{"id":24,"sequence":9,"series":4,"question":"5. 请填写你所毕业的最高学历院校名称：","tips":null,"placeholder":null,"type":3,"request":true,"preChoiceId":null,"choices":null,"del":false,"category":2}]},{"series":5,"questions":[{"id":25,"sequence":10,"series":5,"question":"6 请选择你所在的城市：","tips":"说明：方便我们邀请您加入校友会和当地活动","placeholder":null,"type":5,"request":true,"preChoiceId":null,"choices":null,"del":false,"category":2}]},{"series":6,"questions":[{"id":27,"sequence":11,"series":6,"question":"7. 你是否要申请商学院奖学金？","tips":"说明：商学院奖学金视申请而定，范围在200元 - 600元不等。极少数特别有诚意者，将有机会半免或全免；奖学金申请结果将与商学院申请结果共同发放。","placeholder":null,"type":2,"request":true,"preChoiceId":null,"choices":[{"id":220,"subject":"是","questionId":27,"sequence":1,"defaultSelected":false,"del":false},{"id":221,"subject":"否","questionId":27,"sequence":2,"defaultSelected":false,"del":false}],"del":false,"category":2},{"id":28,"sequence":12,"series":6,"question":"7.1 请填写你的奖学金申请理由，告诉我们：为什么应该给你提供奖学金？","tips":null,"placeholder":"请填写理由","type":4,"request":true,"preChoiceId":220,"choices":null,"del":false,"category":2},{"id":30,"sequence":13,"series":6,"question":"7.2（选填）请说说你为什么想要加入圈外商学院？","tips":"说明：认真回答可以增加申请成功概率","placeholder":null,"type":4,"request":false,"preChoiceId":null,"choices":null,"del":false,"category":2}]},{"series":7,"questions":[{"id":32,"sequence":14,"series":7,"question":"8. 你目前在国内吗？","tips":null,"placeholder":null,"type":2,"request":true,"preChoiceId":null,"choices":[{"id":222,"subject":"是","questionId":32,"sequence":1,"defaultSelected":true,"del":false},{"id":223,"subject":"否","questionId":32,"sequence":2,"defaultSelected":false,"del":false}],"del":false,"category":2},{"id":29,"sequence":15,"series":7,"question":"8.1 请输入你的手机号码：","tips":"说明：仅用于重要消息通知，不会泄露给第三方或用于其他商业用途","placeholder":"请填写手机号码","type":6,"request":true,"preChoiceId":222,"choices":null,"del":false,"category":2},{"id":33,"sequence":16,"series":7,"question":"8.1 请输入你的微信号：","tips":"说明：请填写你的微信号（在\"微信\"-\"我\"中可查询），用于重要消息通知，该信息不会泄露给第三方或用于其他商业用途","placeholder":"请填写微信号","type":3,"request":true,"preChoiceId":223,"choices":null,"del":false,"category":2},{"id":38,"sequence":16,"series":7,"question":"8.2 请输入你的微信号：","tips":"说明：请填写你的微信号（在\"微信\"-\"我\"中可查询），用于重要消息通知，该信息不会泄露给第三方或用于其他商业用途","placeholder":"请填写微信号","type":3,"request":true,"preChoiceId":222,"choices":null,"del":false,"category":2}]}]},"code":200})
}, Math.random() * 1500);
});

router.post("/signup/submit/apply", (req, res) => {
  setTimeout(() =>{
  res.status(200).json(
    {"msg":"ok","code":200}
  )}, Math.random() * 1500);
});

router.get("/rise/business/check/submit/apply", (req, res) => {
  setTimeout(() =>{
  res.status(200).json(
    {"msg":"ok","code":200}
  )}, Math.random() * 1500);
});

module.exports = router;
