//initialization
require.config({
	urlArgs : "bust"+Date.now().toString()
})
require(["game", "world", "input", "shapes"], function(game, world, input, shapes){
	//I save the player state, in localStorage between page reloads
	const player = game.player;
	game.c.width = window.innerWidth*0.6;
	game.c.height = game.c.width *9/16;
	
	window.addEventListener("beforeunload", function(event) {
		localStorage.setItem("player", JSON.stringify(player));
	});

	window.addEventListener("blur", (e)=>{
		game.running = false;
		
	});
	window.addEventListener("focus", (e)=>{
		game.running = true;	
	});
	window.addEventListener("resize", ()=>{
		game.c.width = window.innerWidth*0.60;
		game.c.height = game.c.width *9/16;//Duplicate code
	})
	$(document).ready(() => {

		var saved = JSON.parse(localStorage.getItem("player"));
		if(saved) {
			player.x = saved.x;
			player.y = saved.y;
			player.z = saved.z;
			//player.faceDir = saved.faceDir;
		}
		player.playerBox = new shapes.Cuboid(player.x, player.y, player.z, player.sx, player.sy, player.sz, "#E44");
		
		
		window.requestAnimationFrame(game.mainLoop);
	});
});
