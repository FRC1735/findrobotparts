addCategoryDetails = () => {
	document.getElementById("category-title").innerText = data.title;
	document.getElementById("category-image").setAttribute("alt", data.title);
	document.getElementById("category-description").innerHTML = data.description;
	document.querySelector("title").innerText = data.title + " - Find Robot Parts";
}

addProducts = (productTable) => {

	let theadHTML = `<tr><th scope="col">Product</th>`;
	data.filter_groups.forEach((category) => {
		theadHTML += `<th scope="col">${category}</th>`;
	});
	theadHTML += "<th>Vendors</th></tr>";
	productTable.querySelector("thead").innerHTML = theadHTML;

	addProductRows(data, productTable.querySelector("tbody"));
};


addProductRows = (data, tbody) => {
	let tbodyHTML = "";

	let categoryListWithIds = {};
	data.filter_groups.forEach((category) => {
		categoryListWithIds[category] = [];
	});
	categoryListWithIds["Vendors"] = [];
	data.products.sort((a, b) => a.name.localeCompare(b.name)).forEach((product) => {
		let categoriesHTML = "";
		let vendorsHTML = "";
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
			}).join("<br>");
			product.filters[category].forEach((tag) => {
				tagId = escapeTags(category, tag);
				tagIds.push(tagId);
				categoryListWithIds[category].push({"tag": tag, "id": tagId})
			});

			categoriesHTML += `
			<td data-label=${category}>
				<div class="tags collapse" id="collapse${escapeString(product.name)}-${index}">
					${tagValues}
				</div>
				<a class="showmore collapsed d-none" data-bs-toggle="collapse" href="#collapse${escapeString(product.name)}-${index}" aria-expanded="false" aria-controls="collapse${escapeString(product.name)}-${index}">
					Show <span class="more">more</span> <span class="less">less</span>
				</a>
			</td>`;
		});

		product.links.sort((a, b) => a.vendor.localeCompare(b.vendor)).forEach((link) => {
			vendorId = escapeTags("vendor", link.vendor);
			tagIds.push(vendorId);
			categoryListWithIds["Vendors"].push({"tag": link.vendor, "id": vendorId});
			vendorsHTML += `
				<a href="${link.link}" class="list-group-item list-group-item-action list-group-item-green" target="_blank">${link.vendor}</a>
			`;
		});

		let image = product.image.replace('images/', 'images/products/');
		const lastchar = image.lastIndexOf('.');
		image = image.substring(0, lastchar) + '.webp';

		tbodyHTML += `<tr data-tags="${tagIds.join(",")}">
			<th scope="row" data-label="Product">
				<strong>${product.name}</strong><br>
				<img src="${image}" class="img-thumbnail" alt="${product.name}">
			</th>
			${categoriesHTML}
			<td data-label="Vendors">
				<div class="list-group">
					${vendorsHTML}
				</div>
			</td>
		</tr>`;
	});
	tbody.innerHTML = tbodyHTML;
	updateNumberShown();
	addTags(data.filter_groups, categoryListWithIds);
};

escapeTags = (category, tag) => {
	return `-${escapeString(category)}-${escapeString(tag)}`;
}

escapeString = (textValue) => {
	return textValue.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

addTags = (filterGroups, categoryListWithIds) => {
	const sidebar = document.querySelector('#sidebar > .row');
	let output = '';
	filterGroups.push("Vendors");
	filterGroups.forEach(category => {
		if (data.title = "Gearboxes" && category == "Reduction") {
			let tempTags = {};
			categoryListWithIds[category].forEach(tag => {
				const ratio = tag.tag.split(':');
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
				tempTags[key].push(tag.id);
			});
			categoryListWithIds[category] = [];
			console.log(tempTags);
			Object.keys(tempTags).forEach(element => {
				categoryListWithIds[category].push({ 'id': tempTags[element].join(','), 'tag': element });
			});
		}
		const tagList = categoryListWithIds[category].sort((a, b) => {
				let aTag = a.tag;
				let bTag = b.tag;
				if (aTag.includes("*") && aTag.includes(":")) {
					aTag = aTag.replaceAll("*", "0")
				}
				if (bTag.includes("*") && bTag.includes(":")) {
					bTag = bTag.replaceAll("*", "0")
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
		
		let tagsHTML = "";
		tagList.forEach((tag) => {
			tagsHTML += `<input type="checkbox" class="btn-check" name="${escapeString(category)}" id="tag${tag.id}" value="${tag.id}" autocomplete="off">
			<label class="btn btn-outline-green" for="tag${tag.id}">${tag.tag}</label>`			
		});

		output += `<div class="col-6 col-sm-12">
			<p class="h6 mt-4">${category}</p>
			<div class="btn-group-vertical btn-group-sm full-width" role="group" aria-label="${escapeHTML(category)} options">
				${tagsHTML}
				<button type="button" class="btn btn-outline-green">Show <span class="all">All</span><span class="less">Less</span></button>
			</div>
		</div>`
	});
	sidebar.innerHTML = output;
	addShowMoreProducts();
	updateTagList();
}

const escapeHTML = (s='') =>
	s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

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

const productTable = document.getElementById("productdata");
const sidebar = document.getElementById("sidebar");
if (data && productTable && sidebar) {
	addCategoryDetails();
	addProducts(productTable);
}

