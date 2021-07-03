const dataCache = {};

getData = (url, callback) => {
	if (!dataCache[url]) {
		const request = new XMLHttpRequest();
		request.open('GET', url);
		request.responseType = 'json';
		request.send();

		request.onload = () => {
			dataCache[url] = request.response;
			callback(request.response);
		};
	} else {
		callback(dataCache[url]);
	}
}

setupEdit = (groupData) => {
	document.querySelector('#edit .accordion-body').innerHTML = FindRobotParts.templates.dashboardSingle({
		'idPrefix': 'edit',
		'groups': groupData.groups.sort((a,b) => (a.value > b.value) ? 1 : -1)
	});

	document.querySelectorAll('#edit .editOption').forEach(element => {
		element.style.display = 'none';
	});

	document.getElementById('editProductGroup').addEventListener('change', (event) => {
		const request = new XMLHttpRequest();
		request.open('GET', '/api/product/' + event.target.value);
		request.responseType = 'json';
		request.send();

		request.onload = () => {
			dataCache['/api/product/' + event.target.value] = request.response; 
			document.querySelectorAll('#edit .editOption').forEach(element => {
				element.style.display = 'none';
			});
			document.getElementById('editProduct').innerHTML = FindRobotParts.templates.dashboardProductOption({
				'products': request.response.products
			});
			ddocument.querySelector('#edit .productSelection').style.display = 'flex';
		};
	});

	document.getElementById('editProduct').addEventListener('change', (event) => {
		const responseData = dataCache['/api/product/' + document.getElementById('editProductGroup').value]
		const product = responseData.products.find(element => element.productid == event.target.value);

		const sidebar = document.querySelector('#sidebar > .row');
		let output = '';
		responseData.categories.forEach(category => {
			output += FindRobotParts.templates.taggroup({
				'value': category.value,
				'categoryid': category.categoryid,
				'tags': category.tags
			});
		});
		sidebar.innerHTML = output;

		const tags = product.tagids.split('||').join(',').split(',');
		tags.forEach(tag => {
			document.getElementById('tag'+tag).checked = true;
		});

		document.getElementById('editProductName').value = product.name;
		document.getElementById('editImagePath').value = product.image;

		const links = product.links.split('||');
		const vendors = product.vendors.split('||');
		const linkdata = [];
		links.forEach((element, index) => {
			linkdata.push({'link':element,'vendor':vendors[index]});
		});
		linkdata.push()

		document.getElementById('editVendorLinks').innerHTML = FindRobotParts.templates.dashboardVendorLinks({'vendorLinks': linkdata.concat([{},{},{}])});
	
		document.querySelectorAll('#edit .editOption').forEach(element => {
			element.style.display = 'flex';
		});
	});
}

setupCreateSingle = (groupData) => {
	document.querySelector('#addSingle .accordion-body').innerHTML = FindRobotParts.templates.dashboardSingle({
		'idPrefix': 'addSingle',
		'vendorLinks': FindRobotParts.templates.dashboardVendorLinks({'vendorLinks': [{},{},{},{},{},{},{},{},{},{}]}),
		'groups': groupData.groups.sort((a,b) => (a.value > b.value) ? 1 : -1)
	});

	document.getElementById('addSingleProductGroup').addEventListener('change', (event) => {
		const request = new XMLHttpRequest();
		request.open('GET', '/api/product/' + event.target.value);
		request.responseType = 'json';
		request.send();

		request.onload = () => {
			const sidebar = document.querySelector('#sidebar > .row');
			let output = '';
			request.response.categories.forEach(category => {
				output += FindRobotParts.templates.taggroup({
					'value': category.value,
					'categoryid': category.categoryid,
					'tags': category.tags
				});
			});
			sidebar.innerHTML = output;
		};
	});

	document.getElementById('addSingleForm').addEventListener('submit', (event) => {
		event.preventDefault();

		const links = [];
		
		document.querySelectorAll('.vendor-links').forEach(element => {
			const link = element.querySelector('.vendor-link').value;
			const name = element.querySelector('.vendor-name').value;
			if (link && name) {
				links.push({ 'name': name, 'link': link });
			}
		});

		const tags = [];

		document.querySelectorAll('#sidebar input:checked').forEach(element => {
			tags.push(element.value);
		});

		const request = new XMLHttpRequest();
		request.open('POST', '/frc/1735/admin');
		request.setRequestHeader('Content-Type', 'application/json');
		request.send(JSON.stringify({
			'type': 'addSingle',
			'name': document.getElementById('addSingleProductName').value,
			'image': document.getElementById('addSingleImagePath').value,
			'links': links,
			'tags': tags
		}));
	});
}

setupCreateMultiple = (groupData) => {
	document.querySelector('#addMultiple .accordion-body').innerHTML = FindRobotParts.templates.dashboardMultiple({
		'idPrefix': 'addMultiple',
		'groups': groupData.groups.sort((a,b) => (a.value > b.value) ? 1 : -1)
	});

	document.getElementById('addMultipleProductGroup').addEventListener('change', (event) => {
		event.preventDefault();
		const sidebar = document.querySelector('#sidebar > .row');
		const categories = event.target.selectedOptions[0].dataset.categories.split('||');
		sidebar.innerHTML = '<div class="col"><ul><li>Product Name</li><li>' + categories.join('</li><li>') + '</li><li>Link 1</li><li>Link 2</li><li>...</li><li>Image Path</li></ul></div>';
	});

	document.getElementById('addMultipleForm').addEventListener('submit', (event) => {
		event.preventDefault();

		const request = new XMLHttpRequest();
		request.open('POST', '/frc/1735/admin');
		request.setRequestHeader('Content-Type', 'application/json');
		request.send(JSON.stringify({
			'type': 'addMultiple',
			'groupid': document.getElementById('addMultipleProductGroup').value,
			'data': document.getElementById('addMultipleData').value
		}));
	});

}

setupCreateGroup = () => {
	document.querySelector('#newGroup .accordion-body').innerHTML = FindRobotParts.templates.dashboardGroup({
		'idPrefix': 'newGroup'
	});

	document.getElementById('newGroupForm').addEventListener('submit', (event) => {
		event.preventDefault();

		const request = new XMLHttpRequest();
		request.open('POST', '/frc/1735/admin');
		request.setRequestHeader('Content-Type', 'application/json');
		request.send(JSON.stringify({
			'type': 'newGroup',
			'name': document.getElementById('newGroupGroupName').value,
			'categories': document.getElementById('newGroupCategories').value,
			'description': document.getElementById('newGroupDescription').value,
			'imageFilename': document.getElementById('newGroupImageFilename').value,
			'imageFolder': document.getElementById('newGroupImageFolder').value,
			'spreadsheet': document.getElementById('newGroupSpreadsheet').value
		}));
	});
}

setupEditGroup = () => {
}


document.addEventListener('DOMContentLoaded', () => {
	getData('/api/groups', setupEdit);
	getData('/api/groups', setupCreateSingle);
	getData('/api/groups', setupCreateMultiple);
	setupCreateGroup();
	setupEditGroup();
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