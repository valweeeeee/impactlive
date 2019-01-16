/* Valerie M*/
$('document').ready(function() {
		var day="Day1";
	$.preloadImages = function() {
		for (var i = 0; i < arguments.length; i++) {
			$("<img />").attr("src", "/images/" + arguments[i]);
		}
	}
	$.preloadImages("SKO.png");

	window.setCookie = (function (name,value,days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days*24*60*60*1000));
			expires = "; expires=" + date.toUTCString();
		}
		alert('cookie');
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
	})

	showIntro();
	if(!getCookie('scoringUser') || getCookie('scoringUser')=='' || getCookie('scoringUser')=="null"){
		$("#register").append('<br> '+
		'<h6>Welcome to <span class="day"></span> of IMPACT200!</h6>' +
		'<p>Pick your name below:</p>' +
		'<select id="voter"></select>' +
		'<select id="presentations" style="display:none"></select>' +
		'<button class="next">Next</button>');
	}
	else{
		$("body .next").trigger('click');
	}
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


	if(day=="Day1")
		var displayDay="Day 1";
	else
		var displayDay="Day 2";

	$(".day").html(displayDay);
	function pickPresentation(day){
		$(".sliding-background").animate({
			'left': '-625px'
		}, 200, 'linear');
		$("#register h6").text('Now pick a presentation to score!');
		$("#voter").hide('fast');
		$("#presentations").show('slow');
		$(".next").removeClass("next").addClass('next1');
		$("#register p").hide('fast');
	}
	$("body").on("click", '.next', function() {
		if(!getCookie('scoringUser')){
			alert('hello');
			setCookie('scoringUser', $("#voter").val());
		}
		pickPresentation(day);
		var data='{"voterid":"'+getCookie('scoringUser')+'" }';
		$.ajax({
			 url: "/"+day+"/updatestartdate/",
			 contentType: 'application/json',
			 type: 'POST',
			 data: data,
			 dataType: "json",
			 success: function (data) {
					//alert('done');
			 },
			 error: function(xhr, status, error) {
					//alert(JSON.stringify(xhr.responseText));
				}
		 });
	});
	$("body").on("click", '.next1', function() {
		$("#register").stop().animate({
			width:"80%"
		});
	});
		$.ajax({
			 url: '/getvoters/',
			 contentType: 'application/json',
			 type: 'POST',
			 dataType: "json",
			 success: function (data) {
				 var lastPresID;
					$.each(data, function (a, b) {
						$("#voter").append("<option value="+b.voterid+" id="+b.voterid+">"+b.votername+"</option>");
					});
			 },
			 error: function(xhr, status, error) {
					//alert(JSON.stringify(xhr.responseText));
				}
		 });
		 if(day=="Day1"){
			 url='/getday1/';
		 }
		 else{
			 url='/getday2/';
		 }
		 $.ajax({
				url: url,
				contentType: 'application/json',
				type: 'POST',
				dataType: "json",
				success: function (data) {
					 $.each(data, function (a, b) {
						 $("#presentations").append("<option value="+b.presentationid+" id="+b.presentationid+">"+b.presentationauthor+"</option>");
					 });
				},
				error: function(xhr, status, error) {
					 //alert(JSON.stringify(xhr.responseText));
				 }
			});
})
