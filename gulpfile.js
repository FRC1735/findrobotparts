const gulp = require("gulp");
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var del = require("del");

function clean() {
	return del(['./build'])
}

const build = gulp.series(clean)

exports.default = build;