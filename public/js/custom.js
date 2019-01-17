/* Valerie M*/
$('document').ready(function() {
	let day="Day1";
	var presentationAuthor;
	var presentationID;
	var vote;
	var home="http://192.168.0.106:3001/index.html";
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
		else{
			$('#logo').css({
				visibility: "visible",
				height:'200px',
				width:'auto'
			}).fadeIn('fast');
			$('#register').fadeIn('fast');
		}
	}
	function startRating(presid,voterid){


	}


	if(day=="Day1")
		var displayDay="Day 1";
	else
		var displayDay="Day 2";

	$(".day").html(displayDay);

	function pickPresentation(day){
		if(!getCookie('scoringUser')){
			$(".sliding-background").animate({
				'left': '-625px'
			}, 200, 'linear');

		}
		else{
			fullName=getCookie('scoringUserName').split(" ");
			var firstName=fullName[0];
			$("#register h6").text('Welcome to '+day+' of IMPACT200, '+firstName+'!');
		}
		$("#register p").text('Pick a presentation to score:');
		$("#voter").hide('fast');
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
						if($("#author").text()==''){
							$("#register h6").before("<h5><span id='author'>" + presentationAuthor +"</span><br><span id='criteriaText'></span></h5>");
						}
						$(".curVote").val('');
						$("#register p").hide('fast');
						$("#register h5").after("<p id='criteriaDescription'></p>");
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
						 $(".sliding-background").animate({
							 'left': '-625px'
						 }, 200, 'linear');
						 $("#register").stop().animate({
							width:"90%"
							});

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
					 $.each(data, function (a, b) {

					 });

				 },
				 error: function(xhr, status, error) {
					//alert('hello');
					//alert(JSON.stringify(xhr.responseText));
					}
			 });
			 data='{"voterid":"'+getCookie('scoringUser')+'","presentationid": "'+presentationID+'"}';
			 if($(".curCriteria").val()!=1010)
	 		 	getPresentations(data);
			else{
				showEnd();
			}
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
