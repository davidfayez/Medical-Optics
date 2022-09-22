$(document).ready(function(e) {
//	........menu..........
	$(".btn-menu").on("click", function(){	
		$(".big-menu").addClass("show-menu");
		$(".overlay-div").show();
	});
	$(".btn-menu-close").on("click", function(){	
		
		$(".big-menu").removeClass("show-menu");
				$(".overlay-div").hide();
	});
	
	
	
//	........collapse..........
	
$(".collapse-btn").click(function(){
	
	$(".big-menu").toggleClass("small-menu");
		$(".container-padding").toggleClass("small-padding");
				$(".logo-div").toggleClass("width-logo");
				$(".rvnm-navbar-box.dark-ruby ul li ul").css({"display":"none"});
				$(".rvnm-collapseable").addClass("rvnm-expandable");
				$(".rvnm-collapseable").removeClass("rvnm-collapseable");

				


});

//...................dash-accordion...........
 $(".h3-activity").on("click", function(){	
if ($(this).parents(".card").find(".collapse").hasClass( "show" )) {

$(this).find("i.fas").removeClass("fa-minus");
$(this).find("i.fas").addClass("fa-plus");



} else { 


$(this).find("i.fas").addClass("fa-minus");
$(this).find("i.fas").removeClass("fa-plus");



}
	
	
	
});




//..................accordion2..............

 $(".head-acc h2").on("click", function(){	
if ($(this).parents(".big-acc").find(".page-accodion").hasClass("show")) {
	

$(this).find("i.fas").removeClass("fa-minus");
$(this).find("i.fas").addClass("fa-plus");

$(this).parents(".big-acc").siblings().find("i.fas").removeClass("fa-minus");
$(this).parents(".big-acc").siblings().find("i.fas").addClass("fa-plus");




} else { 


$(this).find("i.fas").addClass("fa-minus");
$(this).find("i.fas").removeClass("fa-plus");

$(this).parents(".big-acc").siblings().find("i.fas").removeClass("fa-minus");
$(this).parents(".big-acc").siblings().find("i.fas").addClass("fa-plus");

}

});

//..................accordion3..............
 $(".head-acc-2 h2").on("click", function(){	
if ($(this).parents(".big-acc-2").find(".collapse").hasClass( "show" )) {
$(this).find("i.fas").removeClass("fa-minus");
$(this).find("i.fas").addClass("fa-plus");
} else { 
$(this).find("i.fas").addClass("fa-minus");
$(this).find("i.fas").removeClass("fa-plus");
}
	
});

//..................accordion-inner..............
 $(".head-acc-3 h2").on("click", function(){	
if ($(this).parents(".big-acc-3").find(".page-inner").hasClass( "show" )) {
$(this).find("i.fas").removeClass("fa-minus");
$(this).find("i.fas").addClass("fa-plus");
} else { 
$(this).find("i.fas").addClass("fa-minus");
$(this).find("i.fas").removeClass("fa-plus");
}
	
});


});






