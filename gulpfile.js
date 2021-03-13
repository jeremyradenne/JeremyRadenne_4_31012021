const { src, dest, series, parallel } = require("gulp");
const rename = require("gulp-rename");
const resize = require("gulp-image-resize");
const webp = require("gulp-webp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cssconcat = require("gulp-concat-css");
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
const gulpCopy = require("gulp-copy");
const del = require("del");

// Clean
// ------------------

function clean() {
  return del("build/*/*");
}

// Images
// ------------------

function imgResize1() {
  return src("img/logo.png")
    .pipe(
      resize({
        width: 100,
        height: 100,
      })
    )
    .pipe(
      rename(function (path) {
        path.basename += "-100";
      })
    )
    .pipe(dest("build/img"));
}

function imgResize2() {
  return src("img/la-chouette-agence.png")
    .pipe(
      resize({
        width: 214,
        height: 40,
      })
    )
    .pipe(
      rename(function (path) {
        path.basename += "-214";
      })
    )
    .pipe(dest("build/img"));
}

function imgResize3() {
  return src("img/*.{jpg,bmp}")
    .pipe(
      resize({
        format: "jpg",
        width: 270,
        height: 270,
      })
    )
    .pipe(
      rename(function (path) {
        path.basename += "-270";
      })
    )
    .pipe(dest("build/img"));
}

function imgResize4() {
  return src("img/*.bmp")
    .pipe(
      resize({
        format: "jpg",
      })
    )
    .pipe(dest("build/img"));
}

function imgResize5() {
  return src("img/image-de-presentation.bmp")
    .pipe(
      resize({
        format: "jpg",
      })
    )
    .pipe(dest("build/img"));
}

function imgWebp1() {
  return src("img/*.{jpg,png}").pipe(webp()).pipe(dest("build/img"));
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
  return src([
    "js/jquery-2.1.0.js",
    "js/jquery.touchSwipe.js",
    "js/bootstrap.js",
    "js/jqBootstrapValidation.js",
    "js/formHandler.js",
    "js/blocs.js",
    "js/gmaps.js",
  ])
    .pipe(concat("all.js"))
    .pipe(dest("build/js"));
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
  return src("build/style.css")
    .pipe(cssconcat("style.css"))
    .pipe(dest("build/css"));
}

function minCss() {
  return src("build/css/style.css")
    .pipe(cleanCSS({ normalizeUrls: false }))
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

// HTML
// ------------------

function minHtml() {
  return src("build/*.html")
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest("build"));
}

function copyFonts() {
  return src("fonts/*").pipe(gulpCopy("build/fonts", { prefix: 1 }));
}

module.exports = {
  clean,
  default: series(
    clean,
    parallel(
      series(
        parallel(
          imgResize1,
          imgResize2,
          imgResize3,
          imgResize4,
          imgResize5,
          imgWebp1
        ),
        imgWebp2,
        cleanImg
      ),
      series(concatJs, minJs, cleanJs),
      series(concatCss, minCss, cleanCss),
      minHtml,
      copyFonts
    )
  ),
};
