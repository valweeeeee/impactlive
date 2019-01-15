/* Valerie M
*/
$('document').ready(function() {

	var companyName;
	var companyLogoUrl;
	var resizedCompanyLogo;

	$.preloadImages = function() {
		for (var i = 0; i < arguments.length; i++) {
			$("<img />").attr("src", "/images/" + arguments[i]);
		}
	}
	$.preloadImages("SKO.png");
	var section="name";
	/* recenters */
	jQuery.fn.center = function() {
		this.css("position", "absolute");
		this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
		this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
		return this;
	}

	var metaViewport = document.querySelector('meta[name=viewport]');
	metaViewport.setAttribute('width', '380');
	window.addEventListener("orientationchange", function() {
		if (window.orientation != 0) {
			//alert('This experience is best viewed on a moble device in portrait mode.')
		}
	}, false);
	var pc = false;
	if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		//alert('This experience is best viewed on a moble device in portrait mode.')
		pc = true;
	}
	/* Intro section */
	function showIntro() {
		$("#register").center();
		$('#ticket').delay(300).css({
			visibility: "visible"
		}).fadeIn(3000);
		$('#ticket').delay(2000).queue(function(nxt) {
			$(".sliding-background").animate({
				'left': '-300px'
			}, 500, 'linear');
			$("#ticket").stop().animate({
				width:"180px",
				height:"203px"
			});
			tPosition = $("#ticket").position();
			tWidth = $("#ticket").width() - 100;
		})
		$('#register').delay(6000).queue(function(nxt3) {
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
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}
if (section == "name") {
		showIntro();
	}

})
