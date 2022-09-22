
$(document).ready(function (e) {

	$(".back-menu").click(function () {

		$("#main-nav").slideToggle();
	});


	$(".btn-compare, .drop-down-search").click(function () {

		$(".drop-down-div").slideToggle();
	});



	$(".li-links").mouseenter(function (e) {
		$(this).find(".icon-li").css({
			"transform": "scale(1.2,1.2)",

		});
	});

	$(".li-links").mouseleave(function (e) {
		$(this).find(".icon-li").css({
			"transform": "scale(1,1)",

		});
	});


	$(".name-title").click(function () {
		$(this).parents(".parent-title").find(".display-information").slideToggle();

	});

});


$(document).ready(function (e) {
	$(".file-div").on("click", function () {


		if ($(this).children(".check-input").prop('checked') == true) {

			$(this).addClass('shadow-class');

		}

		if ($(this).children(".check-input").prop('checked') == false) {
			$(this).removeClass('shadow-class');

		}

	});
});



//...................dash-accordion...........
$(".h3-activity").on("click", function () {
	if ($(this).parents(".card-item").find(".collapse").hasClass("show")) {

		$(this).find("i.fas").removeClass("fa-minus");
		$(this).find("i.fas").addClass("fa-plus");


	} else {


		$(this).find("i.fas").addClass("fa-minus");
		$(this).find("i.fas").removeClass("fa-plus");



	}



});




//...................dash-accordion...........
$(".check-table").on("click", function () {
	if ($(this).is(':checked')) {
		$(this).parents("li").find(".Des-div").slideDown();
	} else {
		$(this).parents("li").find(".Des-div").slideUp();
	}
});
//...................dash-accordion...........
$(".btn-filter").on("click", function () {
	$(".filter-client").slideToggle();
});
