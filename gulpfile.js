const gulp = require("gulp");
const handlebars = require('gulp-handlebars');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const concat = require('gulp-concat');
const del = require("del");
const jsonTransform = require('gulp-json-transform');
const rename = require("gulp-rename");

assets = () => {
	return gulp.src("./src/images/categories/*")
	.pipe(gulp.dest("./build/images/categories"));
}

buildsitemap = () => {
	return gulp.src('./src/categories.json')
		.pipe(jsonTransform(function (data, file) {
			let output = `<?xml version="1.0" encoding="UTF-8"?>\n`;
			output += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
			output += `\t<url><loc>http://findrobotparts.com/</loc></url>\n`;
			data.groups.forEach(element => {
				element.categories.forEach(element => {
					output += `\t<url><loc>http://findrobotparts.com/${element.path}</loc></url>\n`
				});
			});
			output += `</urlset>`;
			return output;
		}))
		.pipe(rename("sitemap.xml"))
		.pipe(gulp.dest('./build'));
}

clean = () => {
	return del(['./build'])
}

const build = gulp.series(clean, buildsitemap, assets)

exports.default = build;