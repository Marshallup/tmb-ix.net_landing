"use strict";
const { src, dest, task, series, watch, parallel } = require("gulp"),
  webpack = require("webpack"),
  gulpWebpack = require("webpack-stream"),
  webpackConfig = require("./webpack.config"),
  browserSync = require("browser-sync").create(),
  reload = browserSync.reload,
  plumber = require("gulp-plumber"),
  sourcemaps = require("gulp-sourcemaps"),
  sass = require("gulp-sass"),
  postcss = require("gulp-postcss"),
  minifyCss = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  htmlValidator = require("gulp-w3c-html-validator"),
  pug = require("gulp-pug"),
  htmlmin = require("gulp-htmlmin"),
  imagemin = require("gulp-imagemin"),
  svgSprite = require("gulp-svg-sprite"),
  svgmin = require("gulp-svgmin"),
  cheerio = require("gulp-cheerio"),
  replace = require("gulp-replace"),
  del = require("del");

const paths = {
  build: {
    html: "dist/",
    js: "dist/assets/js/",
    css: "dist/assets/css/",
    images: "dist/assets/img/",
    svgSprite: "dist/assets/img/icons/",
    fonts: "dist/assets/fonts/",
  },
  src: {
    html: "src/pug/pages/*.pug",
    js: "src/assets/js/app.js",
    css: "src/assets/scss/styles.scss",
    images: "src/assets/img/images/**/*.{jpeg,jpg,png,gif,ico,svg}",
    svgSprite: "src/assets/img/svgSprite/*.svg",
    fonts: "src/assets/fonts/*",
  },
  watch: {
    html: "src/**/*.pug",
    js: "src/assets/js/**/*.js",
    css: "src/assets/scss/**/*.scss",
    images: "src/assets/img/images/**/*.{jpeg,jpg,png,gif,ico,svg }",
    svgSprite: "src/assets/img/svgSprite/*.svg",
    fonts: "src/assets/fonts/*",
  },
  clean: "./dist/",
};
const isDev = webpackConfig.isProd().bool;

task("server", () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    port: 3000,
    open: true,
  });
});
task("clean", () => {
  return del(paths.clean);
});
task("html", () => {
  if (isDev) {
    return src(paths.src.html)
      .pipe(plumber())
      .pipe(
        pug({
          pretty: true,
        })
      )
      .pipe(dest(paths.build.html))
      .pipe(reload({ stream: true }));
  } else {
    return src(paths.src.html)
      .pipe(
        pug({
          pretty: true,
        })
      )
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(dest(paths.build.html));
  }
});
task("validateHtml", () => {
  return src(paths.src.html)
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(htmlValidator())
    .pipe(htmlValidator.reporter());
});
task("jsInHead", () => {
  return src("src/assets/js/libHead/*.js").pipe(dest("dist/assets/js/"));
});
task("webpack", () => {
  return src(paths.src.js)
    .pipe(plumber())
    .pipe(gulpWebpack(webpackConfig.config, webpack))
    .pipe(dest(paths.build.js))
    .pipe(browserSync.stream());
});
task("styles", () => {
  if (isDev) {
    return src(paths.src.css)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss(require("./postcss.config")))
      .pipe(sourcemaps.write())
      .pipe(
        rename({
          suffix: ".min",
          extname: ".css",
        })
      )
      .pipe(dest(paths.build.css))
      .pipe(reload({ stream: true }));
  } else {
    return src(paths.src.css)
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss(require("./postcss.config")))
      .pipe(dest(paths.build.css))
      .pipe(minifyCss())
      .pipe(
        rename({
          suffix: ".min",
          extname: ".css",
        })
      )
      .pipe(dest(paths.build.css))
      .pipe(reload({ stream: true }));
  }
});
task("images", () => {
  if (isDev) {
    return src(paths.src.images).pipe(plumber()).pipe(dest(paths.build.images));
  } else {
    return src(paths.src.images)
      .pipe(plumber())
      .pipe(imagemin())
      .pipe(dest(paths.build.images));
  }
});
task("svgSprite", () => {
  return src(paths.src.svgSprite)
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          // $("[fill]").removeAttr("fill");
          // $("[stroke]").removeAttr("stroke");
          // $("[style]").removeAttr("style");
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(replace("&gt;", ">"))
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg", //sprite file name
          },
        },
      })
    )
    .pipe(dest(paths.build.svgSprite));
});
task("fonts", () => {
  return src(paths.src.fonts).pipe(dest(paths.build.fonts));
});
task("watch", () => {
  watch(paths.watch.html, series("html"));
  watch("src/assets/js/libHead/*.js", series("jsInHead"));
  watch(paths.watch.js, series("webpack"));
  watch(paths.watch.css, series("styles"));
  watch(paths.watch.images, series("images"));
  watch(paths.watch.svgSprite, series("svgSprite"));
  watch(paths.watch.fonts, series("fonts"));
});
task(
  "default",
  series(
    "clean",
    parallel("html", "webpack", "jsInHead", "styles", "images", "svgSprite", "fonts"),
    parallel("watch", "server")
  )
);
task(
  "build",
  series(
    "clean",
    parallel("html", "webpack", "jsInHead", "styles", "images", "svgSprite", "fonts")
  )
);
