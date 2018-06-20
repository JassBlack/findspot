"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
// var imageminMozjpeg = require('imagemin-mozjpeg');
var run = require("run-sequence");
var del = require("del");
var jsmin = require('gulp-jsmin');


gulp.task("style", function() {
  gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions"
      ]}), 
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest("css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
});

// gulp.task("images", () => {
//  return gulp.src("images/**/*") 
/*    .pipe(imagemin([
   //   imageminMozjpeg({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      {verbose: true}
    ]))
    .pipe(gulp.dest("build/images"));
}); */

gulp.task("jsmin", function() {
  return gulp.src("js/**/*.js") 
    .pipe(jsmin())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest("build/js"));
});

  gulp.task("copy", function() {
    return gulp.src([
      "fonts/**/*.{woff,woff2}",
      "*.html",
      "manifest.json"
    ], {
      base: "."
    })
      .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", function(fn) {
     run(
     "clean",
     "copy",
     "style",
     "images",
     "jsmin",
     fn
     );
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
});

  gulp.watch("less/**/*.less", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
  gulp.watch("less/**/*.less").on("change", server.reload);

