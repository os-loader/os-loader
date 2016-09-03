'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var path = require('path');
/*var fs = require('fs');
var glob = require('glob-all');
var packageJson = require('./package.json');
var crypto = require('crypto');*/

var AUTOPREFIXER_BROWSERS = ['chrome >= 34',];

var DIST = 'dist/dist';
var DIST2 = 'dist';

var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};

var out = function(subpath) {
  return !subpath ? DIST2 : path.join(DIST2, subpath);
};

var styleTask = function(stylesPath, srcs) {
  return gulp.src(srcs.map(function(src) {
      return path.join('app', stylesPath, src);
    }))
    .pipe($.changed(stylesPath, {extension: '.css'}))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/' + stylesPath))
    .pipe($.cleanCss())
    .pipe(gulp.dest(dist(stylesPath)))
    .pipe($.size({title: stylesPath}));
};

var imageOptimizeTask = function(src, dest) {
  return gulp.src(src)
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(dest))
    .pipe($.size({title: 'images'}));
};

// Compile and automatically prefix stylesheets
gulp.task('styles', function() {
  return styleTask('styles', ['**/*.css']);
});

// Optimize images
gulp.task('images', function() {
  return imageOptimizeTask('app/images/**/*', dist('images'));
});

// Copy all files at the root level (app)
gulp.task('copy', function() {
  var app = gulp.src([
    'app/*',
    '!app/test',
    '!app/elements',
    '!app/bower_components',
    '!app/cache-config.json',
    '!**/.DS_Store'
  ], {
    dot: true
  }).pipe(gulp.dest(dist()));

  // Copy over only the bower_components we need
  // These are things which cannot be vulcanized
  var bower = gulp.src([
    'app/bower_components/{webcomponentsjs,platinum-sw,sw-toolbox,promise-polyfill}/**/*'
  ]).pipe(gulp.dest(dist('bower_components')));

  return merge(app, bower)
    .pipe($.size({
      title: 'copy'
    }));
});

// Copy web fonts to dist
gulp.task('fonts', function() {
  return gulp.src(['app/fonts/**'])
    .pipe(gulp.dest(dist('fonts')))
    .pipe($.size({
      title: 'fonts'
    }));
});

// Scan your HTML for assets & optimize them
gulp.task('build', ['images', 'fonts'], function() {
  return gulp.src(['app/**/*.html', '!app/{elements,test,bower_components}/**/*.html'])
    .pipe($.useref())
    .pipe($.if('*.js', $.uglify({
      preserveComments: 'some'
    })))
    .pipe($.if('*.css', $.cleanCss()))
    .pipe($.if('*.html', $.minifyHtml({
      quotes: true,
      empty: true,
      spare: true
    })))
    .pipe(gulp.dest(dist()))
});

// Vulcanize granular configuration
gulp.task('vulcanize', function() {
  return gulp.src('app/elements/elements.html')
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(gulp.dest(dist('elements')))
    .pipe($.size({title: 'vulcanize'}));
});

// Clean output directory
gulp.task('clean', function() {
  return del(['.tmp', "dist"]);
});

gulp.task("index.js",function() {
  return gulp.src(["w.js","main.js"])/*.pipe($.uglify())*/.pipe(gulp.dest(out()));
});

gulp.task("package.json",function() {
  return gulp.src("package.json").pipe($.jsonTransform(function(data) {
    data.devDependencies={"electron-prebuilt":data.devDependencies["electron-prebuilt"]};
    data.scripts={
      start:data.scripts.start,
      build:data.scripts.build
    }
    return data;
  })).pipe(gulp.dest(out()));
});

gulp.task("core.js",function() {
  return gulp.src(["core/**/**/*.js"])/*.pipe($.uglify())*/.pipe(gulp.dest(out("core")));
});

gulp.task("scripts",function() {
  return gulp.src("scripts/**/*.sh").pipe(gulp.dest(out("scripts")));
});

gulp.task("other",function() {
  return gulp.src(["minify-sh.sh","Makefile"]).pipe(gulp.dest(out()));
});

// Build production files, the default task
gulp.task('default', ['clean'], function(cb) {
  runSequence(
    ['copy', 'styles'],
    ["index.js","package.json","core.js","scripts","other"],
    'build',
    'vulcanize',
    cb);
});
