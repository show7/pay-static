/**
 category：要监控的目标的类型名称，通常是同一组目标的名字，比如"视频"、"音乐"、"软件"、"游戏"等等。该项必填，不填、填"-"的事件会被抛弃。
 action：用户跟目标交互的行为，如"播放"、"暂停"、"下载"等等。该项必填，不填、填"-"的事件会被抛弃。
 opt_label：事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项选填，不填、填"-"代表此项为空。
 opt_value：事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。
 * */
export function mevent(category, action, opt_label = undefined, opt_value = undefined){
  if(_hmt){
    _hmt.push(['_trackEvent', category, action, opt_label, opt_value])
  }
}

/*
 index：是自定义变量所占用的位置。取值为从1到5。该项必选。
 name：是自定义变量的名字。该项必选。
 value：就是自定义变量的值。该项必选。
 opt_scope：是自定义变量的作用范围。该项可选。1为访客级别（对该访客始终有效），2为访次级别（在当前访次内生效），3为页面级别（仅在当前页面生效）。默认为2。
* */
export function setVar(index, name, value, opt_scope = 2){
  if(_hmt){
    _hmt.push(['_setCustomVar', index, name, value, opt_scope])
  }
}

