'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
 
gulp.task('sass', function () {
 return gulp.src('./public/sass/**/*.scss')
   .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
   .pipe(gulp.dest('./public/css'));
});
gulp.task('default', function () {
  gulp.watch('./public/sass/**/*.scss', ['sass']);
});