require(["boxes", "config", "autoSpawn", "script", "preData", "state", "sound", "fade","customBoss"], 
	function(boxes, config, autoSpawn, script, preData, state, sound, fade, customBoss){
	var calculate = script.calculate;
	var loops = preData.loops, player2 = preData.player2, enemies = preData.enemies, friends = preData.friends,mouseActions = preData.mouseActions;
	//When a box is clicked, its onClick Method is called.
	
	//Freeplay
	boxes.s.onClick = function(){
		//fade(function(){
			state.draw();
			for(var i in boxes){
		    	boxes[i].visible = false;
	 	 	}
			loops.starters.calculate = calculate;
			loops.IDs.calculate = window.requestAnimationFrame(calculate);
			config.gamemode = "free";
			
		//}, 0.02)
		boxes.s.selected = false;
		boxes.s.visible = false;
		config.timers.message = 500;
	};

	//GabenMode
	boxes.gabenMode.onClick = function(){
		return;
		for(var i in boxes){
		    boxes[i].visible = false;
	    }
		boxes.gabenMode.selected = false
	};

	//Play Game
	boxes.play.onClick = function(){

		state.draw(state.modes);
		boxes.play.selected = false;
		boxes.play.visible = false;

	};

	//Endless
	boxes.modeTwo.onClick = function(){
		for(var i in boxes){
			boxes[i].visible = false;
		}
		boxes.modeTwo.selected = false;
		fade(function(){
			loops.IDs.calculate = window.requestAnimationFrame(calculate); 
			autoSpawn();
			config.gamemode = "endless";
		}, 0.02)
	};

	//Back
	boxes.back.onClick = function(){
	    state.draw(state.last[state.last.length-2],true);
	    state.last.splice(state.last.length-1,1);//removes from the [menu, settings, controls, advanced] 
	};

	//Settings
	boxes.settings.onClick = function(){
	   	state.draw(state.settings);
	};

	//Boss Creator
	boxes.customBoss.onClick = function(){	
		config.gamemode = "customBoss";
		state.draw(state.customBoss);
		customBoss.start();
	}; 

	//Music toggle
	boxes.music.onClick = function(){
		if(config.music){
	    	config.music = false;
	    	boxes.music.txt = "MUSIC : OFF";
	    }
	    else {
	    	config.music = true;
	    	boxes.music.txt = "MUSIC : ON";
	    }
	    state.draw(state.settings,true);
	};

	//SFX toggle
	boxes.sfx.onClick = function(){
		if(config.sfx){
	    	config.sfx = false;
	    	boxes.sfx.txt = "SFX : OFF";
	    }
	    else {
	    	config.sfx = true;
	    	boxes.sfx.txt = "SFX : ON";
	    }
		state.draw(state.settings,true);
	};

	//Health Bars
	boxes.bars.onClick = function(){
		if(config.bars){
			config.bars = false;
			boxes.bars.txt = "SHOW HEALTH : OFF";

		}
		else {
			config.bars = true;
			boxes.bars.txt = "SHOW HEALTH : ON";
		}
		state.draw(state.settings, true)
	};
	boxes.multi.onClick = function(){
		fade(function(){friends.push(player2);loops.calculoop = requestAnimationFrame(calculate);config.gamemode = "2players"},0.02);
	};

	//Quit to Main Menu
	boxes.quit.onClick = function(){
	    state.last = [];		
		loops.IDs = {};
		loops.starters = {};
		enemies.splice(0);
		preData.bosses.splice(0);
	    state.draw(state.menu);
	};

	//Save and Return
	boxes.saveBoss.onClick = function(){
		customBoss.finalize();
		state.draw(state.menu);
	};

	//Structual
	boxes.part_structural.onClick = function(){
		customBoss.selectedBlock = "structural";
	};

	boxes.part_laser.onClick = function(){
		customBoss.selectedBlock = "laser";
	};
	boxes.part_missile.onClick = function(){
		customBoss.selectedBlock = "missile";
	};
});