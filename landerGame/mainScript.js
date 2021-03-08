define(["list", "preData", "geometry", "lander", "functions"], function(list, preData, geo, lander, functions){
	console.log("loading main.js");
	//Unpack
	const Point = geo.Point;
	const {turrets, c, ctx, meteors, shots, obstacles, loops} = preData;
	const collision1D = functions.collision1D; 

	const ground = {
		x : 0,
		y : c.height-100,
		width : 1500,
		height : 100,
		g : 500,
		friction: 500,
		minGlideSpeed: 0.1
	}
	
	const mouse = {
		x : 0,
		y : 0,
		mouseDown: () => {}
	};

	const View = {
		x: 0,
		y: 0,
		paddingHorizontal: 550,
		paddingVertical: 320,
		zoom: 0.6,
		zoomTarget: 0.7,
		getGamePoint(gamePoint){
			var screenX = (gamePoint.x - c.width*(1-View.zoom)/2)/View.zoom + View.x;
			var screenY = (gamePoint.y - c.height*(1-View.zoom)/2)/View.zoom + View.y;
			return new geo.Point(screenX, screenY);
		},
		getScreenPoint(screenPoint){
			var gameX = (screenPoint.x - View.x) * View.zoom + c.width*(1-View.zoom)/2;
			var gameY = (screenPoint.y - View.y) * View.zoom + c.height*(1-View.zoom)/2;
			return new geo.Point(gameX, gameY);
		}
	};

	var adaptRotation = function(x, y, angle, drawings){
		ctx.translate(x, y);	//changing frame of reference
		ctx.rotate(angle - Math.PI/2);
		ctx.translate(-x, -y);
		drawings();				//Drawing whatever
		ctx.translate(x, y);
		ctx.rotate(-angle + Math.PI/2);	//And changing frame of reference back to normal screen
		ctx.translate(-x, -y);
	}

	const circle = function(x, y, radius, color, lineWid, fill){
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fillStyle =  fill ? color : 0;
		fill && ctx.fill();
		ctx.lineWidth = lineWid;
		ctx.strokeStyle = color;
		ctx.stroke();
	};
	
	const draw = function(){
		ctx.fillStyle = "#FFFFFF"; 
		ctx.fillRect(0, 0, c.width, c.height);
		
		ctx.translate(-c.width*(View.zoom-1)/2, -c.height*(View.zoom-1)/2);
		ctx.scale(View.zoom, View.zoom);
		ctx.translate(-View.x, -View.y);
		
		for(var i in obstacles){ // Drawing ground and stuff
			ctx.fillStyle = "#555";
			if(obstacles[i].id === "platform"){
				ctx.fillStyle = "#D22";	
			}
			ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
			ctx.fillStyle = "#0F0";
		}
		ctx.fillRect(lander.topMid().x, lander.topMid().y, 1, 1)
		adaptRotation(lander.x+lander.width/2, lander.y+lander.height/2, lander.rot, function(){
			
			ctx.fillStyle = "#AAA"
			ctx.fillRect(lander.x,lander.y,lander.width,lander.height); //Draw body of lander
			ctx.fillStyle = "#222"
			for(var i in lander.xparts){
				ctx.fillRect(lander.xparts[i].x(), lander.xparts[i].y(), lander.xparts[i].width, lander.xparts[i].height);
			}
			if(lander.force > 0){
				ctx.beginPath(); // This is a triangle under the lander
				ctx.moveTo(lander.x+lander.width/2, lander.y+lander.height+10);//Top point
				ctx.lineTo(lander.x, lander.y+lander.height+30);//Right point
				ctx.lineTo(lander.x+lander.width, lander.y+lander.height+30);//Left Point
				ctx.lineTo(lander.x+lander.width/2, lander.y+lander.height+10);//Back to top point
				ctx.fillStyle = "#F00";
				ctx.fill();
				ctx.fillStyle = "#555";
			}
			
		});
		adaptRotation(lander.topMid().x, lander.topMid().y, lander.cannon.rotation, function(){ //cannon
			ctx.fillRect(lander.cannon.x(), lander.cannon.y(), lander.cannon.width, lander.cannon.height);
		});
		
		for(var i in turrets){

			adaptRotation(turrets[i].x + turrets[i].width/2, turrets[i].y, turrets[i].rotation, function(){
				ctx.fillRect(turrets[i].x, turrets[i].y, turrets[i].width, turrets[i].height);
			})
		}
		for(var i in shots){
			circle(shots[i].x, shots[i].y, shots[i].radius, "#FF0000", 0, true);
		}
		for(var i in meteors){
			circle(meteors[i].x, meteors[i].y, meteors[i].radius, "#FF0000", 0, true);
		}
		ctx.fillStyle = "#FF0";
		ctx.font = "300px Arial";
		ctx.fillText(list.message, 200, 200);
		
		
		ctx.translate(View.x, View.y);
		ctx.scale(1/View.zoom, 1/View.zoom);
		ctx.translate(c.width*(View.zoom-1)/2, c.height*(View.zoom-1)/2);
		
		
	}

	const calculate = function(timestamp, reset){
		//reset is for pausing

		list.lastTime = reset ? timestamp : list.lastTime;
		list.progress =  timestamp - list.lastTime;
        if(list.progress > 1000/list.fps){

            list.dt = list.progress/1000;
            list.lastTime = timestamp;

			// VV ONE FRAME HAPPENS BELOW VV

			View.zoom += (View.zoomTarget - View.zoom)*list.dt;

			lander.rot += lander.rotSpeed //* list.dt
			lander.rot = lander.rot //% (Math.PI*2);
			lander.ySpeed += (-lander.force * Math.sin(lander.rot) + ground.g) * list.dt;
			lander.xSpeed += -lander.force * Math.cos(lander.rot) * list.dt;


			var dX = lander.xSpeed * list.dt;
			var dY = lander.ySpeed * list.dt;
			
			// Check if player is collided with any solid
			for(var obs of obstacles){
				var xCollision = collision1D(lander.x+dX, lander.x+lander.width+dX, obs.x, obs.x+obs.width);
				var yCollision = collision1D(lander.y+dY, lander.y+lander.height+dY, obs.y, obs.y+obs.height);
				
				if(xCollision && yCollision){

					//Decide which velocity component to cancel
					var xCollisionBefore = collision1D(lander.x, lander.x+lander.width, obs.x, obs.x+obs.width);
					var yCollisionBefore = collision1D(lander.y, lander.y+lander.height, obs.y, obs.y+obs.height);
					
					var justCollidedY = xCollisionBefore && yCollision;
					var justCollidedX = xCollision && yCollisionBefore;
		
					dX = dX * !justCollidedX;
					dY = dY * !justCollidedY;
					
					//Cancel components upon collision
					lander.ySpeed *= !justCollidedY;
					lander.xSpeed *= !justCollidedX;

					if(justCollidedY){
						lander.xSpeed -= ground.friction * list.dt * Math.sign(lander.xSpeed);
						if(Math.abs(lander.xSpeed) < ground.minGlideSpeed){
							lander.xSpeed = 0;
						}
						
					}
				}
				
			}
			//Move player
			lander.x += dX;
			lander.y += dY;

			var landerScreenPos = View.getScreenPoint(lander.mid());

			if(landerScreenPos.x > c.width - View.paddingHorizontal){
				View.x += (landerScreenPos.x - (c.width - View.paddingHorizontal))/View.zoom;
			}
			else if(landerScreenPos.x < View.paddingHorizontal){
				View.x += (landerScreenPos.x - View.paddingHorizontal)/View.zoom;
			}
			if(landerScreenPos.y > c.height - View.paddingVertical){
				View.y += (landerScreenPos.y - (c.height - View.paddingVertical))/View.zoom;
			}
			else if(landerScreenPos.y < View.paddingVertical){
				View.y += (landerScreenPos.y - View.paddingVertical)/View.zoom;
			}

			var topMid = lander.topMid();
			var mouseGamePos = View.getGamePoint(mouse);
			var newAngle = Math.atan2(mouseGamePos.y - topMid.y, mouseGamePos.x - topMid.x);			
			lander.cannon.rotation = newAngle;
			
			for(var turret of turrets){

				turret.predictAim(lander);
				var diff = (turret.targetRotation - turret.rotation);

				turret.rotation += Math.sin(diff)/20;
				
				if(turret.coolDown < 0){
					meteors.push(turret.fire());
					turret.coolDown = 100;
				}
				turret.coolDown -= 100 * list.dt;
				
			}
			for(var  i in shots){
				shots[i].x += shots[i].xSpeed * list.dt;
				shots[i].y += shots[i].ySpeed * list.dt;
			}
			for(var i in meteors){ 
				meteors[i].x += meteors[i].xSpeed * list.dt;
				meteors[i].y += meteors[i].ySpeed * list.dt;
			}
			/*for(var i in obstacles){
				if(lander.x < obstacles[i].x+obstacles[i].width&&lander.x+lander.width>obstacles[i].x &&
					lander.y+lander.height>obstacles[i].y&&lander.y<obstacles[i].y+obstacles[i].height){
					//Lander is below stuff like ground, platforms etc
					lander.y = obstacles[i].y-lander.height;
					lander.ySpeed = 0;
					lander.xSpeed = lander.xSpeed/ground.friction;
					if(lander.ySpeed > 0.6){
					}
					if(obstacles[i].id === "platform"){
						list.message = "WIN";
					}
				}
			}*/

			//list.message = Math.sin(lander.rot * Math.PI/180)
			draw();
			
			
			//VV Ending one frame VV
		}
		loops.IDs.calculate = window.requestAnimationFrame(calculate);
		//VV Ending calculate VV
	}
	loops.starters.calculate = calculate;

	var pauseGame = function(){
		window.cancelAnimationFrame(loops.IDs.calculate);
	}
	var resumeGame = function(){
		window.requestAnimationFrame((timestamp) => {
			calculate(timestamp, true);
		});
	}
	return {
		lander : lander,
		c : c,
		mouse : mouse,
		ground : ground,
		resumeGame: resumeGame,
		pauseGame: pauseGame,
		View: View
	}
	
});