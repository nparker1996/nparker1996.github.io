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

    function setupLoad(hashLoc){//opens a project if there is on in the URL when the page is loaded
        if(hashLoc == "" || hashLoc == "#projects") {return;}
        switch(hashLoc){
            case "#aboutMeInfo" :
                loadProj(hashLoc, 0);
                return;
            default:
                loadProj(hashLoc, 1);
                return;
        }
    }

    function setupButtons(){
        //document.querySelector("#readBetaRangers").onclick = function(){loadProj("#betaRangers",1);};
        $("#readAboutMe").on('click', function(e){loadProj("#aboutMeInfo",0); document.getElementById("meDescr").scrollIntoView(true);});
        $("#descipt").on('click', function(e){loadProj("#aboutMeInfo",0);});
        
        $("#readNullSector").on('click', function(e){loadProj("#nullSector",1); document.getElementById("ProjectDescr").scrollIntoView(true);});
        
        $("#readLostAndFound").on('click', function(e){loadProj("#lostAndFound",1); document.getElementById("ProjectDescr").scrollIntoView(true);});
        
        $("#readProjCyberB").on('click', function(e){loadProj("#projectCyberB",1); document.getElementById("ProjectDescr").scrollIntoView(true);});
        
        $("#readBetaRangers").on('click', function(e){loadProj("#betaRangers",1); document.getElementById("ProjectDescr").scrollIntoView(true);});
        
        $("#readPulpLegends").on('click', function(e){loadProj("#pulpLegends",1); document.getElementById("ProjectDescr").scrollIntoView(true);});
        
        $("#readUnnaturalSelection").on('click', function(e){loadProj("#unnaturalSelection",1); document.getElementById("ProjectDescr").scrollIntoView(true);});
        
        $("#readChessAI").on('click', function(e){loadProj("#chessAI",1); document.getElementById("ProjectDescr").scrollIntoView(true);});
        
        $("#readDepthRedemption").on('click', function(e){loadProj("#depthRedemption",1); document.getElementById("ProjectDescr").scrollIntoView(true);});
        
    }

    function loadProj(projectLoc, GorP){//loads specific project
        //closes both description areas
        $("#meDescr").hide();
        $("#ProjectDescr").hide();
        //clear description areas
        $("#meDescr").html("");
        $("#ProjectDescr").html("");
        
        let projectInfo = $(projectLoc).html();
        
        if(GorP == 0){//about me description
            $("#meDescr").html(projectInfo);
            $("#meDescr").fadeIn();
        }
        else if(GorP == 1){//published work
            $("#ProjectDescr").html(projectInfo);
            $("#ProjectDescr").fadeIn();
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
                loc = "ProjectDescr";
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