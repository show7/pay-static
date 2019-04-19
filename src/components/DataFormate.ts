export const DataFormat = function(milliseconds) {
  // var time = Number(new Date(new Date().getTime() + 10 * 60 * 1000))
  //获取当前时间
  // var nowTime = new Date().getTime()
  //获取时间差
  var timediff = milliseconds
  //获取还剩多少天
  // var day =
  //   parseInt(timediff / 3600000 / 24) >= 10
  //     ? parseInt(timediff / 3600000 / 24)
  //     : '0' + parseInt(timediff / 3600000 / 24)
  //获取还剩多少小时
  // var hour =
  //   parseInt((timediff / 3600000) % 24) >= 10
  //     ? parseInt((timediff / 3600000) % 24)
  //     : '0' + parseInt((timediff / 3600000) % 24)
  //获取还剩多少分钟
  var minute =
    parseInt(timediff / 60000) >= 10
      ? parseInt(timediff / 60000)
      : '0' + parseInt(timediff / 60000)
  //获取还剩多少秒
  var second =
    parseInt((timediff - 60000 * minute) / 1000) >= 10
      ? parseInt((timediff - 60000 * minute) / 1000)
      : '0' + parseInt((timediff - 60000 * minute) / 1000)
  //获取还剩多少毫秒
  var milli = 0
  if (parseInt(timediff - 60000 * minute - 1000 * second) >= 100) {
    milli = parseInt(timediff - 60000 * minute - 1000 * second)
  } else if (
    parseInt(timediff - 60000 * minute - 1000 * second) >= 10 &&
    parseInt(timediff - 60000 * minute - 1000 * second) < 100
  ) {
    milli = '0' + parseInt(timediff - 60000 * minute - 1000 * second)
  } else {
    milli = '00' + parseInt(timediff - 60000 * minute - 1000 * second)
  }
  return minute + ':' + second
}
