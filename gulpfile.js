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
const flatMap = require('flat-map').default;
const scaleImages = require('gulp-scale-images');
const path = require('path');

assets = () => {
	return merge2(
		gulp.src("./src/images/categories/*")
			.pipe(gulp.dest("./build/images/categories")),
		gulp.src("./src/images/logo/*")
			.pipe(gulp.dest("./build/images/logo")),
		gulp.src("./src/css/*")
			.pipe(gulp.dest("./build/css")),
		gulp.src("./src/js/*")
			.pipe(gulp.dest("./build/js")),
		gulp.src("./node_modules/bootstrap/dist/css/bootstrap.min.css")
			.pipe(gulp.dest("./build/css")),
		gulp.src("./node_modules/bootstrap/dist/js/bootstrap.min.js")
			.pipe(gulp.dest("./build/js")),
		gulp.src("./node_modules/handlebars/dist/handlebars.runtime.min.js")
			.pipe(gulp.dest("./build/js")),
		gulp.src("./src/images/products/**")
			.pipe(flatMap((file, cb) => {
				const webpFile = file.clone();
				webpFile.scale = {maxWidth: 200, format: 'webp'};
				cb(null, [webpFile]);
			}))
			.pipe(scaleImages((output, scale, cb) => {
				const fileName = [
					path.basename(output.path, output.extname),
					scale.format || output.extname
				].join('.');
				cb(null, fileName);
			}))
			.pipe(gulp.dest("./build/images/products"))
	);
}

buildhandlebars = () => {
	return gulp.src('./src/templates/*.hbs')
		.pipe(handlebars())
		.pipe(wrap('Handlebars.template(<%= contents %>)'))
		.pipe(declare({
			namespace: 'FindRobotParts.templates',
			noRedeclare: true, // Avoid duplicate declarations
		}))
		.pipe(concat('templates.js'))
		.pipe(gulp.dest('./build/js'));
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
	return gulp.src("./src/content/template.html")
		.pipe(replace("{{offcanvas}}", () => {
			const categories = JSON.parse(fs.readFileSync('./src/categories.json'));
			let output = "";
			categories.groups.forEach(element => {
				output += `<p class="h6">${element.name}</p>`;
				output += `<div class="row">`;
				element.categories.forEach(element => {
					output += `
					<div class="col-4 text-center mb-3">
						<a href="/${element.path}">
							<img src="/images/categories/${element.image}-gray.jpg" class="img-thumbnail" alt="${element.name}">
							${element.name}
						</a>
					</div>`
				});
				output += `</div>\n`;
			});
			return output;
		}))
		.pipe(gulp.dest("./build/content"));
}

buildhomepage = () => {
	return gulp.src("./src/content/homepage.html")
		.pipe(replace("{{categories}}", () => {
			const categories = JSON.parse(fs.readFileSync('./src/categories.json'));
			const categoryTemplate = fs.readFileSync('./src/content/homepage-item.html', {encoding:"utf-8"});
			let output = "";
			categories.groups.forEach(element => {
				output += `<h2>${element.name}</h2>\n`;
				output += `<div class="row">\n`;
				element.categories.forEach(element => {
					output += categoryTemplate.replaceAll("{{link}}", element.path).replaceAll("{{image}}", element.image).replaceAll("{{name}}", element.name);
				});
				output += `</div>\n`;
			});
			return output;
		}))
		.pipe(gulp.dest("./build/content"));
}

clean = () => {
	return del(['./build/css','./build/js','./build/images','./build/content', './build/sitemap.xml'])
}

const build = gulp.series(clean, buildhandlebars, buildsitemap, assets, buildtemplate, buildhomepage);

exports.default = build;