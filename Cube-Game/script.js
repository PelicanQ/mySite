define(["functions", "spawnEnemy", "constructors", "config", "preData", "sound", "bossConstructor", "boxes"], 
	function(fn, spawnEnemy, constructors, config, pD ,sound, Boss, boxes
){
	
	//Upack objects and functions into aliases
	var {ctx, c, keys, r, enemies, shakers, bosses, loops, explosions, player2, powerUps, friends, leaders, zones} = pD;
	var {Enemy, Laser, PowerUp, Zone} = constructors;
	var {explode, spawnBoss, checkCollision, clicked, drawRect, circle, loseGame} = fn;
	
	r.x = c.width/2-20;
	r.y = c.height/2-20;
    ctx.font = "50px t";

	//Big drawing function, runs while game runs
    var draw = function(timestamp){
		ctx.clearRect(0, 0, c.width, c.height);
	  	
	   	ctx.globalAlpha = 1;
	   	for(var i = 0; i < shakers.length; i++){//Shake all elements in shakers array
			if(shakers[i].joinTime === undefined){
				shakers[i].joinTime = timestamp;
				shakers[i].shake = 3;
			}
						
			if(timestamp - shakers[i].joinTime>300){//if element has stayed >300ms, remover from array
				shakers[i].joinTime = undefined;
				shakers[i].shake = 0;
				shakers.splice(i, 1);

				i--;
			}
				
		}

		for(var i in zones){
			circle(zones[i].x, zones[i].y, zones[i].radius, zones[i].color, 0, true);
		}
		
		for(var i in powerUps){
			circle(powerUps[i].x, powerUps[i].y, powerUps[i].radius, powerUps[i].color, 1, true);
			
			//Special styling for some powerUps
			if(powerUps[i].thing === "regen"){
				ctx.clearRect(powerUps[i].x - powerUps[i].radius + 4, powerUps[i].y - 4, powerUps[i].radius*2 - 8, 8);//white cross
				ctx.clearRect(powerUps[i].x - 4, powerUps[i].y - powerUps[i].radius + 4, 8, powerUps[i].radius*2 - 8);
			}
			else if(powerUps[i].thing === "nuke"){
				ctx.drawImage(document.getElementById("nukePic"), powerUps[i].x-30, powerUps[i].y-30, 60, 60);
			}
	    }
        
        for(var i in friends){
			ctx.fillStyle = friends[i].color;
			drawRect(friends[i], friends[i].shake);
			if(friends[i].id === "box" && r.shield){
				circle(r.x+r.width/2, r.y+r.height/2, r.width/2+16, "#FF0", 5, false);
			} 
		}

        for(var i in enemies){
            ctx.fillStyle = enemies[i].color
			drawRect(enemies[i], enemies[i].shake);
			ctx.fillStyle = "#0F0";
			if(enemies[i].id === "slasher" && enemies[i].busy && enemies[i].coolDown > 0){//If
				ctx.strokeStyle = enemies[i].color;
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(enemies[i].midX(),enemies[i].midY());
				ctx.lineTo(enemies[i].midX() + (1-enemies[i].coolDown/200)*(enemies[i].targetX-enemies[i].midX() ),
				enemies[i].midY() + (1-enemies[i].coolDown/200)*(enemies[i].targetY - enemies[i].midY() ));
				ctx.stroke();
				
			}	

			if(config.bars){
				var maxHealth;
				if(enemies[i].id === "tank"){
					maxHealth = 800;
				}
				else if(enemies[i].id === "normal"){
					maxHealth = 150;
				}
				else if(enemies[i].id.substring(1, 5) === "fast"){
					maxHealth = 100;
				}
				ctx.fillRect(enemies[i].x+(enemies[i].width-40)/2, enemies[i].y - 15, 40*(enemies[i].health/maxHealth), 7);
				ctx.fillStyle = "#F00";
				ctx.fillRect(enemies[i].x+(enemies[i].width-40)/2  +40*(enemies[i].health/maxHealth), enemies[i].y - 15, 40*(1 - enemies[i].health/maxHealth), 7);
			}
		}

		for(var i in bosses){
			ctx.fillStyle = bosses[i].color;
			for(var e in bosses[i].parts){
				drawRect(bosses[i].parts[e]);
			}
		}
		for(var i in explosions){
			circle(explosions[i].x, explosions[i].y, explosions[i].radius, explosions[i].color, 0, true);
		}

		ctx.fillStyle = "rgba(" + Math.floor(config.red/100*255) + ", " + Math.floor(config.green/100*255) + ",0,1)";
		config.healthval > 0 && config.drawMeter && ctx.fillRect(20, c.height-90, config.healthval, 20);
		ctx.lineWidth = 0.3;
		ctx.beginPath();
		ctx.moveTo(20, c.height-90);
		ctx.lineTo(120, c.height-90);
		ctx.lineTo(120, c.height-70);
		ctx.lineTo(20, c.height-70);
		ctx.lineTo(20, c.height-90);
		ctx.strokeStyle = "#000";
		ctx.stroke();
		ctx.fillStyle="rgba(255, 0, 0, " + config.opacity + ")";
		ctx.font = "50px t";
		ctx.fillText(config.message, c.width/2-ctx.measureText(config.message).width/2, c.height/1.1);
		
		ctx.fillStyle = "blue";
		ctx.font = (50+50-50*Math.pow(1.1,-(config.points-config.pointsCounter))).toString() + "px t";
		ctx.fillText(Math.round(config.pointsCounter.toString()),20,c.height-20);
		
		
	}

	//Big calculate function, handles, collision, motion, basiaclly everything besides drawing
    var calculate = function(timestamp){
		config.lastTime = config.reset ? timestamp : config.lastTime;
		config.reset = false;
		config.progress =  timestamp - config.lastTime; //progress is the time between last timestamp and current
        if(config.progress > 1000/config.fps){// 1000/fps gives milliseconds/frame
            config.dt = config.progress/15;
            config.lastTime = timestamp;
            
            //MOVE AND CHECK COLLISION and stuff
           
			for(var e in enemies){
				if(enemies[e].id !== "laser" && enemies[e].id !== "explosive" && enemies[e].id !== "slasher" && enemies[e].id !== "follower"
				){//move at player

					var angle = Math.atan2(r.midY() - enemies[e].midY(), r.midX() - enemies[e].midX());

					enemies[e].xSpeed = Math.cos(angle);
					enemies[e].ySpeed = Math.sin(angle);
				}	
				else if(enemies[e].id == "slasher"){

					//Slasher behavior. At random intervals: STOP - WAIT - CHARGE PLAYER - repeat
					if (!enemies[e].busy){//It aint busy
						
						var angle = Math.atan2(r.midY() - enemies[e].midY(), r.midX() - enemies[e].midX());

						enemies[e].xSpeed = Math.cos(angle);
						enemies[e].ySpeed = Math.sin(angle);
						
						enemies[e].coolDown -= 1
						if(enemies[e].coolDown <= 0){
							
							//First time it stops for coolDown. Runs here once
							enemies[e].busy = true;
							enemies[e].xRatio = 0;  //STOP
							enemies[e].yRatio = 0;
							
							enemies[e].targetX = r.midX() + 1.2*(r.midX() - (enemies[e].midX()));
							enemies[e].targetY = r.midY() + 1.2*(r.midY() - (enemies[e].midY()));
							if(enemies[e].targetX > c.width){
								enemies[e].targetY -=    (r.midY() - enemies[e].midY() )  / (r.midX() - enemies[e].midX() ) * (enemies[e].targetX-c.width);
								enemies[e].targetX = c.width;
								
							}
							else if(enemies[e].targetX < 0){
								enemies[e].targetY -=  (r.midY() - enemies[e].midY() )  / (r.midX() - enemies[e].midX() ) * (enemies[e].targetX);
								enemies[e].targetX = 0;

							}
							if(enemies[e].targetY > c.height){
								enemies[e].targetX -=    (r.midX() - enemies[e].midX())  / (r.midY() - enemies[e].midY() ) * (enemies[e].targetY-c.height);
								enemies[e].targetY = c.height;
							}
							else if(enemies[e].targetY < 0){
								enemies[e].targetX -=    (r.midX() - enemies[e].midX())  / (r.midY() - enemies[e].midY() ) * enemies[e].targetY;
								enemies[e].targetY = 0;
							}
							enemies[e].coolDown = 150;
							enemies[e].lastDist = Math.sqrt(Math.pow((enemies[e].midX() - enemies[e].targetX),2)+Math.pow((enemies[e].midY() - enemies[e].targetY),2));
							sound.play(sound.homing);
						}
					}
					else {//Slasher is busy - It is either charging or whaiting to charge player
						enemies[e].coolDown -= 5;
						if(enemies[e].coolDown <= 0){	
							//Second time when coolDown < 0 it launches. This runs once;
							
							//CHARGE PLAYER
							var currentDist = Math.sqrt(Math.pow((enemies[e].midX() - enemies[e].targetX),2)+Math.pow((enemies[e].midY() - enemies[e].targetY),2));
							//enemies[e].xRatio = 20*(1-Math.pow(1.001,-currentDist)); enemies[e].yRatio = 20*(1-Math.pow(1.001,-currentDist));
							enemies[e].xRatio = 25;
							enemies[e].yRatio = 25;
							if( currentDist > enemies[e].lastDist){
								enemies[e].busy = false;
								enemies[e].coolDown = 300+Math.random()*200;
								enemies[e].xRatio = 1;
								enemies[e].yRatio = 1;
							}
							enemies[e].lastDist = Math.sqrt(Math.pow((enemies[e].midX() - enemies[e].targetX),2)+Math.pow((enemies[e].midY() - enemies[e].targetY),2));
						}
					}
				}
				else if(enemies[e].id == "follower"){
					
					var dist = Math.sqrt(Math.pow((enemies[e].midX() - leaders[0].midX()),2)+Math.pow((enemies[e].midY() - leaders[0].midY()),2));
					if(dist < 400){
		
						var angle = Math.atan2(enemies[e].midY() - leaders[0].midY(), enemies[e].midX() - leaders[0].midX())
						enemies[e].xSpeed  = (dist/10-10) * Math.cos(angle);
						enemies[e].ySpeed = (dist/10-10) * Math.sin(angle);
						enemies[e].xSpeed -= 0.1 * (enemies[e].midY() - leaders[0].midY())/dist;
						enemies[e].ySpeed += 0.1 * (enemies[e].midX() - leaders[0].midX())/dist;
						console.log(enemies[e].xSpeed)
					}
					else {
						enemies[e].xSpeed = 1; 
						enemies[e].ySpeed = 1;
					}
				}
				enemies[e].y += enemies[e].ySpeed*config.dt*enemies[e].yRatio ;
				enemies[e].x += enemies[e].xSpeed*config.dt*enemies[e].xRatio ;


			}
			
			//Move bosses
			for(var i in bosses){
				var angle = Math.atan2(r.y - bosses[i].y, r.x - bosses[i].x);
				bosses[i].xSpeed = Math.cos(angle);
				bosses[i].ySpeed = Math.sin(angle)

				bosses[i].parts[0].x += bosses[i].xSpeed * config.dt * bosses[i].xRatio;
				bosses[i].parts[0].y += bosses[i].ySpeed * config.dt * bosses[i].yRatio;
				
				for(var e = 1; e < bosses[i].parts.length; e++){
					//bosses[i].parts[e].x += bosses[i].xSpeed*config.dt*bosses[i].xRatio;
					//bosses[i].parts[e].y += bosses[i].ySpeed*config.dt*bosses[i].yRatio;
				}
			}
			for(var i in friends){
				friends[i].y += friends[i].ySpeed*config.dt*(friends[i].yRatio || 1);
                friends[i].x += friends[i].xSpeed*config.dt*(friends[i].xRatio || 1);
			}
			var hypot = Math.sqrt(Math.pow((config.mouse.x-r.width/2-r.x), 2)+Math.pow((config.mouse.y-r.height/2-r.y), 2))
			r.xSpeed = 5 * (1-Math.pow(1.01, -hypot)) * (config.mouse.x-r.width/2-r.x)     /  hypot;
			r.ySpeed = 5 * (1-Math.pow(1.01, -hypot)) * (config.mouse.y-r.height/2-r.y)   /   hypot;
			
			//If Player is outside it corrects
			if(r.x < 0){
				r.x = 0;
			} else if(r.x+r.width>c.width){
				r.x=c.width-r.width;
			}
            if(r.y+r.height > c.height){
            	r.y = c.height-r.height;
            }else if(r.y<0){
				r.y = 0;
			}


			for(var i in bosses){
				b:
				for(var e in bosses[i].parts){
					if(bosses[i].parts[e].id!=="laser" && bosses[i].parts[e].id !== "missile")
						continue b;
					if(bosses[i].parts[e].coolDown > 0){
						bosses[i].parts[e].coolDown -= config.dt * 5;
					}
					else {//fire
						bosses[i].requestFire(bosses[i].parts[e]);
						bosses[i].parts[e].coolDown = 100;
					}
				}
			}

			for (var i in pD.nukeTimers){
				pD.nukeTimers[i] -= 0.1;
				if(pD.nukeTimers[i]<0){
					explode({x : 900, y : 500}, enemies, 1500, 4000);
					pD.nukeTimers.splice(i,1);
					i--;
				}
			}

			//NOW THAT EVERTHING IS MOVED, WE DRAW
			draw(timestamp); 


			//Here comes a big collision checker that first targets a friendly laser and compares its position to all enemies. Repeat
			laser : 
            for(var i = 0; i < friends.length ; i++){
				//V This checks if lasers are outside the canvas element V
				if(friends[i].id!=="box" && !checkCollision(friends[i], {x: 0, y: 0, width: c.width, height: c.height})){
					friends.splice(i,1);
					i--;
					continue laser;
				}
				enem : 
                for(var e = 0; e < enemies.length; e++){
                	//V This checks if enemy lasers are outside the canvas element V
                	if(enemies[e].id == "laser" && !checkCollision(enemies[e], {x: 0, y: 0, width: c.width, height: c.height})){
                		enemies.splice(e,1);
                		e--;
                		continue enem;
                	}
					if(!checkCollision(enemies[e], friends[i], friends[i].shield)){
						continue;
					}
					//Enemy has hit firendly
					if(friends[i].id === "box"){//if enemy hit player
						if(r.shield){
							r.shield = false; 
							sound.play(sound.shieldDown)}
						else {
							r.health -= enemies[e].damage;
							fn.shake(r);
							sound.play(sound.shieldDown);
						}
						if(r.health <= 0){
							return loseGame();	
						} 
						
						enemies.splice(e,1);
						e--;
						continue enem;
					}
					enemies[e].health -= 100;
						if(enemies[e].health <= 0){
						config.points += enemies[e].points;
						enemies.splice(e,1);
					}
					friends.splice(i,1);
					i--;
					continue laser;
                }

				for(var e = 0; e < bosses.length; e++){
					parts :
					for(var o = 0; o < bosses[e].parts.length; o++){
						if(!checkCollision(bosses[e].parts[o], friends[i], friends[i].shield)){
							continue;
						}
						if(friends[i].id === "box"){ // collision between player and a boss-part
							if(r.shield){
								r.shield = false;
								sound.play(sound.shieldDown);
							}
							else {
								r.health -= bosses[e].damage;
							}
							if(r.health <= 0){
								return loseGame();	
							} 
							if(bosses[e].parts[o].id !== "core"){ //if the part is core it won't vanish
								bosses[e].parts.splice(o, 1);
								o--
								console.log("Deleted")
								console.log(bosses[e].parts);
							}
							continue parts;
						}
						bosses[e].health -= 100;
						if(bosses[e].health < 0){
							bosses.splice(e, 1);
						}
						friends.splice(i, 1);
						i--;
						continue laser;
						
					}
				}
			}//end of firendly loop

			//Now looping trough exploshells.
			for(var i = 0; i < enemies.length; i++){
				if(enemies[i].id === "explosive"){
					//explosive shells have a destination which is where r (player) was located when it was fired.
					//If the current distance to destination is larger than the last frame's distance then it explodes
					enemies[i].currentDistance = Math.sqrt(Math.pow(Math.abs(enemies[i].x-enemies[i].destination.x), 2)
					 + Math.pow(Math.abs(enemies[i].y-enemies[i].destination.y), 2));//Pythagoras
					if(enemies[i].currentDistance > enemies[i].lastDistance){
						
						explode(enemies[i], friends, 90);
						enemies.splice(i, 1);
						i--;
						continue;
					}
					enemies[i].lastDistance = enemies[i].currentDistance;
				}
			}

			//powerUps
			for(var i = 0; i < powerUps.length; i++){
				if(!checkCollision(r, powerUps[i], true)){
					continue;
				}
				switch(powerUps[i].thing){
					case "speed":
						config.timers.speed = 1400;
						r.speedUp = true;
						if(r.xRatio < 5){
							r.xRatio += 1;
							r.yRatio += 1;
						}
						sound.play(sound.speedUp);
						break;
					case "shield":
						r.shield = true;
						sound.play(sound.shieldUp);
						break;
					case "double":
						config.timers.doubleShot = 1400;
						sound.play(sound.reload);
						break;
					case "blast":
						explode(powerUps[i], enemies, 400, 400);
						sound.play(sound.boom);
						break;
					case "nuke":
						pD.nukeTimers[pD.nukeTimers.length] = 13;
						sound.play(sound.nuke);
						break;
					case "cash":
						config.points += 2000;
						break;
					case "regen":
						zones.push(new Zone(powerUps[i].x, powerUps[i].y, 250, "rgba(255, 100, 150, 0.5)", "regen", 1000));
						break;
				}
				powerUps.splice(i, 1);
				i--;
				
			}

			//Timers
			for(var i in config.timers){
				config.timers[i] -= 1*config.dt;
				if(config.timers[i] > 0)
					continue;

				if(i === "speed" && r.speedUp){
					r.xRatio = 0.9;
					r.yRatio = 0.9;
					r.speedUp = false;
					sound.play(sound.speedDown);
				}
				else if(i === "message"){
					
				}
				
			}

			//Zones: 
			for(var i = 0; i < zones.length; i++){  //Tick the timer, when 
				zones[i].timer -=1 * config.dt;
				if(zones[i].timer <= 0){
					zones.splice(i,1);  //times up- zone disappears
					i--;
					continue; 
				}
				if(!checkCollision(r, zones[i], true)){
					continue;
				}
				if(zones[i].thing === "regen" && r.health < 100){
					r.health += 0.14 * config.dt;
					
					//Make health meter blink
					config.timers.health && setTimeout(function(){
						
						config.drawMeter = false;
						setTimeout(function(){
							config.drawMeter = true;
							config.timers.health = true;
							
						}, 150 * config.dt);
						
					}, 150 * config.dt);
					config.timers.health = false;
				}
			}

            //Explosions
			for(var i = 0; i < explosions.length; i++){
				//Shrinking Explosions
				explosions[i].radius -= 12 * config.dt;
				if(explosions[i].radius <= 0){
					explosions.splice(i, 1);
					i--;
				}
			}
			

			//Make meters like healthbar and points gradually transition to target value
			config.red = config.healthval <= 50 ? 100 : (100 - config.healthval)*2;
			config.green = config.healthval >= 50 ? 100 : config.healthval*2;
			config.healthval -= ((config.healthval - r.health)/7) * (config.dt/5);
			
			config.healthval = config.healthval-r.health < 0.2 ? r.health : config.healthval;

			config.pointsCounter -= ((config.pointsCounter - config.points)/17) * (config.dt/1.3);
			
			if(Math.abs(config.pointsCounter-config.points) < 0.7){
				config.pointsCounter = config.points;//when they're close, just jump
			}
		}
		loops.IDs.calculate =  window.requestAnimationFrame(calculate);
	}
	var loseGame = function(){
		config.gamemode = "paused";
		for(var i in loops.IDs){
			window.cancelAnimationFrame(loops.IDs[i]);
		}
		window.cancelAnimationFrame(loops.IDs.calculate);
		ctx.font = "80px t";
		ctx.fillText("GAME OVER", c.width/2 - ctx.measureText("GAME OVER").width/2, c.height/2);
		ctx.font = "40px t";
		ctx.fillText("Reload to retry", c.width/2 - ctx.measureText("Reload to retry").width/2, c.height/2+100)
	}
	//The only properties to load. No globals needed!!! 'cept one
	return {
		enemies : enemies,
		ctx : ctx,
		c : c,
		keys : keys,
		spawnEnemy : spawnEnemy,
		boxes : boxes,
		friends : friends,
		clicked : clicked,
		config : config,
		Enemy:Enemy,
		Laser:Laser,
		PowerUp : PowerUp,
		powerUps : powerUps,
		r : r,
		calculate : calculate,
		draw : draw,
		sound : sound,
		Boss : Boss,
		bosses : bosses,
		spawnBoss : spawnBoss,
		player2 : player2,
		loops : loops,
		explode : explode,
		shakers : shakers
	}
});