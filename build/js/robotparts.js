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
};

addTags = (response) => {
	const sidebar = document.getElementById('sidebar');
	let output = '';
	response.categories.forEach(category => {
		output += FindRobotParts.templates.taggroup({
			'value': category.value,
			'categoryid': category.categoryid,
			'tags': category.tags
		});
	});
	sidebar.innerHTML = output;
	addShowMore();
}

addShowMore = () => {
	document.querySelectorAll('.tags.collapse').forEach(element => {
		if (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
			element.nextSibling.classList.remove('d-none');
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {
	requestData();
});






/*
$(document).ready( function() {

	if($(".table-collapse").length) {
		$('.table-collapse td').each(function(){
			var th = $(this).closest('table').find('th').eq( this.cellIndex ).text();
			$(this).attr('data-label', th).html();
		});
	}

	if( $("#sidebar").text().trim() == "") { 
		$("#filterbutton").hide() 
	}

	storedExpandData = sessionStorage.getItem("expand");
	currentPage = window.location.pathname.split("/")[1];
	if (storedExpandData != null && storedExpandData.length > 0) { 
		storedExpandData = JSON.parse(storedExpandData)
		if (!(currentPage in storedExpandData)) {
			storedExpandData[currentPage] = [];
		} 
	} else {
		storedExpandData = {};
		storedExpandData[currentPage] = [];
	}

	$("body").on("click", ".collapsetitle", function() {
		var clickedexpander = $(this);
		index = clickedexpander.data("index");
		if(clickedexpander.hasClass("collapsed")) { // collapsing
			if($.inArray(index, storedExpandData[currentPage]) < 0) {
				storedExpandData[currentPage].push(index);
				storeExpandData();
			}
		} else { //expanding
			storedExpandData[currentPage].splice($.inArray(index, storedExpandData[currentPage]), 1);
			storeExpandData();
		}
	
	});
	
	$(".collapsetitle").each(function(index) {
		var expander = $(this);
		expander.data("index", index);	
		if ( $.inArray(index, storedExpandData[currentPage]) > -1 ) {
			expander.click();
		}
	});
	
	function storeExpandData() {
		sessionStorage.expand = JSON.stringify(storedExpandData);
	}

  $('[data-toggle="tooltip"]').tooltip()

});*/