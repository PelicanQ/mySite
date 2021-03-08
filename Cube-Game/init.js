require(["state", "functions", "preData", "mousedown", "config", "boxes", "sound",  "mousemove",
		 "bossConstructor", "fade", "spawnEnemy", "constructors", "boxDoers", "autoSpawn", "eventListeners",
		 "script", "customBoss", "customBosses"], 
	function(state, functions, preData, mousedown, config, boxes,sound, t, y, u, i, o, a, autoSpawn, eventListeners, script){						
		//This is the very first function called- Init= initialize
		
		window.requestAnimationFrame = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame
		preData.loops.starters.calculate = script.calculate;
		$(document).ready(() => {
			//$("#gameCanvasContainer").css("w")
			makeBackgroundAnimationCanvas($("#gameBackgroundCanvas")[0], $("#gameCanvasContainer")[0]);

			const ID = setInterval(()=>{
				if(document.fonts.check("70px t")){
					//Start game
					clearInterval(ID);
					state.draw(state.menu);
					sound.nitrofun.volume = 1;
					//sound.play(sound.nitrofun)

				}
			}, 100);
			preData.ctx.font = "80px t";
			
			
			
		});
})