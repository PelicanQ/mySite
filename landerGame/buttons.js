require(["mainScript", "list"], function(main, list){
	console.log("in buttons");
	const {lander, c, mouse} = main;
	window.addEventListener("keydown", function(event){
		event = window.event;
		if(event.keyCode !== list.lastPressed){
			if(event.keyCode == 32){//spacebar
				lander.force = 1000;
			}
			else if(event.keyCode == 65){//a

				lander.rotSpeed = -0.05;
				
			}
			else if(event.keyCode == 68){ //d
				lander.rotSpeed = 0.05;
			}
			list.lastPressed = event.keyCode;
			list.lastReleased = null;
		}
	});
	
	window.addEventListener("keyup", function(event){
		event = window.event;
		if(event.keyCode !== list.lastReleased){
			if(event.keyCode == 32){//spacebar
				lander.force = 0;
			}
			else if(event.keyCode == 65){//a
				lander.rotSpeed = 0
			}
			else if(event.keyCode == 68){//d
				lander.rotSpeed = 0
			}
			list.lastReleased = event.keyCode;
			list.lastPressed = null;
		}
	})
	c.addEventListener("mousedown", function(event){
		var x = event.clientX - c.offsetLeft;
		var y = event.clientY - c.offsetTop;
		console.log(x, y);
		main.mouse.mouseDown(x, y);

	});
	c.addEventListener("mousemove", function(event){

		mouse.x = event.clientX - c.offsetLeft;
		mouse.y = event.clientY - c.offsetTop;
	});
	window.addEventListener("blur", function(){
		main.pauseGame();
	})
	window.addEventListener("focus", function(){
		main.resumeGame();
	})
});
