const { src, dest, series, parallel } = require("gulp");
const rename = require("gulp-rename");
const resize = require("gulp-image-resize");
const webp = require("gulp-webp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cssconcat = require("gulp-concat-css");
const cssnano = require("gulp-cssnano");
const del = require("del");

// Clean
// ------------------

function clean() {
  return del("build");
}

// Images
// ------------------

function imgResize1() {
  return src("img/*.{png,bmp}")
    .pipe(
      resize({
        format: "jpg",
        width: 270,
        height: 270,
        crop: true,
        imageMagick: true,
      })
    )
    .pipe(
      rename(function (path) {
        path.basename += "-270";
      })
    )
    .pipe(dest("build/img"));
}

function imgResize2() {
  return src("img/*.png")
    .pipe(
      resize({
        width: 476,
      })
    )
    .pipe(
      rename(function (path) {
        path.basename += "-476";
      })
    )
    .pipe(dest("build/img"));
}

function imgResize3() {
  return src("img/*.png")
    .pipe(
      resize({
        width: 562,
      })
    )
    .pipe(
      rename(function (path) {
        path.basename += "-562";
      })
    )
    .pipe(dest("build/img"));
}

function imgResize4() {
  return src("img/*.png")
    .pipe(
      resize({
        width: 613,
      })
    )
    .pipe(dest("build/img"));
}

function imgWebp1() {
  return src("img/*.jpg").pipe(webp()).pipe(dest("build/img"));
}

function imgWebp2() {
  return src("build/img/**/*.{jpg,png}").pipe(webp()).pipe(dest("build/img"));
}

function cleanImg() {
  return del("build/img/*.{jpg,png}");
}

// JavaScript
// ------------------

function concatJs() {
  return src("js/*.js").pipe(concat("all.js")).pipe(dest("build/js"));
}

function minJs() {
  return src("build/js/all.js")
    .pipe(uglify())
    .pipe(
      rename(function (path) {
        path.basename += "-min";
      })
    )
    .pipe(dest("build/js"));
}

function cleanJs() {
  return del("build/js/all.js");
}

// CSS
// ------------------

function concatCss() {
  return src("style.css").pipe(cssconcat("style.css")).pipe(dest("build/css"));
}

function minCss() {
  return src("build/css/style.css")
    .pipe(cssnano())
    .pipe(
      rename(function (path) {
        path.basename += "-min";
      })
    )
    .pipe(dest("build/css"));
}

function cleanCss() {
  return del("build/css/style.css");
}

module.exports = {
  clean,
  default: series(
    clean,
    parallel(
      series(
        parallel(imgResize1, imgResize2, imgResize3, imgResize4, imgWebp1),
        imgWebp2,
        cleanImg
      ),
      series(concatJs, minJs, cleanJs),
      series(concatCss, minCss, cleanCss)
    )
  ),
};
