/* Valerie M
*/
$('document').ready(function() {
	var companyName;
	var companyLogoUrl;
	var nologo;
	var resizedCompanyLogo;
	$.preloadImages = function() {
		for (var i = 0; i < arguments.length; i++) {
			$("<img />").attr("src", "/images/" + arguments[i]);
		}
	}
	$.preloadImages("sko.png");
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
	function showInviteEmail(){
		$(".container").fadeOut("normal",function(){
			$(this).remove();
		});
		$("#whole").hide();
		$('.fNameStored').text(questions[0].value);
		$("#curTime").html(timeNow());
		$('body').delay(200).queue(function(nxt3) {
		$("body").css('overflow','visible');
		$('#subject').fadeIn({
			queue: false,
			duration: 'slow'
		});
		$('#emailBuild').fadeIn({
			queue: false,
			duration: 'slow'
		});
		$('#icon').fadeIn({
			queue: false,
			duration: 'slow'
		});
		$('#tosection').fadeIn({
			queue: false,
			duration: 'slow'
		});
		$('#inbox').fadeIn({
			queue: false,
			duration: 'slow'
		});
		$("#email1").fadeIn({
			queue: false,
			duration: 'slow'
		});
		$("#nextStep").fadeIn({
			queue: false,
			duration: 'slow'
		});
					nxt3();
				});
	}
	$("body").on("click", '#newMail', function() {
		showInviteEmail();
	});

	$("body").on("click", '#nextStep', function() {
		$("#emailImg").hide();
		startJourney2();
	});
	var status="pushed";
	window.clear = (function (window, document, undefined) {
		$("#pushed").empty();
		$('#whole').remove();
		$('#journeyStartAgain').remove();
		$("#progressBar").remove();
		$("#newMail2").remove();
		if(status!="end")
			$("body").animate({backgroundColor: "#ffffff"}, 'fast');
		$("#end").remove();
		$("#thankyou").remove();
		$("#extras").remove();
		$("body").css('overflow-y','visible');

	});
	window.showEnd = (function (window, document, undefined) {
		var section = "end";
		status="end";
		clear();
		$("body").css('overflow','hidden');
			endHTML="<div id='end'><div id='balloon'><img src='images/balloon.png'></div></div>";
				$("body").css('background', "#009BE0");
				$("#thankyou").css('margin-top','25px');

				$("#pushed").remove();


				$(endHTML).appendTo('body').hide().fadeIn(500);

				$("#balloon").animate({ top: "-650px" },4000,function(){
					//$("#end").remove();
					//$(this).remove();
					if(surveylink!=''){
						surveyHTML="<br><br><a href='"+surveylink+"' target='_blank' style='color:#fff;font-size:22px'>Please complete our survey</a>";
					}
					else{
						surveyHTML='';
					}
					$(surveyHTML).appendTo('#balloon').hide().fadeIn(500);
				});



	})
	function startJourney() {

		$(".eventSelect").stop(true, false).fadeOut('fast');
		$("#register").fadeOut('fast');
		$(".sliding-background").fadeOut('fast');
		$('body').delay(500).queue(function(nxt99) {
			$("#journeyStart").remove();

				$("<div id=\"journeyStart\"><img src=\"/images/blueJourney.png\" width=\"154\" height=\"154\" alt=\"start your journey!\" id=\"journey\"><img src=\"/images/email.png\" width=\"152\" height=\"189\" alt=\"you have emails!\" style=\"display:none\" id=\"emailJourney\"></div>").prependTo(".center").hide().fadeIn(200);
				$("<div id=\"progressBar\" class=\"skillbar clearfix\" data-percent=\"100%\"><div class=\"skillbar-bar\" style=\"background: #ED7D31;\"></div></div>").prependTo(".center").hide().fadeIn(1000);


		 var	startLevel=$("#journeyStart").offset();
		//	$("#journeyStart").css({marginTop: startLevel.top, left: startLevel.left});

			$('#progressBar').each(function() {
				$(this).find('.skillbar-bar').animate({
					width: $(this).attr('data-percent')
				}, 2000, function() {}).promise().done(function() {
					$("#journey").slideUp(100, function() {
						$("#journey").css("display", "none");
						$("#emailJourney").slideDown('slow');
							$('<div id="newMail"><button id="getMail">Get Mail</button></div>').appendTo(".container").slideDown(5000);
						$("#progressBar").animate({
							top: (startLevel.top-220),
							marginLeft: 0
						}, 500, function() {}).fadeTo(200, 1);
					});
				});
			});
			nxt99();
		});
	}
	function startJourney2() {
		$("body").css('overflow','hidden');
		$("#extras").hide();

		$('body').delay(500).queue(function(nxt100) {
			$("#journeyStartAgain").remove();

				$("<div id=\"journeyStartAgain\"><img src=\"/images/journeycont.png\" width=\"300\" height=\"300\" alt=\"start your journey!\" id=\"journey2\">").prependTo("body").hide().fadeIn(200);
				 var	startLevel=$("#journeyStartAgain").offset();
				 $("<div id=\"progressBar\" style=\"overflow:hidden;\" class=\"skillbar clearfix\" data-percent=\"100%\"><div class=\"skillbar-bar\" style=\"background: #ED7D31;\"></div></div>").prependTo("body").hide().fadeIn(1000);
			$('#progressBar').each(function() {
				$(this).find('.skillbar-bar').animate({
					width: $(this).attr('data-percent')
				}, 1000, function() {}).promise().done(function() {
							$('<div id="newMail2" style=\"overflow:hidden;\"><br><h6 style=\"font-size:smaller;font-weight:bold;color:#fff\">Please wait while we craft the rest of your journey</h6><img src=\"/images/loading.gif\" width=\"100\" height=\"100\" style=\"margin-top:-35px;\"></div>').appendTo("body").slideDown(100);

				});
			});
			nxt100();
		});
	}
	if (section == "name") {
		showIntro();
	}

})
