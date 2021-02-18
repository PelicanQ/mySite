define(["preData", "boxes", "list", "levels", "mainScript", "state"], function(preData, boxes, list, levels, script, state){
	loadLevel = function(level){
		var levels = require("levels");
		state.draw(state.blank);
		console.log(levels);
		var index = Object.keys(levels)[level];
		preData.obstacles = levels[index].obstacles;
		preData.turrets = levels[index].turrets;
		preData.platforms = levels[index].platforms;
		preData.obstacles.push(script.ground);
		preData.platforms.push();
		preData.loops.starters.calculate();

	}
	var checkCollision = function(one, two, circle, ex){
		var ex = 0;
		if(typeof one ==="undefined" || typeof two === "undefined"){
			return false;
		}		//NOTE : one will usually be shots, enemies and two will be the player due to the circle feature which treats two as round
		var mar = 0
		var txPos = two.xPos
		var tyPos = two.yPos
		var oxPos = one.xPos;
		var oyPos = one.yPos;
		if(typeof one.xPos == "function"){
			oxPos = one.xPos();
			oyPos = one.yPos();
		}
		//Two is a circle
		if(circle){
		var rad = two.radius
		/*if(two==r){
			rad =  r.width/2+21
			txPos = r.xPos+r.width/2   THIS is for treating player when 
			tyPos = r.yPos+r.height/2	shields are up.
		}*/
		if(one.yPos<tyPos&&one.yPos+one.height>tyPos&&one.xPos<txPos+rad&&one.xPos+one.width>txPos-rad||
		one.xPos<txPos&&one.xPos+one.width>txPos&&one.yPos+one.height>tyPos-rad&&one.yPos<tyPos+rad){
			return true
		}
		if(Math.sqrt(Math.pow(one.xPos+one.width-txPos,2)+Math.pow(one.yPos-tyPos,2)) < rad||
			Math.sqrt(Math.pow(one.xPos-txPos,2)+Math.pow(one.yPos-tyPos,2)) < rad ||
			Math.sqrt(Math.pow(one.xPos+one.width-txPos,2)+Math.pow(one.yPos+one.height-tyPos,2)) < rad||
			Math.sqrt(Math.pow(one.xPos-txPos,2)+Math.pow(one.yPos+one.height-tyPos,2)) < rad
		){
			return true;
		}
		else{
			return false; 
		}
	}
		//Two is a rectangle
		if((oxPos>=two.xPos-mar-ex&&
           oxPos<=two.xPos-mar+ex+two.width)||
           (oxPos+one.width<=two.xPos+two.width-mar+ex&&
           oxPos+one.width>=two.xPos-mar-ex)||
           (oxPos<=two.xPos-mar-ex&&
           oxPos+one.width>=two.xPos-mar-ex)){
			if(oyPos <= two.yPos-mar+two.height+ex&&
               oyPos>=two.yPos-mar-ex){
               return true}
				if((oyPos>=two.Ypos-mar-ex&&
				oyPos<=two.yPos-mar+two.height+ex)||
				(oyPos+one.height<=two.yPos-mar+two.height+ex&&
				oyPos+one.height>=two.yPos-mar-ex)||
				(oyPos+one.height>=two.yPos-mar+two.height+ex&&
				oyPos<=two.yPos-mar-ex)){
					return true
				}
			}   
	}
	/*var windowResize = function(){
		preData.ctx.scale(list.scalePixels / list.scaleSide, list.scalePixels / list.scaleSide);
		if(window.innerWidth-30 > window.innerHeight-30){
			if((window.innerWidth-30)/2 < window.innerHeight-30){
				list.scaleSide = (window.innerWidth-30); list.scalePixels = 1890;
			}
			else {
				list.scaleSide = (window.innerHeight-30); list.scalePixels = 950;
			}
		}
		else {
			list.scaleSide = (window.innerWidth-30); list.scalePixels = 1890;
		}
		preData.ctx.scale(list.scaleSide / list.scalePixels, list.scaleSide / list.scalePixels);
		//state.draw(state.last[state.last.length-1], true);
	}*/
	var clicked = function(x, y){
		for (var i in boxes){
			if(x > boxes[i].xPos - boxes[i].margin && x < boxes[i].xPos+boxes[i].width() + boxes[i].margin 
				&& y > boxes[i].yPos - boxes[i].Asize && y < boxes[i].yPos+boxes[i].margin && boxes[i].visible){
				return boxes[i];
			}
		}
		return false;
	}

	return {
		loadLevel : loadLevel,
		checkCollision : checkCollision,
		clicked : clicked,
		//windowResize : windowResize
	}
})