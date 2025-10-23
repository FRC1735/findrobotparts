import { promises as fs } from 'node:fs';
import path from 'node:path';
import Handlebars from 'handlebars';

let categoryListWithIds = {};
let hbts = [];

const buildProductRows = (data) => {
	let tbodyHTML = '';

	data.filter_groups.forEach((category) => {
		categoryListWithIds[category] = [];
	});
	categoryListWithIds['Vendors'] = [];
	data.products.sort((a, b) => a.name.localeCompare(b.name)).forEach((product) => {
		let categoriesHTML = '';
		let vendorsHTML = '';
		const productId = escapeString(data.title);
		let tagIds = [];

		data.filter_groups.forEach((category, index) => {
			const tagValues = product.filters[category].sort((a, b) => {
				const numA = parseFloat(a);
				const numB = parseFloat(b);

				const startsWithNumA = /^\d/.test(a);
				const startsWithNumB = /^\d/.test(b);

				if (startsWithNumA && startsWithNumB) {
					if (numA !== numB) return numA - numB;
					return a.localeCompare(b, undefined, { numeric: true });
				} else if (startsWithNumA) {
					return -1;
				} else if (startsWithNumB) {
					return 1;
				} else {
					return a.localeCompare(b, undefined, { numeric: true });
				}
			}).join('<br>');
			product.filters[category].forEach((tag) => {
				const tagId = escapeTags(category, tag);
				tagIds.push(tagId);
				categoryListWithIds[category].push({'tag': tag, 'id': tagId})
			});

			categoriesHTML += hbts['category-cell']({ category: category, escapedname: escapeString(product.name), index: index, tagValues: tagValues });
		});

		product.links.sort((a, b) => a.vendor.localeCompare(b.vendor)).forEach((link) => {
			const vendorId = escapeTags('vendor', link.vendor);
			tagIds.push(vendorId);
			categoryListWithIds['Vendors'].push({'tag': link.vendor, 'id': vendorId});
			vendorsHTML += hbts['vendor']({ link: link.link, vendor: link.vendor });
		});

		let image = product.image.replace('images/', 'images/products/');
		const lastchar = image.lastIndexOf('.');
		image = image.substring(0, lastchar) + '.webp';

		tbodyHTML += hbts['productrow']({ tagids: tagIds.join(','), name: product.name, image: image, categories: categoriesHTML, vendors: vendorsHTML });
	});
	return tbodyHTML;
};

const escapeTags = (category, tag) => {
	return `-${escapeString(category)}-${escapeString(tag)}`;
}

