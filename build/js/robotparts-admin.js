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

setupEdit = () => {
}

setupCreateSingle = (groupData) => {
	document.querySelector('#addSingle .accordion-body').innerHTML = FindRobotParts.templates.dashboardSingle({
		'idPrefix': 'addSingle',
		'vendorLinks': [{},{},{},{},{},{},{},{},{},{}],
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

setupCreateMultiple = () => {
}

setupCreateGroup = () => {
}

setupEditGroup = () => {
}


document.addEventListener('DOMContentLoaded', () => {
	setupEdit();
	getData('/api/groups', setupCreateSingle);
	setupCreateMultiple();
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