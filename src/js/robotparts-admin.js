setupEdit = () => {
}

setupCreateSingle = () => {
	document.querySelector('#addSingle .accordion-body').innerHTML = FindRobotParts.templates.daskboardSingle({
		'idPrefix': 'addSingle',
		'vendorLinks': [{},{},{},{},{},{},{},{},{},{}]
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
	setupCreateSingle();
	setupCreateMultiple();
	setupCreateGroup();
	setupEditGroup();
});
