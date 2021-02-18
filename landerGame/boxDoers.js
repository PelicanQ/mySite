require(["boxes","functions"], function(boxes, functions){
	console.log("indoesr");
	boxes.level0.doIt = function(){
		functions.loadLevel(0);
		console.log("success!");
	}
	boxes.level1.doIt = function(){
		functions.loadLevel(1);
	}
})