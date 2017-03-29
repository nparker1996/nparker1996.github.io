	"use strict";
	
   
   $(document).ready(function(){
		console.log('loaded');
		lightBox();
		slideShow(); //description images
		SPA_Personal(); //Single page Applications - Personal Projects
		SPA_School(); //Single page Applications - School Projects
		SPA_Contact(); //Single page Applications - Contact Info
   });
   
   //image fading//
   function lightBox(){
	   $("img").on("click", function(e){
				var lightbox = document.createElement("div");
				lightbox.style.position = "fixed";
				lightbox.style.height = "100%";
				lightbox.style.width = "100%";
				lightbox.style.left = 0;
				lightbox.style.top = 0;
				lightbox.style.backgroundColor = "rgba(0,0,0,0.7)";
				lightbox.style.display = "none";
				var myImg = document.createElement("img");
				myImg.src = e.target.src;
				myImg.onload = function(){
					myImg.style.position = "absolute";
					var diffWidth = $(window).width()/2 - myImg.width/2;
					var diffHeight = $(window).height()/2 - myImg.height/2;
					myImg.style.left = diffWidth + "px";
					myImg.style.top = diffHeight + "px";
					
					lightbox.appendChild(myImg);
					document.body.appendChild(lightbox);
					$(lightbox).fadeIn(200);
				};
				lightbox.addEventListener("click", function(e){
					$(lightbox).fadeOut(200, function(){
						lightbox.remove();
					});
				});
			});
   }
   
   //description images//
   function slideShow() {
	   $('#slides').slidesjs(
			{
				width: 200,
				height: 200,
				pagination:
				{
					active: false
				},
				effect:
				{
					slide:
					{
						speed: 2000
					}
				}
			}
		);
   }
   
   //Single page Applications//
   function SPA_Personal() {
	   $("#abomination").on("click", function(e){
			console.log('clicked abomination');
			$("#ChessAIContent").hide();
			$("#abominationContent").fadeIn();
			
			$("#ChessAI").removeClass("selected");
			$("#abomination").addClass("selected");
		});
		$("#ChessAI").on("click", function(e){
			console.log('clicked ChessAI');
			$("#abominationContent").hide();
			$("#ChessAIContent").fadeIn();
			
			$("#abomination").removeClass("selected");
			$("#ChessAI").addClass("selected");
		});
   }
   
   function SPA_School() {
	   $("#Beta").on("click", function(e){
			console.log('clicked Beta');
			$("#OtherProjContent").hide();
            $("#PulpContent").hide();
			$("#BetaContent").fadeIn();
			
			$("#OtherProj").removeClass("selected");
            $("#Pulp").removeClass("selected");
			$("#Beta").addClass("selected");
		});
       $("#Pulp").on("click", function(e){
			console.log('clicked Pulp');
			$("#OtherProjContent").hide();
            $("#BetaContent").hide();
			$("#PulpContent").fadeIn();
			
			$("#OtherProj").removeClass("selected");
            $("#Beta").removeClass("selected");
			$("#Pulp").addClass("selected");
		});
		$("#OtherProj").on("click", function(e){
			console.log('clicked Other');
			$("#BetaContent").hide();
            $("#PulpContent").hide();
			$("#OtherProjContent").fadeIn();
			
			$("#Beta").removeClass("selected");
            $("#Pulp").removeClass("selected");
			$("#OtherProj").addClass("selected");
		});
       
   }
   function SPA_Contact() {
	   $("#noteInfo").on("click", function(e){
			console.log('clicked noteInfo');
			$("#contactContent").hide();
			$("#noteContent").fadeIn();
			
			$("#contactInfo").removeClass("selected");
			$("#noteInfo").addClass("selected");
		});
		$("#contactInfo").on("click", function(e){
			console.log('clicked contactInfo');
			$("#noteContent").hide();
			$("#contactContent").fadeIn();
			
			$("#noteInfo").removeClass("selected");
			$("#contactInfo").addClass("selected");
		});
   }
   
   //forms and email
   
   function validateForm() {
		var valid = true;
		var email = document.getElementById('email');
		var email_validation = document.getElementById("email_validation");
		var name = document.getElementById('name');
		var name_validation = document.getElementById("name_validation");
		var message_validation = document.getElementById("message_validation");
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  
		if (name.value === "") {
			valid = false;
			name_validation.innerHTML = "Name Required";
			name_validation.style.display = "block";
			name_validation.parentNode.style.backgroundColor = "#FFDFDF";
		}
		else {
			name_validation.style.display = "none";
			name_validation.parentNode.style.backgroundColor = "transparent";
		}
  
		if (message.value === "") {
			valid = false;
			message_validation.innerHTML = "Message Required";
			message_validation.style.display = "block";
			message_validation.parentNode.style.backgroundColor = "#FFDFDF";
		}
		else {
			message_validation.style.display = "none";
			message_validation.parentNode.style.backgroundColor = "transparent";
		}
  
		if (email.value === "") {
			valid = false;
			email_validation.innerHTML = "Field Required";
			email_validation.style.display = "block";
			email_validation.parentNode.style.backgroundColor = "#FFDFDF";
		}
		else {
			email_validation.style.display = "none";
			email_validation.parentNode.style.backgroundColor = "transparent";
		}
  
		if(!filter.test(email.value)) {
			valid = false;
			email_validation.innerHTML = "Invalid email address";
			email_validation.style.display = "block";
			email_validation.parentNode.style.backgroundColor = "#FFDFDF";
		}
		else {
			email_validation.style.display = "none";
			email_validation.parentNode.style.backgroundColor = "transparent";
		}
		if (!valid){return false;}
}