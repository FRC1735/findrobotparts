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
		request.open('GET', '/api/products/' + event.target.value);
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
		console.log('submit data');
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