const escapeString = (textValue) => {
	return textValue.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

const generateSidebar = (data) => {
	let sidebarHTML = '';
	data.filter_groups.push('Vendors');
	data.filter_groups.forEach(category => {
		if (data.title = 'Gearboxes' && category == 'Reduction') {
			let tempTags = {};
			categoryListWithIds[category].forEach(tag => {
				const ratio = tag.tag.split(':');
				let significance = '.*';
				if (ratio[1] > 1) {
					significance = ':1';
				} else {
					significance = '*'.repeat(Math.floor(ratio[0]).toString().length-1) + '.*';
				}
				let key = Math.floor(ratio[0]/('1' + '0'.repeat(significance.length - 2))) + significance + ':1';
				if (significance === ':1') {
					key = '1:1.*'
				}
				if (typeof tempTags[key] === 'undefined') {
					tempTags[key] = [];
				}
				tempTags[key].push(tag.id);
			});
			categoryListWithIds[category] = [];
			Object.keys(tempTags).forEach(element => {
				categoryListWithIds[category].push({ 'id': tempTags[element].join(','), 'tag': element });
			});
		}
		const tagList = categoryListWithIds[category].sort((a, b) => {
				let aTag = a.tag;
				let bTag = b.tag;
				if (aTag.includes('*') && aTag.includes(':')) {
					aTag = aTag.replaceAll('*', '0')
				}
				if (bTag.includes('*') && bTag.includes(':')) {
					bTag = bTag.replaceAll('*', '0')
				}
				const numA = parseFloat(aTag);
				const numB = parseFloat(bTag);

				const startsWithNumA = /^\d/.test(aTag);
				const startsWithNumB = /^\d/.test(bTag);

				if (startsWithNumA && startsWithNumB) {
					if (numA !== numB) return numA - numB;
					return aTag.localeCompare(bTag, undefined, { numeric: true });
				} else if (startsWithNumA) {
					return -1;
				} else if (startsWithNumB) {
					return 1;
				} else {
					return aTag.localeCompare(bTag, undefined, { numeric: true });
				}
			}).filter((obj, index, self) => index === self.findIndex(o => o.tag === obj.tag)
		);
		
		let tagsHTML = '';
		tagList.forEach((tag) => {
			tagsHTML += hbts['sidebar-tag']({ escapedCategory: escapeString(category), tagid: tag.id, name: tag.tag });		
		});

		sidebarHTML += hbts['sidebar-taggroup']({ category: category, escapedCategory: escapeHTML(category), tags: tagsHTML });
	});
	return sidebarHTML;
}

const escapeHTML = (s = '') =>
	s.replace(/[&<>'"]/g, c =>
		({
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			"'": '&#39;',
			'"': '&quot;'
		}[c])
	);


const buildPage = (data, relativePath) => {
	categoryListWithIds = {};
	let mainHTML = '';
	let sidebarHTML = '';
	let sidebarClass = 'none';
	let title = 'Find Robot Parts';

	if (data.products?.length > 0) {
		title = `${data.title} - Find Robot Parts`
		const tablehead = hbts['thead']({ categories: data.filter_groups });
		const tablebody = buildProductRows(data);
		sidebarHTML = generateSidebar(data);
		mainHTML = hbts['product']({ slug: relativePath, category: data.title, tablehead: tablehead, tablebody: tablebody });
		sidebarClass = 'block';
	} else {
		if (data.title) {
			title = `${data.title} - Find Robot Parts`
		}
		mainHTML = data.description;
	}

	return hbts['main']({ title: title, sidebar: sidebarHTML, sidebarClass: sidebarClass, maincontent: mainHTML });
}

async function setupTemplates() {
	const templates = [
		'main', 'category-cell', 'product', 'productrow', 
		'sidebar-tag', 'sidebar-taggroup', 'thead', 'vendor',
		'pages/404', 'pages/about', 'pages/homepage'
	];

	for (const template of templates) {
		const templateSource = await fs.readFile(`templates/${template}.hbs`, 'utf8');
		hbts[template] = Handlebars.compile(templateSource);
	}
}

async function listJsonFiles(dir) {
	const out = [];
	async function walk(d) {
		const entries = await fs.readdir(d, { withFileTypes: true });
		for (const e of entries) {
			const full = path.join(d, e.name);
			if (e.isDirectory()) await walk(full);
			else if (e.isFile() && e.name.toLowerCase().endsWith('.json')) out.push(full);
		}
	}
	await walk(dir);
	return out;
}

async function ensureDir(dir) {
	await fs.mkdir(dir, { recursive: true });
}

async function saveFile(filename, html) {
	const outPath = path.join('www', `${filename}.html`);;
	await ensureDir(path.dirname(outPath));
	await fs.writeFile(outPath, html, 'utf8');
	console.log(`Wrote ${outPath}`);
}

async function main() {
	const DATA_DIR = 'data';
	await setupTemplates();
	const files = await listJsonFiles(DATA_DIR);
	for (const file of files) {
		const raw = await fs.readFile(file, 'utf8');
		let data;
		try { data = JSON.parse(raw); } catch { console.error(`Invalid JSON: ${file}`); continue; }

		const relativePath = path.relative(DATA_DIR, file).replace(/\.json$/i, '');

		const html = buildPage(data, relativePath);
		await saveFile(relativePath, html);
	}

	await saveFile('404', buildPage({ title: "Part Not Found", description: hbts['pages/404']() }, ''));
	await saveFile('index', buildPage({ title: "", description: hbts['pages/homepage']() }, ''));
	await saveFile('about', buildPage({ title: "About", description: hbts['pages/about']() }, ''));

}

main().catch(err => { console.error(err); process.exit(1); });
