'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var path = require('path');

var DIST = process.env.DESTDIR||"dist";

var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};

gulp.task("clean",function() {
  return del(dist(),{force:true});
});

gulp.task("ejs",function() {
  return gulp.src("pages/**/*.ejs").pipe($.minifyEjs()).pipe(gulp.dest(dist("pages")));
});

gulp.task("core.js",function() {
  return gulp.src("core/**/*.js").pipe($.uglify()).pipe(gulp.dest(dist("core")));
});

gulp.task("models.js",function() {
  return gulp.src("models/**/*.js").pipe($.uglify()).pipe(gulp.dest(dist("models")));
});

gulp.task("index.js",function() {
  return gulp.src("index.js")/*.pipe($.uglify())*/.pipe($.rename("os-loader-server")).pipe(gulp.dest(dist()));
});

gulp.task("package.json",function() {
  return gulp.src("package.json").pipe($.jsonTransform(function(data) {
    delete data.devDependencies;
    delete data.scripts.install;
    delete data.scripts.postinstall;
    return data;
  })).pipe(gulp.dest(dist()));
});

gulp.task("views",function() {
  return gulp.src("views/**/*.ejs").pipe($.minifyEjs()).pipe(gulp.dest(dist("views")));
});

gulp.task("hackcss",function() {
  return gulp.src("bower_components/hackcss/dist/**/*").pipe(gulp.dest("bower_components/hackcss/dist"));
});

gulp.task("default",["clean"],function() {
  return runSequence(["ejs","views","hackcss","core.js","models.js","index.js","package.json"]);
  //return runSequence(["ejs"],["views"],["hackcss"],["core.js"],["models.js"],["index.js"],["package.json"]);
});
