requestData = () => {
	const producttable = document.getElementById('productdata');
	if (producttable) {
		const productpath = producttable.dataset.path;
		const request = new XMLHttpRequest();
		request.open('GET', '/api/product/' + productpath);
		request.responseType = 'json';
		request.send();

		request.onload = () => {
			addProducts(request.response, producttable);
			addTags(request.response);
		};
	}
};

addProducts = (response, producttable) => {
	let output = FindRobotParts.templates.productrowheader({
		'categories': response.products[0].categories.split('||')
	});
	output += '<tbody>';
	response.products.forEach(product => {
		const tags = product.tags.split('||');
		const categories = product.categories.split('||');
		const links = product.links.split('||');
		const vendors = product.vendors.split('||');
		let linkdata = [];
		let categorydata = [];
		categories.forEach((element, index) => {
			if (element != 'Vendors') {
				categorydata.push({'category':element,'tag':tags[index].replaceAll(',', '<br>')});
			}
		});
		links.forEach((element, index) => {
			linkdata.push({'link':element,'vendor':vendors[index]});
		});
		let image = product.image.replace('images/', 'images/products/');
		const lastchar = image.lastIndexOf('.');
		image = image.substring(0, lastchar) + '.webp';
		output += FindRobotParts.templates.productrow({
			'name': product.name, 
			'image': image, 
			'categories': categorydata, 
			'links': linkdata,
			'productid': product.productid,
			'tagids': product.tagids.replaceAll('||', ',')
		});
	});
	output += '</tbody>';
	producttable.innerHTML = output;
	updateNumberShown();
};

addTags = (response) => {
	const sidebar = document.querySelector('#sidebar > .row');
	let output = '';
	response.categories.forEach(category => {
		if (category.categoryid === 1) {
			let tempTags = {};
			category.tags.forEach(tag => {
				const ratio = tag.value.split(':');
				let significance = '.*';
				if (ratio[1] > 1) {
					significance = ':1';
				} else {
					significance = "*".repeat(Math.floor(ratio[0]).toString().length-1) + '.*';
				}
				let key = Math.floor(ratio[0]/("1" + "0".repeat(significance.length - 2))) + significance + ':1';
				if (significance === ':1') {
					key = '1:1.*'
				}
				if (typeof tempTags[key] === 'undefined') {
					tempTags[key] = [];
				}
				tempTags[key].push(tag.tagid);
			});
			category.tags = [];
			console.log(tempTags);
			Object.keys(tempTags).forEach(element => {
				category.tags.push({ 'tagid': tempTags[element].join(','), 'value': element });
			});
		}
		output += FindRobotParts.templates.taggroup({
			'value': category.value,
			'categoryid': category.categoryid,
			'tags': category.tags
		});
	});
	sidebar.innerHTML = output;
	addShowMoreProducts();
	updateTagList();
}

addShowMoreProducts = () => {
	document.querySelectorAll('.tags.collapse').forEach(element => {
		if (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
			element.classList.add('active');
			element.nextElementSibling.classList.remove('d-none');
		}
	});
}

updateNumberShown = () => {
	const shown = document.querySelectorAll('#productdata tbody tr:not(.d-none)').length;
	const total = document.querySelectorAll('#productdata tbody tr').length;
	document.getElementById('numShown').innerHTML = shown;
	document.getElementById('numTotal').innerHTML = total;
	if (total > shown) {
		document.getElementById('showall').classList.remove('d-none');
	} else {
		document.getElementById('showall').classList.add('d-none');
	}
}

updateTagList = () => {
	const products = document.querySelectorAll("#productdata tbody tr:not(.d-none)");
	let activetags = [];
	products.forEach(element => {
		activetags.push(element.dataset.tags);
	});
	const tagset = new Set(activetags.join(',').split(','));
	document.querySelectorAll('.btn-group-vertical').forEach(element => {
		if (!element.querySelector(':checked')) {
			element.querySelectorAll('.btn-check').forEach(element =>  {
				if (element.value.includes(',')) {
					element.disabled = !element.value.split(',').some(element => tagset.has(element));
				} else {
					element.disabled = !tagset.has(element.value);
				}
				element.classList.remove('hidden-button');
			});
		} else {
			element.querySelectorAll('.btn-check').forEach(element => {
				element.disabled = false;
				element.classList.remove('hidden-button');
			});
		}

		let checkedElements = element.querySelectorAll(':checked').length;
		element.querySelectorAll('.btn-check').forEach(element => {
			if (checkedElements > 6 && !element.checked) {
				element.classList.add('hidden-button');
			} else {
				if (element.disabled) {
					element.classList.add('hidden-button');
				} else if (!element.checked) {
                    checkedElements++;
				}
			}
		});

		const numberHidden = element.querySelectorAll('.hidden-button').length;
		if (numberHidden) {
			element.querySelector('button').classList.remove('d-none');
		} else {
			element.querySelector('button').classList.add('d-none');
		}
	});
}

document.getElementById('showall').addEventListener('click', (event) => {
	event.preventDefault();
	document.querySelectorAll('input:checked').forEach(element => { 
		element.checked = false; 
	});
	document.querySelectorAll('#productdata tbody tr.d-none').forEach(element => {
		element.classList.remove('d-none');
	});
	updateNumberShown();
	updateTagList();
});

document.getElementById('sidebar').addEventListener('change', () => {
	const productrows = document.querySelectorAll('#productdata tbody tr');
	productrows.forEach(element => {
		element.classList.remove('d-none');
	});

	document.querySelectorAll('.btn-group-vertical').forEach(element => {
		let tags = [];
		element.querySelectorAll('.btn-check:checked').forEach(element => {
			if (element.value.includes(',')) {
				tags = tags.concat(element.value.split(','));
			} else {
				tags.push(element.value);
			}
		});
		if (tags.length !== 0) {
			document.querySelectorAll('#productdata tbody tr:not(.d-none)').forEach(element => {
				const rowtags = element.dataset.tags.split(',');
				if (!tags.some(i => rowtags.includes(i))) {
					element.classList.add('d-none');
				}
			});
		}
	
	});
	updateNumberShown();
	updateTagList();
});

document.getElementById('sidebar').addEventListener('click', (event) => {
	let target = event.target;
	while (target.tagName.toLowerCase() !== 'button' && target.id != 'sidebar') {
		target = target.parentElement;
	}
	if (target.tagName.toLowerCase() === 'button') {
		target.closest('.btn-group-vertical').classList.toggle('show-all');
	}
});

document.addEventListener('DOMContentLoaded', () => {
	requestData();
});
