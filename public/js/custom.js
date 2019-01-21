/* Valerie M*/
$('document').ready(function() {
	let day="Day1";
	var presentationAuthor;
	var presentationID;
	var vote;
	var width;
	var height;
	if($(document).height()>700){
		var width="180px";
		var height="203px"
	}
	else{
		width="133px";
		height="150px";
	}
	if(day=="Day1")
		var displayDay="Day 1";
	else
		var displayDay="Day 2";

	$(".day").html(displayDay);
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
		//document.cookie = name + "=" + (value || "")  + expires + "; path=/" +"; secure";
	document.cookie = name + "=" + (value || "")  + expires + "; path=/";
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
	if(getCookie('scoringUser')){
		pickPresentation(day);
	}
	/* Intro section */
	function showIntro() {

		if(!getCookie('scoringUser')){
				$('#logo').delay(300).css({
					visibility: "visible"
				}).fadeIn(2000);
				$('#logo').delay(1000).queue(function(nxt) {
						$(".sliding-background").animate({
							'left': '-300px'
						}, 500, 'linear');


					$("#logo").stop().animate({
						width:width,
						height:height
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
		else{
			$('#logo').css({
				visibility: "visible",
				height:height,
				width:'auto'
			}).fadeIn('fast');
			$('#register').fadeIn('fast');
		}
	}
	function pickPresentation(day){
		if(!getCookie('scoringUser')){
			//if($(document).width()<1000){
				$(".sliding-background").animate({
					'left': '-300px'
				}, 200, 'linear');
			//}

		}
		else{
			fullName=getCookie('scoringUserName').split(" ");
			var firstName=fullName[0];
			$("#voter").hide('fast');
			$("#register h6").html('Welcome to '+displayDay+' of <br>IMPACT200, '+firstName+'! <br><span id="newUser"><a href="#" style="font-size:smaller">Not you? Click here.</a></span>');
		}
		$("#register p").text('Pick a presentation to score:');
		$("#voters").hide('fast');
		$("#presentations").show('slow');
		$(".next").removeClass("next").addClass('next1');
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
	}
	$("body").on("click", '.next', function() {
		if(!getCookie('scoringUser') || getCookie('scoringUser')==''){
			setCookie('scoringUser', $("#voter").val());
			setCookie('scoringUserName', $( "#voter option:selected" ).text());
		}

		pickPresentation(day);
	});
	$("body").on("click", '#rateAnother', function() {
		window.location="/index.html";
	});
	$("body").on("click", '#newUser', function() {
		eraseCookie('scoringUser');
		eraseCookie('scoringUserName');
		window.location="/index.html";

	})
		//picking presentation
	function getPresentations(data){

			$.ajax({
				 url: "/getcurrentcriteria/",
				 contentType: 'application/json',
				 type: 'POST',
				 data: data,
				 dataType: "json",
				 success: function (data) {
					 if(data.data==1010){
						 alert('You have already completed the scoring for this user.');
					 }
					 else{
						$("#register h6").hide('fast');
							$('.loader').replaceWith('<button class="next2">Next</button>');
						if($("#author").text()==''){
							$("#register h6").before("<h5><span id='author'>" + presentationAuthor +"</span><br><span id='criteriaText'></span></h5>");
						}
						$(".curVote").val('');
						$("#register p").text('');
						$("#register h5").after("<p id='criteriaDescription'></p>").fadeIn('slow');
						$("#presentations").hide('fast');
						$(".ratings").show('fast');
						$(".next1").hide('fast');
						 $.each(data, function (a, b) {
							 criteriaid=b.criteriaid;
							 criteriatext=b.criteriatext;
							 criteriadescription=b.criteriadescription;
							 $(".curPres").val(presentationID);
							 $(".curCriteria").val(criteriaid);
							 $("#criteriaText").text(criteriatext);
							 $("#criteriaDescription").text(criteriadescription);
						 });

						 $("#register").stop().animate({
							width:"90%"
							});
							var backgroundPOS=$(".sliding-background").position();
							backgroundPOS=backgroundPOS.left - 300 + 'px';
							//if($(document).width()<1000){
								$(".sliding-background").animate({
									'left': backgroundPOS
								}, 200, 'linear');
							//}

					 }

				 },
				 error: function(xhr, status, error) {
					//alert('hello');
					//alert(JSON.stringify(xhr.responseText));
					}
			 });

	}
	$("body").on("click", '.next1', function() {
		presentationAuthor=$("#presentations option:selected").text();
		presentationID=$("#presentations").val();

		var data='{"voterid":"'+getCookie('scoringUser')+'","presentationid": "'+presentationID+'"}';
		getPresentations(data);
		$('.btn').css('background','#fff');

	});
	$("body").on("click", '.btn', function() {
			$(".curVote").val($(this).text());
			$(".btn").css('background','#fff');
			$(this).css('background','#FFC700');
	})
	$("body").on("click", '.next2', function() {
		$('.btn').css('background','#fff');
		if($(".curVote").val()==''){
			alert('Please enter your score before proceeding.');
		}
		else{
			//$(this).hide();
			$(this).replaceWith("<img src='/images/ajaxLoader.gif' width='100' height='31' class='loader'>");
			vote=$(".curVote").val();
			presentationID=$(".curPres").val();
			var data='{"voterid":"'+getCookie('scoringUser')+'","presentationid": "'+presentationID+'", "vote":"'+vote+'","criteriaid":"'+$(".curCriteria").val()+'"}';
			$.ajax({
				 url: "/updatevote/",
				 contentType: 'application/json',
				 type: 'POST',
				 data: data,
				 dataType: "json",
				 success: function (data) {


					 data='{"voterid":"'+getCookie('scoringUser')+'","presentationid": "'+presentationID+'"}';
					 if($(".curCriteria").val()!=1010){
			 		 	getPresentations(data);

					}
					else{
						data='{"voterid":"'+getCookie('scoringUser')+'","presentationid": "'+presentationID+'"}';
						$.ajax({
							 url: "/updatelastcompleted/",
							 contentType: 'application/json',
							 type: 'POST',
							 data: data,
							 dataType: "json",
							 success: function (data) {
								 showEnd();
							 },
							 error: function(xhr, status, error) {
								//alert('hello');
								//alert(JSON.stringify(xhr.responseText));
								}
						 });

					}

				 },
				 error: function(xhr, status, error) {
					//alert('hello');
					//alert(JSON.stringify(xhr.responseText));
					}
			 });

		}

	})
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
					$("#voter").chosen({
				      no_results_text: "Oops, nothing found!",
							width:"200px"
				    })
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
			window.showEnd = (function (window, document, undefined) {
				clear();
				$("body").css('overflow','hidden');
				endHTML="<div id='end'><div id='balloon'><img src='images/balloon.png'></div></div>";
				$("body").css('background', "#009BE0");
				$(endHTML).appendTo('body').hide().fadeIn(500);
				$("#balloon").animate({ top: "-650px" },4000,function(){
					$("#balloon").after("<button id='rateAnother' style='background:#fff'>Score Another Presentation</button>").fadeIn(3000);
				});

			})
			window.clear = (function (window, document, undefined) {
				$("#pushed").empty();
				$('#whole').remove();
				$("body").animate({backgroundColor: "#ffffff"}, 'fast');
				$("#end").remove();
				$("#thankyou").remove();
				$("#extras").remove();
				$("body").css('overflow-y','visible');

			});
})
