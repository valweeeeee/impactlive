/* Valerie M
*/
$('document').ready(function() {
	var companyName;
	var companyLogoUrl;
	var email1subject;
	var pushcontent1;
	var pushcontent2;
	var pushcontent3;
	var pushcontent4;
	var pushcontent5;
	var nologo;
	var surveylink;
	var companyinitial;
	$.QueryString = (function(paramsArray) {
			 let params = {};
			 for (let i = 0; i < paramsArray.length; ++i){
					 let param = paramsArray[i]
							 .split('=', 2);
					 if (param.length !== 2)
							 continue;
					 params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
			 }
			 return params;
	 })(window.location.search.substr(1).split('&'))

	let room = $.QueryString["r"];
	if(room!="" && room){
		var data='{"presentationid":"'+room+'" }';

		$.ajax({
			 url: '/getpresentation/',
			 contentType: 'application/json',
			 data: data,
			 type: 'POST',
			 dataType: "json",
			 success: function (data) {
				 if(data==0){
					 window.location="http://www.salesforce.org";
				 }
					$.each(data, function (a, b) {
						companyName=b.companyname;
						companyLogoUrl=b.companylogourl;
						pushcontent1=b.pushcontent1url;
						pushcontent2=b.pushcontent2url;
						pushcontent3=b.pushcontent3url;
						pushcontent4=b.pushcontent4url;
						pushcontent5=b.pushcontent5url;
						email1subject=b.email1subject;
						surveylink=b.surveylink;
					});

					document.title="Salesforce.org with "+companyName;
					companyLogoUrl=companyLogoUrl.replace('350x350','270x270');
					$("#acsLogo").attr('src',companyLogoUrl);
					$("#acsLogo").attr('alt',companyName);
					$("#custSubject").html(email1subject);
					$("#subjectLink").html(companyName);
					$("#emailImg").attr('src',pushcontent1);
					$("#email1Img").attr('alt',companyName);
					companyinitial=companyName.charAt(0);
					$("#icon").text(companyinitial.toUpperCase());
				},
				error: function (request, status, error) {
						//alert(request.responseText);

					}
			});

		var socket = io.connect('',{query: 'v='+room,'transports': ['websocket']});
		socket.removeAllListeners();
		socket.on('connect', () => {
				socket.emit("joinRoom",room);
		});

		var x=0;
		var frame;

		socket.on('message', function(data) {
				var imgSrc='';
				switch(data){
					case "Finish":
						showEnd();
						break;
					case "Frame2":
						imgSrc=pushcontent2;
						break;
					case "Frame3":
							imgSrc=pushcontent3;
							break;
					case "Frame4":
							imgSrc=pushcontent4;
							break;
					case "Frame5":
							imgSrc=pushcontent5;
								break;
					case "StartOver":
							window.location="/?r="+room;
							break;
					default:
							imgSrc='';
				}
					if (imgSrc!='' && imgSrc){
						status="pushed";
						clear();
						$('<div id="pushed"><img src="'+imgSrc+'" alt="'+companyName+'" id="push" style="max-width:99vw;margin-top:10px;"></div>').prependTo('body').hide().fadeIn(400);
					}
					x++;
				});
			}
	else{
			alert("You need to specify a room. Invalid URL.");
			window.location="http://www.salesforce.org";
	}

	var section="name";
	/* recenters */
	jQuery.fn.center = function() {
		this.css("position", "absolute");
		this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
		this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
		return this;
	}
	$("#register").center();
	var metaViewport = document.querySelector('meta[name=viewport]');
	metaViewport.setAttribute('width', '380');
	window.addEventListener("orientationchange", function() {
		if (window.orientation != 0) {
			alert('This experience is best viewed on a moble device in portrait mode.')
		}
	}, false);
	var pc = false;
	if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		alert('This experience is best viewed on a moble device in portrait mode.')
		pc = true;
	}
	/* Intro section */
	function showIntro() {
		/*preload images*/

		$.preloadImages = function() {
			for (var i = 0; i < arguments.length; i++) {
				$("<img />").attr("src", "/images/" + arguments[i]);
			}
		}
		$.preloadImages( "balloon.png", "blueHaveMail.png","blueJourney.png", "blueJourney.png", "email.png", "impactLiveFooter.png", "journeycont.png","loading.gif","salesforce.png", "thankyou.png");


		$('#ticket').delay(300).css({
			visibility: "visible"
		}).fadeIn(3000);
		$('.fadeInIntro').hide().delay(500).css({
			visibility: "visible"
		}).fadeIn(3000);
		$('#ticket').delay(2000).queue(function(nxt) {
			$(".sliding-background").animate({
				'left': '-300px'
			}, 500, 'linear');
			$("#ticket").stop().animate({
				marginLeft: '-170px',
				width:"150px",
				height:"78px"
			});
			$("#acsLogo").parent().css({
				position: 'relative'
			});
			acsPosition = $("#acsLogo").position();
			$("#acsLogo").css({
				top: acsPosition.top,
				left: acsPosition.left,
				position: 'absolute'
			});
			$("h4.fadeInIntro").hide('fast');
			tPosition = $("#ticket").position();
			tWidth = $("#ticket").width() - 100;
			resizedCompanyLogo=companyLogoUrl.replace('270x270','100x100');
			$("acsLogo").hide('fast');
			$("#acsLogo").attr('src',resizedCompanyLogo);
			$("acsLogo").show('fast');
			$("#acsLogo").animate({
				'margin-left': (tWidth) + 'px',
				'top': tPosition.top,
			});
			nxt();
		});
		$('#register').delay(6000).queue(function(nxt3) {
			$('#register').fadeIn({
				queue: false,
				duration: 'slow'
			});
			nxt3();
		});
	}
	function timeNow() {
  var d = new Date(),
    h = d.getHours(),
    m = (d.getMinutes()<10?'0':'') + d.getMinutes();
		if(h>12?h=h-12:'');
   return  h + ':' + m;
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
	/*form*/
	var questions = [{
		question: "What is your first name?"
	}, {
		question: ""
	}, {
		question: ""
	}];
	(function() {
		var tTime = 100 // transition transform time from #register in ms
		var wTime = 200 // transition width time from #register in ms
		var eTime = 1000 // transition width time from inputLabel in ms
		// init
		// --------------
		var position = 0
		putQuestion()
		progressButton.addEventListener('click', validate)
		inputField.addEventListener('keyup', function(e) {
			transform(0, 0) // ie hack to redraw
			if (e.keyCode == 13) validate()
		})

		function putQuestion() {
			inputLabel.innerHTML = questions[position].question
			inputField.value = ''
			inputField.type = questions[position].type || 'text'
			inputField.focus()
			showCurrent()
		}
		// when all the questions have been answered
		function done() {
			register.className = 'close'
		}
		// when submitting the current question
		function validate() {
			// set the value of the field into the array
			questions[position].value = inputField.value
			// check if the pattern matches
			if (!inputField.value.match(questions[position].pattern || /.+/)) wrong()
			else ok(function() {
				if (section == "name") {
					$(".sliding-background").hide();

					hideCurrent(done)
					position = 1;
					$('#ticket').animate({
						left: '-2000px'
					}, {
						duration: 800
					});
					$('#ticket').css("display", "none");
					$("#acsLogo").animate({
						left: '-2000px'
					}, {
						duration: 800
					});
					$('#acsLogo').css("display", "none");
					$('#inputField').css("display", "none");
					$(".next").css('display', 'none');
					startJourney();
				}
			})
			window.validate = validate;
		}

		function hideCurrent(callback) {
			inputContainer.style.opacity = 0
			setTimeout(callback, wTime)
		}

		function showCurrent(callback) {
			inputContainer.style.opacity = 1
			setTimeout(callback, wTime)
		}

		function transform(x, y) {
			register.style.transform = 'translate(' + x + 'px ,  ' + y + 'px)'
		}

		function ok(callback) {
			register.className = ''
			setTimeout(transform, tTime * 0, 0, 10)
			setTimeout(transform, tTime * 1, 0, 0)
			setTimeout(callback, tTime * 2)
		}

	}())
})
