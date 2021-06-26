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
		'groups': groupData.groups
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
	setupCreateSingle();
	setupCreateMultiple();
	setupCreateGroup();
	setupEditGroup();
});
