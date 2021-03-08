define(["state", "config", "preData", "constructors", "bossConstructor", "boxes", "customBosses", "script", "sound"], 
	function(state, config, preData, constructors, Boss, boxes, customBosses, script, sound){
	var {ctx, c, r, keys, bosses, shakers, explosions, loops} = preData;
	var {Enemy, PowerUp} = constructors;

	var resumeGame = function(){

		loops.IDs.calculate = window.requestAnimationFrame(script.calculate);
	}
	var pauseGame = function(){
		window.cancelAnimationFrame(loops.IDs.calculate);	
	}
	var loseGame = function(){
		if(!state)
			state = require("state");//Lazy fix of dependency
		window.cancelAnimationFrame(loops.IDs.calculate);
		//state.draw(state.gameOver);
	}

	var checkCollision = function(one, two, twoIscircle, ex){
		var ox = one.x;//Aliases
		var oy = one.y;
		var tx = two.x;
		var ty = two.y;
		if(typeof one.x == "function"){
			ox = one.x();
			oy = one.y();
		}

		//Two is a circle
		if(twoIscircle){
			var rad = two.radius
			if(two == r){
				rad =  r.width/2 + 21
				tx = r.x + r.width/2
				ty = r.y + r.height/2
			}
			if(one.y < ty && one.y+one.height > ty && one.x < tx+rad && one.x+one.width > tx-rad ||
				one.x < tx && one.x+one.width > tx && one.y+one.height > ty-rad && one.y < ty+rad){
				return true
			}
			if(Math.sqrt(Math.pow(one.x+one.width-tx,2)+Math.pow(one.y-ty,2)) < rad ||
				Math.sqrt(Math.pow(one.x-tx,2)+Math.pow(one.y-ty,2)) < rad ||
				Math.sqrt(Math.pow(one.x+one.width-tx,2)+Math.pow(one.y+one.height-ty,2)) < rad ||
				Math.sqrt(Math.pow(one.x-tx,2)+Math.pow(one.y+one.height-ty,2)) < rad
			){
				return true;
			}
			else{
				return false;
			}
		}
		//Two is a rectangle
		if((ox >= two.x &&
           ox <= two.x + two.width)||
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
	var shake = function(object){
		if(shakers.indexOf(object)>-1){
			shakers.splice(shakers.indexOf(object),1);
		}
		object.joinTime = undefined;
		shakers.push(object);

	};
	var circle = function(x, y, radius, color, lineWid, fill){
		ctx.beginPath()
		ctx.arc(x,y,radius,0,2*Math.PI)
		ctx.fillStyle =  fill ? color : 0
		fill && ctx.fill()
		ctx.lineWidth = lineWid;
		ctx.strokeStyle = color
		ctx.stroke()
	}
	var clicked = function(x, y){
		for (var i in boxes){
			if(x > boxes[i].x-boxes[i].margin && x < boxes[i].x+boxes[i].width()+boxes[i].margin && y > boxes[i].y-boxes[i].Asize && y < boxes[i].y+boxes[i].margin && boxes[i].visible){
				return boxes[i];
			}
		}
		return false;
	}
	var drawRect = function(obj, shake){
		ctx.fillStyle = obj.color || "#F00";
		if (!shake) shake = 0;
		if(typeof obj.x === "function"){
			ctx.fillRect(obj.x()+shake*(10*Math.random()-5), obj.y()+shake*(10*Math.random()-5), obj.width, obj.height);
		}
		else{
			ctx.fillRect(obj.x+shake*(10*Math.random()-5), obj.y+shake*(10*Math.random()-5), obj.width, obj.height);
		}
		
	}
	var spawnBoss = function(boss, x, y, wid, hei){
		bosses[bosses.length] = customBosses[boss];
		bosses[bosses.length-1].parts[0].x = x;
		bosses[bosses.length-1].parts[0].y = y;
		if(boss === "spaceship"){
			b.width = 100;
			b.height = 100;
			bosses[bosses.length-1].color = "#0000FF"
			add(b.x, b.y+b.height, 25, 50);   // bottom
			add(b.x+b.width-25, b.y+b.height, 25, 50);
			add(b.x+b.width, b.y+b.height-25, 50, 25);  //right side
			add(b.x+b.width, b.y, 50, 25);
			add(b.x, b.y-50, 25, 50);   //top
			add(b.x+b.width-25, b.y-50, 25, 50);
			add(b.x-50, b.y, 50, 25); // left side
			add(b.x-50, b.y+b.height-25, 50, 25);
			bosses[bosses.length-1].health = 1000
		}
	}
	var explode = function(o, whoToHurt, radius, dmg){//whoToHurt == array
		//o is the object you want to explode
		explosions[explosions.length] = new PowerUp("#FA5", "thing", radius, o.x, o.y);
		for(var t = 0; t<whoToHurt.length; t++){
			if(checkCollision(whoToHurt[t], explosions[explosions.length-1], true)){
				whoToHurt[t].health -= dmg;
				shake(whoToHurt[t]);
				if(whoToHurt[t].health <= 0){
					whoToHurt.splice(t, 1);
					t--;
				}
			}
		}
		sound.play(sound.boom);		
	};
	
	windowResize = windowResize1 = function(){
		/*ctx.scale(config.scalePixels / config.scaleSide, config.scalePixels / config.scaleSide);
		if(window.innerWidth-30 > window.innerHeight-30){
			if((window.innerWidth-30)/2 < window.innerHeight-30){
				config.scaleSide = (window.innerWidth-30); config.scalePixels = 1890;
			}
			else {
				config.scaleSide = (window.innerHeight-30); config.scalePixels = 950;
			}
		}
		else {
			config.scaleSide = (window.innerWidth-30); config.scalePixels = 1890;
		}
		ctx.scale(config.scaleSide / config.scalePixels, config.scaleSide / config.scalePixels);
		 
			require(["state"], function(state){
				state.draw(state.last[state.last.length-1], true);
			})
			//state.draw(state.last[state.last.length-1], true);*/
	}
	return {
		checkCollision : checkCollision,
		clicked : clicked,
		windowResize : windowResize,
		explode : explode,
		spawnBoss : spawnBoss,
		drawRect : drawRect,
		circle : circle,
		shake : shake,
		loseGame: loseGame,
		resumeGame: resumeGame,
		pauseGame: pauseGame
	}
});