/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var gulp = require("gulp");

gulp.task("css.page", function () {
    var postcss    = require("gulp-postcss");
    var sourcemaps = require("gulp-sourcemaps");
    var concat = require("gulp-concat");

    gulp.src(["./client/css/*.css", "./client/Page/**/*.css"])
        .pipe(concat("page.css"))
        .pipe(sourcemaps.init())
        .pipe(postcss([require("autoprefixer")({
            browsers: "> 1%"
        }), require("precss")]))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("public/css/"));
});

gulp.task("css.admin", function () {
    var postcss    = require("gulp-postcss");
    var sourcemaps = require("gulp-sourcemaps");
    var concat = require("gulp-concat");

    gulp.src(["./client/css/*.css", "./client/Admin/**/*.css"])
        .pipe(concat("admin.css"))
        .pipe(sourcemaps.init())
        .pipe(postcss([require("autoprefixer")({
            browsers: "> 1%"
        }), require("precss")]))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("public/css/"));
});

gulp.task("watch", function () {
    gulp.watch("./client/**/*.css", ["css.page", "css.admin"]);
});
