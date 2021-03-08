require(["preData", "boxes", "config", "spawnEnemy", "constructors", "script", "state", "sound", "functions", "customBoss", "customBosses", "spawnPowerUp"], 
	function(preData, boxes, config, spawnEnemy, constructors, script, state, sound, functions, customBoss, customBosses, spawnPowerUp
){	
	var {loops, friends, powerUps, ctx , c , r, keys, bosses, player2, enemies, loops} = preData;
	var {explode, spawnBoss} = functions; 
	var {PowerUp, Laser} = constructors;
	
	var lastMode;
	window.addEventListener("keydown", function(event){
		event = window.event;
		if(!(event.keyCode !==  keys.lastPressed&&event.keyCode!==keys.mPressed)){
			return;
		}
		var right = 68;
		var left = 65;
		var up = 87;
		var down = 83;

		//Switch statement would be much better
		if(event.keyCode === 38){
			r.ySpeed = -5; 
			keys.map[38] = true}
        else if(event.keyCode=== 39){
        	r.xSpeed=5; 
        	keys.map[39] = true
        }
        else if(event.keyCode === 37){
        	r.xSpeed=-5;
        	keys.map[37] = true
        }
        else if(event.keyCode === 40){
        	r.ySpeed = 5; 
        	keys.map[40] = true
        }
        else if(event.keyCode === 73){//I
			spawnEnemy({sak : "Yfast", x : "random"});

		}
		else if(event.keyCode===74){//J
			spawnEnemy({sak : "normal", x : "random"});
		}
		else if(event.keyCode===75){//K
			spawnEnemy({sak : "Xfast", x : "random"});  
			//spawnEnemy({sak : "follower", x : "random"});  
		}
		else if(event.keyCode===76){//L
			spawnEnemy({sak : "slasher", x : "random"});
		}
		else if(event.keyCode===79){//O
			spawnEnemy({sak : "tank", x : "random"});
		}
		else if(event.keyCode === 90 && config.gamemode == "free"){
			spawnPowerUp("speed");
		}
		else if(event.keyCode === 88 && config.gamemode == "free"){
		    spawnPowerUp("shield");
		}
		else if(event.keyCode === 67 && config.gamemode == "free"){
			spawnPowerUp("double");
		}
		else if(event.keyCode === 86 && config.gamemode == "free"){
			spawnPowerUp("blast");
			spawnPowerUp("nuke");
		}
		else if(event.keyCode == 66 && config.gamemode == "free"){ 
			spawnPowerUp("regen");
		}
		else if(event.keyCode === 78 && config.gamemode == "free"){ 
			spawnPowerUp("cash");
		}
		else if(event.keyCode === 50){
			explode(enemies[enemies.length-1], enemies);
		}
		else if(event.keyCode === 89){
			if(bosses.length == 0 && customBosses["a"]!== undefined) spawnBoss("a", 0 , 0, 100, 100);
		}
		else if(event.keyCode === 13 && config.gamemode == "customBoss"){
			customBoss.finalize();
		}
		//escape button
		else if(event.keyCode === 27){
			if( config.gamemode =="free" || config.gamemode =="endless"){ // This pauses
				
				lastMode = config.gamemode;
				config.gamemode = "paused";
				for(var i in loops.IDs){
					window.cancelAnimationFrame(loops.IDs[i]);
				}
				state.draw(state.paused);
			}
			else if(config.gamemode!=="menu"){ // This unpauses
				config.gamemode = lastMode;
				config.reset = true;
				state.last = [];
				console.log(lastMode)
				for(var i in boxes){
					boxes[i].visible = false;
				} 
				if(config.gamemode == "free"){
					window.requestAnimationFrame(loops.starters.calculate);

				}
				else if(config.gamemode == "endless"){
					window.requestAnimationFrame(loops.starters.calculate);
					window.requestAnimationFrame(loops.starters.tankLoop);
					window.requestAnimationFrame(loops.starters.fastsLoop);
					window.requestAnimationFrame(loops.starters.powLoop);
					window.requestAnimationFrame(loops.starters.smallLoop);
				}
			}
		}
		
		else if(keys.lastPressed !== 83 && keys.lastPressed!==68 && keys.lastPressed!==65 && keys.lastPressed!==87 && config.gamemode !== "menu"){
		if(event.keyCode === 83){
			if(keys.pressed == false){
				if(config.timers.doubleShot>0){
					friends.push(new Laser(r.x+r.width/2-2.5-6,r.y+r.height,12,0,4,9)); 
					friends.push(new Laser(r.x+r.width/2-2.5+6,r.y+r.height,12,0,4,9));
				}
				else{
					friends.push(new Laser(r.x+r.width/2-2.5,r.y+r.height,12,0,4,9));
				}
				sound.play(sound.pew);
			}
			keys.pressed = true;
		}
        else if(event.keyCode === 65){
			if(keys.pressed == false){
				if(config.timers.doubleShot>0){
					friends.push(new Laser(r.x-10, r.y+r.height/2-2.5+6,0,-12,9,4));
					friends.push(new Laser(r.x-10, r.y+r.height/2-2.5-6,0,-12,9,4));                                                                                    
				}
				else{
					friends.push(new Laser(r.x-10, r.y+r.height/2-2.5,0,-12,9,4));
				}
				sound.play(sound.pew);
			};
			keys.pressed = true;
			
		}
        else if(event.keyCode===87){
		
			if(keys.pressed==false){
				if(config.timers.doubleShot>0){
					friends.push(new Laser(r.x+r.width/2-2.5-6,r.y,-12,0,4,9));                                                                                   
					friends.push(new Laser(r.x+r.width/2-2.5+6,r.y,-12,0,4,9));
				}
				else{
					friends.push(new Laser(r.x+r.width/2-2.5,r.y,-12,0,4,9));
				}
				sound.play(sound.pew);
				
			}
			keys.pressed = true;
		}
        else if(event.keyCode===68){
			if(keys.pressed==false){
				if(config.timers.doubleShot>0){
					friends.push(new Laser(r.x+r.width,r.y+r.height/2-2.5-6,0,12,9,4));                                                                                   
					friends.push(new Laser(r.x+r.width,r.y+r.height/2-2.5+6,0,12,9,4));
				}
				else{
					friends.push(new Laser(r.x+r.width,r.y+r.height/2-2.5,0,12,9,4));
				}
				sound.play(sound.pew);
			}
			keys.pressed = true;
			
			}
			
			keys.lastPressed = event.keyCode;
			keys.lastReleased = undefined;
			return;
		}
		
		else{keys.lastReleased = undefined; return};
		keys.mPressed = event.keyCode;
		keys.mReleased = undefined;
		
    });

	window.addEventListener("keyup", function(event){
	    event = window.event;

		//37 = left   38 = up   39 = right    40 = down
		if(!(event.keyCode!==keys.lastReleased&&event.keyCode!==keys.mReleased)){
			return;
		}
		switch(event.keyCode){
			case 38:
				if(!keys.map[40]){r.ySpeed = 0;}  //up
				else{r.ySpeed = 5}
				keys.map[38] = false;
				break;
			case 39:
				if(!keys.map[37]){r.xSpeed=0}   //right
	        	else{r.xSpeed=-5}keys.map[39] = false;
	        	break;
	       	case 37:
	       		if(!keys.map[39]){r.xSpeed=0}  //left
	        	else{r.xSpeed=5}keys.map[37] = false;
	        	break;
	        case 40:
	        	if(!keys.map[38]){r.ySpeed = 0}  //down
	        	else {r.ySpeed =-5}keys.map[40] = false;
	        	break;
	        case 83:
	        case 65:
	        case 87:
	        case 68:
				if(event.keyCode == keys.lastPressed){
					keys.pressed= false;
					keys.lastReleased = event.keyCode;
					keys.lastPressed = undefined;
					
				}
				return;
				break;
			case 70:
				player2.xSpeed = 0;
				break;
			case 71:
				player2.xSpeed = 0;
				break;
			case 72:
				player2.xSpeed = 0;
				break;
			case 84:
				player2.xSpeed = 0;
				break;

		}

		keys.mPressed = undefined;
		keys.mReleased = event.keyCode;
		
	});
});