/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var gulp = require("gulp");
var watch = require("gulp-watch");

gulp.task("css.page", function () {
    var postcss    = require("gulp-postcss");
    var sourcemaps = require("gulp-sourcemaps");
    var concat = require("gulp-concat");

    gulp.src(["./client/css/reset.css", "./client/css/*.css", "./client/Page/**/*.css", "./client/libs/**/*.css", "!**/_*.css"])
        .pipe(concat("page.css"))
        .pipe(sourcemaps.init())
        .pipe(postcss([require("autoprefixer")({
            browsers: "> 0.01%"
        }), require("precss")]))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("public/css/"));
});

gulp.task("css.admin", function () {
    var postcss    = require("gulp-postcss");
    var sourcemaps = require("gulp-sourcemaps");
    var concat = require("gulp-concat");

    gulp.src(["./client/css/reset.css", "./client/css/*.css", "./client/Admin/**/*.css", "./client/libs/**/*.css", "./client/Page/**/*.css", "!**/_*.css"])
        .pipe(concat("admin.css"))
        .pipe(sourcemaps.init())
        .pipe(postcss([require("autoprefixer")({
            browsers: "> 0.01%"
        }), require("precss")]))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("public/css/"));
});

var svgSprite = require("gulp-svg-sprite");

function svgSpriteTask(src, dest) {

    return gulp.src(src)
        .pipe(svgSprite({
            shape: {
                //            dimension: {
                //                maxWidth: 32,
                //                maxHeight: 32
                //            },
                spacing: {
                    padding: 0
                },
                id: {
                    generator: "icon-%s"
                }
            },
            mode: {
                symbol: true,
                view: {
                    bust: false
                }
            },
            svg: {
                xmlDeclaration: false,
                doctypeDeclaration: false,
                namespaceIDs: true,
                dimensionAttributes: true,
                rootAttributes: {
                    style: "display: none;"
                }
            }
        }))
        .pipe(gulp.dest(dest));
}

gulp.task("svg.sprite-app", function () {

    svgSpriteTask("./icons/app/*.svg", "public/img/icons/app");

});

gulp.task("svg.sprite-page", function () {

    svgSpriteTask("./icons/page/*.svg", "public/img/icons/page");

});

gulp.task("watch", function () {
    gulp.watch(["client/**/*.css", "!client/**/_*.css"], ["css.page", "css.admin"]);
    gulp.watch(["icons/app/**/*.svg"], ["svg.sprite-app"]);
    gulp.watch(["icons/page/**/*.svg"], ["svg.sprite-page"]);
});
