const gulp = require("gulp");
const handlebars = require('gulp-handlebars');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const concat = require('gulp-concat');
const del = require("del");
const jsonTransform = require('gulp-json-transform');
const rename = require("gulp-rename");
const merge2 = require("merge2");
const replace = require('gulp-replace');
const fs = require('fs');

assets = () => {
	return merge2(
		gulp.src("./src/images/categories/*")
			.pipe(gulp.dest("./build/images/categories")),
		gulp.src("./src/images/logo/*")
			.pipe(gulp.dest("./build/images/logo")),
		gulp.src("./src/css/*")
			.pipe(gulp.dest("./build/css")),
		gulp.src("./node_modules/bootstrap/dist/css/bootstrap.min.css")
			.pipe(gulp.dest("./build/css")),
		gulp.src("./node_modules/bootstrap/dist/js/bootstrap.min.js")
			.pipe(gulp.dest("./build/js")),
		gulp.src("./node_modules/handlebars/dist/handlebars.runtime.min.js")
			.pipe(gulp.dest("./build/js"))
	);
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

buildtemplate = () => {
	return gulp.src("./src/template.html")
		.pipe(replace("{{offcanvas}}", () => {
			const categories = JSON.parse(fs.readFileSync('./src/categories.json'));
			let output = "";
			categories.groups.forEach(element => {
				output += `<p class="h6">${element.name}</p>`;
				output += `<div class="row">`;
				element.categories.forEach(element => {
					output += `
					<div class="col-4 text-center mb-3">
						<a href="${element.path}">
							<img src="images/categories/${element.image}-gray.jpg" class="img-thumbnail" alt="${element.name}">
							${element.name}
						</a>
					</div>`
				});
				output += `</div>\n`;
			});
			return output;
		}))
		.pipe(gulp.dest("./build"))
}

clean = () => {
	return del(['./build'])
}

const build = gulp.series(clean, buildsitemap, assets, buildtemplate);

exports.default = build;