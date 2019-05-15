var gulp = require('gulp')
var ftp = require('gulp-ftp')
var util = require('gulp-util')
var exec = require('child_process').exec

gulp.task('ftp', function() {
  const pkg = require('./package.json')
  //exec(`ssh betauser@106.14.26.18 'mkdir -p /data/static'`)
  exec(`scp __build__/pay_bundle.js ftpuser@101.132.188.185:/data/static`)
  exec('exit')
})

gulp.task('beta', function() {
  const pkg = require('./package.json')
  //exec(`ssh betauser@106.14.26.18 'mkdir -p /data/static'`)
  exec(
    `scp __build__/pay_bundle.js ftpuser@101.132.188.185:/data/deploy/beta/nethunder/data/static`
  )
  exec('exit')
})
