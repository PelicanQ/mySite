define(["game", "pong"], function(game, pong){
	var c = game.c, camera = game.camera;

	c.requestPointerLock = c.requestPointerLock || c.mozRequestPointerLock;
	document.exitPointerLock = document.exitPointerLock  ||  document.mozExitPointerLock;

	if("onpointerlockchange" in document) {
		document.addEventListener('pointerlockchange', lockChangeAlert, false);
	} 
	else if("onmozpointerlockchange" in document) {
	  document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
	}

	$("#clickOverlay")[0].addEventListener("click", ()=>{
		c.requestPointerLock();
	})
	c.addEventListener("wheel", (e) => {
		if(camera.mode === "pov"){
			var newFOV = camera.FOV + e.deltaY/1000;
			if(newFOV > camera.minFOV && newFOV < camera.maxFOV){
				camera.FOV = newFOV;
			}
			
		} 
		else if(camera.mode === "orbit"){
			var newOrbitRadius = camera.orbitRadius + e.deltaY;
			if(newOrbitRadius > camera.minOrbitRadius && newOrbitRadius < camera.maxOrbitRadius){
				camera.orbitRadius = newOrbitRadius;
			}
		}
		
	})
	function lockChangeAlert(e){
		if(document.pointerLockElement === c || document.mozPointerLockElement === c) {
			$("body").css("overflow-y", "hidden");
			console.log(2222)
	  		c.addEventListener("mousemove", mouseMove);
	  		c.addEventListener("mousemove", mouseMove);
			c.addEventListener("mousedown", mouseDown);
			c.addEventListener("mouseup", mouseUp);
	  		window.addEventListener("keydown", keyDown);
			window.addEventListener("keyup", keyUp);
	  		$("#clickOverlay").hide();
	  	}
	  	else {
	  		$("body").css("overflow-y", "auto");
	    	c.removeEventListener("mousemove", mouseMove);
	    	c.removeEventListener("mousemove", mouseMove);
	    	c.removeEventListener("mousedown", mouseDown);
	    	c.removeEventListener("mouseup", mouseUp);
	    	window.removeEventListener("keydown", keyDown);
	    	window.removeEventListener("keyup", keyUp);
	    	$("#clickOverlay").show();
	  	}
	}

	function mouseDown(){
		game.cursor.mouseDown();//trigger whatever event is bound to cursor
	}
	function mouseUp(e){
		game.cursor.mouseUp();
		
	}
	function mouseMove(e){
		game.rotateAll(e.movementX, e.movementY)
	}
	function keyDown(e){
		switch(e.keyCode){
			case 87:	
			case 83:
			case 68:
			case 65:
				if(game.pressedMoveKeys.indexOf(e.keyCode) == -1)
					game.pressedMoveKeys.push(e.keyCode);
				break;
			case 32:
				if(game.player.ySpeed === 0)
					game.player.ySpeed = -13;
				break;
			case 72:
				game.player.x =10; game.player.y = -100; game.player.z = 10;
				break;
			case 86:
				if(camera.mode === "pov"){
					camera.setMode("orbit");
				}
				else {
					camera.setMode("pov");
				}
				break;
			case 16:
				camera.free();
				break;
			case 38:
				pong.playerDir = -1;
				pong.upKeyPressed = 1;
				break;
			case 40:
				pong.playerDir = 1;
				pong.downKeyPressed = 1;
				break;
		}
		

	}
	function keyUp(e){
		switch(e.keyCode){
			case 87:	
			case 83:
			case 68:
			case 65:
				var index = game.pressedMoveKeys.indexOf(e.keyCode);
				game.pressedMoveKeys.splice(index, 1);
				break;	
			case 32:
				break;
			case 16:
				camera.constrain();
				break;
			case 38:
				pong.upKeyPressed = 0;
				if(pong.downKeyPressed)
					pong.playerDir = 1;
				else 
					pong.playerDir = 0;		
				break;
			case 40:
				pong.downKeyPressed = 0;
				if(pong.upKeyPressed)
					pong.playerDir = -1;
				else 
					pong.playerDir = 0;
				break;
		}
		

	}
});