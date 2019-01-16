/* Valerie M
*/
$('document').ready(function() {

	var companyName;
	var companyLogoUrl;
	var resizedCompanyLogo;
	showIntro();
	$.preloadImages = function() {
		for (var i = 0; i < arguments.length; i++) {
			$("<img />").attr("src", "/images/" + arguments[i]);
		}
	}
	$.preloadImages("SKO.png");
/* Intro section */
function showIntro() {
	$('#logo').delay(300).css({
		visibility: "visible"
	}).fadeIn(2000);
	$('#logo').delay(1000).queue(function(nxt) {
		$(".sliding-background").animate({
			'left': '-300px'
		}, 500, 'linear');
		$("#logo").stop().animate({
			width:"180px",
			height:"203px"
		});
	})
	$('#register').delay(4000).queue(function(nxt3) {
		$('#register').fadeIn({
			queue: false,
			duration: 'slow'
		});
		nxt3();
	});
}
function startRating(presid,voterid){


}

window.setCookie = (function (name,value,days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days*24*60*60*1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "")  + expires + "; path=/" +"; secure";
});
window.getCookie = (function (name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
});
window.eraseCookie = (function (name) {
	document.cookie = name+'=; Max-Age=-99999999;';
}


})
