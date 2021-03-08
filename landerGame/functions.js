define(["preData", "boxes"], function(preData, boxes){
	
	var collision1D = function (minA, maxA, minB, maxB){
		return (minA < maxB && maxA > minB);
	}

	var checkCollision = function(one, two, circle, ex){
		var ex = 0;
		if(typeof one ==="undefined" || typeof two === "undefined"){
			return false;
		}		//NOTE : one will usually be shots, enemies and two will be the player due to the circle feature which treats two as round
		var tx = two.x
		var ty = two.y
		var ox = one.x;
		var oy = one.y;
		if(typeof one.x == "function"){
			ox = one.x();
			oy = one.y();
		}
		//Two is a circle
		if(circle){
		var rad = two.radius
		/*if(two==r){
			rad =  r.width/2+21
			tx = r.x+r.width/2   THIS is for treating player when 
			ty = r.y+r.height/2	shields are up.
		}*/
		if(one.y<ty&&one.y+one.height>ty&&one.x<tx+rad&&one.x+one.width>tx-rad||
		one.x<tx&&one.x+one.width>tx&&one.y+one.height>ty-rad&&one.y<ty+rad){
			return true
		}
		if(Math.sqrt(Math.pow(one.x+one.width-tx,2)+Math.pow(one.y-ty,2)) < rad||
			Math.sqrt(Math.pow(one.x-tx,2)+Math.pow(one.y-ty,2)) < rad ||
			Math.sqrt(Math.pow(one.x+one.width-tx,2)+Math.pow(one.y+one.height-ty,2)) < rad||
			Math.sqrt(Math.pow(one.x-tx,2)+Math.pow(one.y+one.height-ty,2)) < rad
		){
			return true;
		}
		else{
			return false; 
		}
	}
		//Two is a rectangle
		if((ox>=two.x&&
           ox<=two.x+two.width)||
           (ox+one.width<=two.x+two.width&&
           ox+one.width>=two.x)||
           (ox<=two.x&&
           ox+one.width>=two.x)){
			if(oy <= two.y+two.height&&
               oy>=two.y){
               return true}
				if((oy>=two.y&&
				oy<=two.y+two.height)||
				(oy+one.height<=two.y+two.height&&
				oy+one.height>=two.y)||
				(oy+one.height>=two.y+two.height&&
				oy<=two.y)){
					return true
				}
			}   
	}
	

	var clicked = function(x, y){
		for (var i in boxes){
			if(x > boxes[i].x - boxes[i].margin && x < boxes[i].x+boxes[i].width() + boxes[i].margin 
				&& y > boxes[i].y - boxes[i].Asize && y < boxes[i].y+boxes[i].margin && boxes[i].visible){
				return boxes[i];
			}
		}
		return false;
	}

	return {
		checkCollision : checkCollision,
		collision1D: collision1D,
		clicked : clicked

	}
})