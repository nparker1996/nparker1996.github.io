	"use strict";
	
var galleryNum = 0;
var galleryPics = [];
   
   $(document).ready(function(){
		console.log('loaded');
		//lightBox();
		//slideShow(); //description images
       
       setupLoad(window.location.hash);//opens a project if there is on in the URL
       setupButtons();//setups all the 'More info button'
       //loadProj("#betaRangers",true);
   });
   
   //image fading//
/*
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
   */

    function setupLoad(hashLoc){//opens a project if there is on in the URL when the page is loaded
        if(hashLoc == "") {return;}
        switch(hashLoc){
            case "#aboutMeInfo" :
                loadProj(hashLoc, 0);
                return;
            case "#nullSector" :
            case "#lostAndFound" :
                loadProj(hashLoc, 3);
                return;
            case "#betaRangers" :
            case "#pulpLegends" :
            case "#unnaturalSelection" :
                loadProj(hashLoc, 1);
                return;
            case "#chessAI" :
            case "#depthRedemption" :  
                loadProj(hashLoc, 2);
                return;
            default:
                return;
        }
    }

    function setupButtons(){
        //document.querySelector("#readBetaRangers").onclick = function(){loadProj("#betaRangers",1);};
        $("#readAboutMe").on('click', function(e){loadProj("#aboutMeInfo",0); document.getElementById("meDescr").scrollIntoView(true);});
        $("#descipt").on('click', function(e){loadProj("#aboutMeInfo",0);});
        
        $("#readNullSector").on('click', function(e){loadProj("#nullSector",3); document.getElementById("PublishedDescr").scrollIntoView(true);});
        $("#readLostAndFound").on('click', function(e){loadProj("#lostAndFound",3); document.getElementById("PublishedDescr").scrollIntoView(true);});
        
        $("#readBetaRangers").on('click', function(e){loadProj("#betaRangers",1); document.getElementById("GroupDescr").scrollIntoView(true);});
        $("#readPulpLegends").on('click', function(e){loadProj("#pulpLegends",1); document.getElementById("GroupDescr").scrollIntoView(true);});
        $("#readUnnaturalSelection").on('click', function(e){loadProj("#unnaturalSelection",1); document.getElementById("GroupDescr").scrollIntoView(true);});
        
        $("#readChessAI").on('click', function(e){loadProj("#chessAI",2); document.getElementById("PersonalDescr").scrollIntoView(true);});
        $("#readDepthRedemption").on('click', function(e){loadProj("#depthRedemption",2); document.getElementById("PersonalDescr").scrollIntoView(true);});
        
    }

    function loadProj(projectLoc, GorP){//loads specific project
        //closes both description areas
        $("#meDescr").hide();
        $("#PublishedDescr").hide();
        $("#GroupDescr").hide();
        $("#PersonalDescr").hide();
        //clear description areas
        $("#meDescr").html("");
        $("#PublishedDescr").html("");
        $("#GroupDescr").html("");
        $("#PersonalDescr").html("");
        
        let projectInfo = $(projectLoc).html();
        
        if(GorP == 0){//about me description
            $("#meDescr").html(projectInfo);
            $("#meDescr").fadeIn();
        }
        else if(GorP == 3){//published work
            $("#PublishedDescr").html(projectInfo);
            $("#PublishedDescr").fadeIn();
        }
        else if(GorP == 1){//a group project
            $("#GroupDescr").html(projectInfo);
            $("#GroupDescr").fadeIn();
        }
        else if(GorP == 2){//personal project
            $("#PersonalDescr").html(projectInfo);
            $("#PersonalDescr").fadeIn();
        }
        
        
        galleryDisplay(GorP);
        
        window.location.hash = projectLoc.slice(1);
    }

    function galleryDisplay(GorP){//figures out the images for the gallery
        galleryNum = 0;
        galleryPics = [];
        let loc = "meDescr";
        switch(GorP){
            case 1:
                loc = "GroupDescr";
                break;
            case 2:
                loc = "PersonalDescr";
                break;
            case 3:
                loc = "PublishedDescr";
                break;
            default:
                break;
        }
        galleryPics = document.getElementById(loc).getElementsByClassName("galleryImages");
        galleryPics[galleryNum].style.display = 'inline';
        
        $("#leftArrow").click(function(e){changeImage(-1);});
        $("#rightArrow").click(function(e){changeImage(1);});
    }

    function changeImage(amount){//changes images in gallery
        galleryPics[galleryNum].style.display = 'none';
        galleryNum += amount;
        if(galleryNum < 0){galleryNum = galleryPics.length-1;}
        else if(galleryNum >= galleryPics.length){galleryNum = 0;}
        galleryPics[galleryNum].style.display = 'inline';
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