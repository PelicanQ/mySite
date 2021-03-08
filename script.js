var boxImgs = [];
var underThemeTransition = false;
$(document).ready(
	() => {//SET UP
		var fetchedImgs = $(".boxImg");
		for(var i = 0; i < fetchedImgs.length; i++){
			boxImgs[i] = new BoxImg($(fetchedImgs[i]), $(fetchedImgs[i]).css("transform"));
			orbitBoxImg(boxImgs[i])
		}
		makeBackgroundAnimationCanvas($("#backgroundCanvas")[0]);
		//$("#themeTransitionOverlay").hide();
});


function BoxImg(img, originalTransformMatrix){
	this.img = img;
	this.originalMatrix = originalTransformMatrix;
	this.run = false;
	this.angle = 0;
	this.lastTime = 0;

	$(img).hover(() => {
		this.run = true;
		window.requestAnimationFrame((timestamp)=>{boxImgMotionLoop(timestamp, this)});
	});
	$(img).mouseleave(() => {
		this.run = false;
	});
}
function boxImgMotionLoop(timestamp, boxImg){
	progress = timestamp - boxImg.lastTime;
	if(progress > 10){
		boxImg.lastTime = timestamp;
		orbitBoxImg(boxImg);
	}
	if(boxImg.run) window.requestAnimationFrame((timestamp)=> boxImgMotionLoop(timestamp, boxImg));
}
function orbitBoxImg(boxImg){
	var newMatrix = boxImg.originalMatrix.split(",");
	newMatrix[4] = (parseInt(newMatrix[4]) + 5 * Math.cos(boxImg.angle)).toString();
	newMatrix[5] = (parseInt(newMatrix[5]) + 5 * Math.sin(boxImg.angle)).toString();
	boxImg.img.css("transform", newMatrix.join());
	boxImg.angle += 0.03;
}

function toggleTheme(){
	if(underThemeTransition)
		return;
	underThemeTransition = true;//Gloal variable, probably a bad idea;
	var link = $("#stylesheetLink");
	var overlay = $("#themeTransitionOverlay");
	overlay.css("pointerEvents", "auto");
	
	if(link[0].getAttribute("href").indexOf("themeLight.css") == -1){
		$("#themeButton").css("transform", "rotate(0deg)");
		overlay[0].style.backgroundColor = "#FFF";
		$("#themeTransitionOverlay").fadeTo(500, 1, ()=>{
			link[0].href = "/stylesheets/themeLight.css";
			overlay.css("pointerEvents", "none");
			underThemeTransition = false;

		});
		
		} else {
		$("#themeButton").css("transform", "rotate(180deg)");
		overlay[0].style.backgroundColor = "#000";
		$("#themeTransitionOverlay").fadeTo(500, 1, ()=>{
			link[0].href = "/stylesheets/themeDark.css";
			overlay.css("pointerEvents", "none");
			underThemeTransition = false;
		});
		
	}
	
	//Que the fade back to page
	$("#themeTransitionOverlay").fadeTo(500, 0);
	
}