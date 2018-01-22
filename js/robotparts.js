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

});