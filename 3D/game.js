define(["shapes", "utility", "pong", "world", "geometryFunctions"], function(shapes, util, pong, world, geoFuncs){
	var timedEvents = world.timedEvents;
	var solids = world.solids, interactions = world.interactions,
		blocks = world.blocks, worldPath = world.worldPath,
		faces = world.faces, effectFaces = world.effectFaces,
		spinningTower = world.spinningTower

	const c = document.getElementById("gameCanvas");
	const ctx = c.getContext("2d");
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000";
	
	const player = {
		walkDir: 0, faceDir: 0,
		walkSpeed: 0,
		maxSpeed : 0.4,
		x : 0, y: -100, z: 0,
		sx: 100, sy: 200, sz: 100,
		xSpeed : 0, ySpeed: 0, zSpeed: 0,
		playerBox: {}
		
	};
	player.playerBox = new shapes.Cuboid(player.x, player.y, player.z, player.sx, player.sy, player.sz, "#E44");

	const camera = {
		mode: "pov", 
		locked: true,
		FOV: 3.1415/2,
		minFOV: 3.1415/8,
		maxFOV: 3.1415*3/4,
		xOffset : 0, 
		yOffset: 0, 
		zOffset: 0,
		xRot: 0, 
		yRot: 0, 
		zRot: 0,
		_xRotTarget: 0, 
		_yRotTarget: 0, 
		_zRotTarget:0,
		xOrbit: 0, 
		yOrbit: 0, 
		xOrbitTarget: 0.5, 
		yOrbitTarget: 0, 
		zOrbitTarget: 0, 
		orbitRadius: 400,
		minOrbitRadius: 30,
		maxOrbitRadius: 8000,
		get xRotTarget(){return camera._xRotTarget},
		get yRotTarget(){return camera._yRotTarget},
		get zRotTarget(){return camera._zRotTarget},
		set xRotTarget(x){camera._xRotTarget = x },
		set yRotTarget(y){camera._yRotTarget = y },
		set zRotTarget(z){camera._zRotTarget = z },
		
		get x(){ return player.x+camera.xOffset},
		get y(){ return player.y+camera.yOffset},
		get z(){ return player.z+camera.zOffset},
		set x(x){ camera.xOffset = x},
		set y(y){ camera.yOffset = y},
		set z(z){ camera.zOffset = z},
		lookAt: (p)=>{
			/*camera.xRotTarget = -camera.rxt
			camera.yRotTarget = -camera.ryt*/
			//camera.xRotTarget  =  -Math.atan((p.y-camera.y)/(p.z-camera.z))*180/Math.PI;
			
			//camera.yRotTarget  =  Math.atan((p.x-camera.x)/(p.z-camera.z))*180/Math.PI;
			
			//camera.yRotTarget =  Number.isNaN(camera.yRotTarget) ? 1 : camera.yRotTarget 
			//if(camera.yRotTarget<0) camera.yRotTarget+= 360;
			//if(p.z-camera.z<=0)camera.yRotTarget +=180;
			//console.log(camera.yRotTarget)
		},
		setMode(mode){
			camera.mode = mode;
			frameCount = 0;
			switch(mode){
				case "pov":
					camera.constrain();
					camera.xOffset = 0; camera.yOffset = 0; camera.zOffset = 0;
					camera.xRotTarget = -camera.xOrbitTarget;
					camera.yRotTarget = -camera.yOrbitTarget;
					camera.zRotTarget = -camera.zOrbitTarget;
					break;
				case "orbit":
					camera.FOV = 3.1415/2;
					camera.xOrbitTarget = camera.xOrbit = -camera.xRotTarget;
					camera.yOrbitTarget = camera.yOrbit = -camera.yRotTarget;
					camera.zOrbitTarget = camera.zOrbit = -camera.zRotTarget;
					break;
			}
		},
		constrain(){
			camera.locked = true;
			//camera.xOrbitTarget = camera.zOrbitTarget = 0;
			camera.yOrbitTarget = -player.faceDir;
		},
		free(){
			if(camera.mode === "pov")
				return;
			
			camera.locked = false;
		}
	}

	const cursor = {
		buttonInfo : "",
		setCursor: function(type){
			this.selectedCursor = this[type] || this.passive;
		},
		active: function(){
			ctx.moveTo(c.width/2, c.height/2-20); ctx.lineTo(c.width/2, c.height/2-10);
			ctx.moveTo(c.width/2, c.height/2+10); ctx.lineTo(c.width/2, c.height/2+20);
			ctx.moveTo(c.width/2-20, c.height/2); ctx.lineTo(c.width/2-10, c.height/2);
			ctx.moveTo(c.width/2+10, c.height/2); ctx.lineTo(c.width/2+20, c.height/2);
			
		},
		passive: function(){
			ctx.moveTo(c.width/2, c.height/2-6); ctx.lineTo(c.width/2, c.height/2+6);
			ctx.moveTo(c.width/2-6, c.height/2); ctx.lineTo(c.width/2+6, c.height/2);
			
		},
		selectedCursor: undefined,
		draw: function(){
			ctx.strokeStyle = "#000";
			ctx.beginPath();
			this.selectedCursor();
			ctx.stroke();
			
		},
		mouseDown :()=>{},
		mouseUp :()=>{}
	}
	cursor.setCursor("passive");

	//Declarations
	var running = true;
	const pressedMoveKeys = [];
	var allFaces = [];
	var frameCount = 0;
	var FPS = 0;
	var deltaTimes = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
	var lastTime = 0;
	
	var mainLoop = (timestamp) => {
		//dt = delta time between frames. Multiply any velocity by this
		var dt = timestamp-lastTime;
		lastTime = timestamp;
		if(!running){
			return window.requestAnimationFrame(mainLoop);
		}
	
		//Keep track of deltatimes, FPS
		deltaTimes.unshift(dt);
		deltaTimes.pop();
		FPS = 0;
		deltaTimes.forEach((val)=> FPS+= val);
		FPS = Math.round(1000*deltaTimes.length/FPS);
	
		if(camera.mode === "orbit"){
			//Smoothly rotate camera
			camera.xOrbit -= (camera.xOrbit-camera.xOrbitTarget)*0.2;
			camera.yOrbit -= (camera.yOrbit-camera.yOrbitTarget)*0.2;
			
			camera.xRot = -camera.xOrbit;
			camera.yRot = -camera.yOrbit;
			
			var relP = geoFuncs.rotate3D({x:player.x, y:player.y, z:player.z-camera.orbitRadius}, player, camera.xOrbit, 0, 0);
			relP = geoFuncs.rotate3D(relP, {x:0, y:0, z:0}, 0, camera.yOrbit, 0);
			camera.xOffset = relP.x;
			camera.yOffset = relP.y;
			camera.zOffset = relP.z;	
			
		}
		else if(camera.mode=== "pov") {
			//Smoothly rotate camera
			//camera.xRot += 3.1415* (camera.xRotTarget-camera.xRot>3.1415/2) - 3.1415 * (camera.xRotTarget-camera.xRot<-3.1415/2);
			camera.xRot += (camera.xRotTarget - camera.xRot)*0.2;
		
			//camera.yRot += 3.1415* (camera.yRotTarget-camera.yRot>3.1415/2) - 3.1415 * (camera.yRotTarget-camera.yRot<-3.1415/2);
			camera.yRot += (camera.yRotTarget - camera.yRot)*0.2;
		}
		
		
		//Handle WASD Movement. One key: walk that direction. 
		//Two adjacent keys: walk their diagonal. Two opposite keys: last pressed wins.
		//Three keys: depens on order of pressing. Pressing all four keys is meaningless
		
		if(pressedMoveKeys.length > 0){
			player.walkSpeed = dt*0.3;
			if(pressedMoveKeys.length > 3)
				pressedMoveKeys = pressedMoveKeys.splice(3);
		} 
		else {
			player.walkSpeed = 0;
		}

		
		player.walkDir = util.handleWASD(pressedMoveKeys);
		
		//Run a frame on every timed event
		for(var i = 0; i < world.timedEvents.length; i++){
			world.timedEvents[i].onFrame(dt);
			world.timedEvents[i].timeLeft -= dt;
			if(world.timedEvents[i].timeLeft <= 0){
				world.timedEvents.splice(i,1);
			}
		}

		//Gravity and ground collision
		player.ySpeed += dt*0.03;
		if(player.y +player.sy/2+ player.ySpeed >  0){
			player.ySpeed = 0;
			//player.y = -player.sy/2;
			
		}
		
		var dX = player.walkSpeed * Math.sin((player.walkDir + player.faceDir));
		var dY = player.ySpeed;
		var dZ = player.walkSpeed * Math.cos((player.walkDir + player.faceDir));
		
		// Check if player is collided with any solid
		for(var solid of solids){
			var xCollision = util.collision(player.x-player.sx/2+dX, player.x+player.sx/2+dX, solid.x-solid.sx/2, solid.x+solid.sx/2);
			var yCollision = util.collision(player.y-player.sy/2+dY, player.y+player.sy/2+dY, solid.y-solid.sy/2, solid.y+solid.sy/2);
			var zCollision = util.collision(player.z-player.sz/2+dZ, player.z+player.sz/2+dZ, solid.z-solid.sz/2, solid.z+solid.sz/2);
	
	
			if(xCollision && yCollision && zCollision){
				var xCollisionBefore = util.collision(player.x-player.sx/2, player.x+player.sx/2, solid.x-solid.sx/2, solid.x+solid.sx/2);
				var yCollisionBefore = util.collision(player.y-player.sy/2, player.y+player.sy/2, solid.y-solid.sy/2, solid.y+solid.sy/2);
				var zCollisionBefore = util.collision(player.z-player.sz/2, player.z+player.sz/2, solid.z-solid.sz/2, solid.z+solid.sz/2);
				
				var A = xCollisionBefore && yCollision && zCollision;
				var B = xCollision && yCollisionBefore && zCollision;
				var C = xCollision && yCollision && zCollisionBefore;
	
				dX = dX * A;
				dY = dY * B;
				dZ = dZ * C;
				//If player lands on solid
				player.ySpeed *= B
			}
	
		}
		
		//Move player
		player.x += dX;
		player.y += dY;
		player.z += dZ;
		player.playerBox.move(dX, dY, dZ)
	
		//Default cursor
		cursor.setCursor("passive");
		cursor.buttonInfo = "";
	
		//Check if player looks at any interaction node
		for(var node of interactions){
			
			if(Math.pow(node.x-camera.x, 2) + Math.pow(node.y-camera.y, 2) + Math.pow(node.z-camera.z, 2) > 19600){
				//Player is not near node
				if(node === cursor.holdingInteraction){
					//Node was being held but player walked away
					cursor.holdingInteraction.mouseUp();
					cursor.holdingInteraction = null;
					cursor.mouseUp = ()=>{}
					cursor.mouseDown = ()=>{}
					
				}
				continue;
			}			
			
			//Player is near node. Relative point is midpoint of node with coordinates relative to camera plane
			//Check if relative point is inside a cylinder protruding out of camera plane

			var relativePoint = geoFuncs.rotate3D(node, camera, camera.xRot, camera.yRot, camera.zRot);

			if(Math.pow(relativePoint.x, 2) + Math.pow(relativePoint.y, 2) < 320){
				//Node is being looked at. Bind an action to mouseDown
				cursor.buttonInfo = node.info;
				cursor.setCursor("active");
				cursor.mouseDown = ()=>{
					cursor.holdingInteraction = node;
					node.mouseDown();
	
					cursor.mouseUp = ()=>{
						node.mouseUp();
						cursor.mouseUp = ()=>{}
						cursor.holdingInteraction = null;
					}
				}
				break;//Only one node can be looked at at once
			}
			else if(node === cursor.holdingInteraction){
				//Node was being held but looked away
				cursor.holdingInteraction.mouseUp();
				
				cursor.mouseUp = ()=>{}
				cursor.mouseDown = ()=>{}
				cursor.holdingInteraction = null;
				
			}
			else {//Node is not being looked at
				cursor.mouseDown = ()=>{}
			}
		}
		
		//Move and rotate objects in the world
		if(pong.active)
			pong.frame(dt);

		for(var i = 0; i < world.spinningTower.blocks.length; i++){
			world.spinningTower.blocks[i].rotateY(Math.sign(i%2-0.5)*world.spinningTower.rotationSpeed*dt);
		}
		
		blocks[0].rotateY(Math.sin(timestamp/2000)/15);
		blocks[0].rotateX(Math.cos(timestamp/2000)/15)*(Math.cos(timestamp/2000)>0);
		
		
		draw();
		frameCount--;
		
		window.requestAnimationFrame(mainLoop);
		
	}
	
	//
	//Function drawing everything
	//
	
	function draw(){
		var S = performance.now();
	
		//Clear screen
		ctx.globalAlpha = 1;
		ctx.fillStyle="#FFF";
		ctx.fillRect(0, 0, c.width, c.height);
		
		//These are only calculated once per frame, for performance
		var trigVals = [
			Math.cos(camera.xRot),
			Math.cos(camera.yRot),
			Math.cos(camera.zRot),
			Math.sin(camera.xRot),
			Math.sin(camera.yRot),
			Math.sin(camera.zRot)
		];
		//First draw lines marking the ground etc
		geoFuncs.projectPath(worldPath, ctx, camera, trigVals);	
		
		//To increase performance, faces are not sorted acooring to z depth every frame.
		//Sorting drawing order is the crude way I determine which faces are in front of others
		if(frameCount <= 0){
			frameCount = 6;
			allFaces = faces;
			
			spinningTower.blocks.forEach((block)=> allFaces = allFaces.concat(block.faces));
			blocks.forEach((block)=>allFaces = allFaces.concat(block.faces));
			solids.forEach((solid)=>allFaces = allFaces.concat(solid.faces));
			allFaces = allFaces.concat(effectFaces);
			interactions.forEach((interaction)=>{
				allFaces = allFaces.concat(interaction.cube.faces);
			});
			if(camera.mode === "orbit")
				allFaces = allFaces.concat(player.playerBox.faces);
	
			if(pong.active)
				allFaces = allFaces.concat(pong.playerRacket.faces, 
					pong.opponentRacket.faces, 
					pong.ball.shape.faces,
					pong.topBlock.faces, 
					pong.bottomBlock.faces
				);
			var S = performance.now();		
			util.bubblesort(allFaces, (face)=>Math.pow(face.z-camera.z, 2)+ Math.pow(face.y-camera.y, 2)+ Math.pow(face.x-camera.x, 2));
			//console.log(performance.now()- S);
		}
	
		//Now draw all faces
		for(var i = 0; i < allFaces.length; i++){
			geoFuncs.projectFace(allFaces[i], ctx, camera, trigVals);
		}
		
		//Draw HUD things
		cursor.draw();
		ctx.font = "35px Arial"
		ctx.fillStyle = "#000";
		ctx.fillText("FPS: " + FPS.toString(), 30, 50);
		ctx.font = "30px Arial";
		ctx.fillText(cursor.buttonInfo, c.width/2+40, c.height/2+15);
		
		if(pong.active){
			ctx.font = "70px Arial";
			ctx.fillText(pong.playerScore, 100, c.height/2);
			ctx.fillText(pong.opponentScore, c.width-100, c.height/2);
		}
		//console.log(performance.now() - S)
	}

	function rotateAll(screenX, screenY){
		var sensitivity = 0.003;
		screenX *= sensitivity; screenY *= sensitivity;
		if(Math.abs(camera.xRotTarget + screenY) > 3.1415/2 && Math.abs(camera.xRotTarget + screenY) < Math.abs(camera.xRotTarget)){
			screenY = 0;
		}
		player.playerBox.rotateY(-camera.locked * screenX);
		if(camera.mode === "orbit"){
			camera.xOrbitTarget += screenY;
			camera.yOrbitTarget -= screenX;
			player.faceDir += camera.locked * screenX;
			
		}
		else if(camera.mode === "pov"){
			camera.xRotTarget -= screenY;
			//camera.yRotTarget += screenX;
			player.faceDir += screenX;
			camera.yRotTarget = player.faceDir;
			//camera.xRotTarget += (camera.xRotTarget<0)*3.1415 - (camera.xRotTarget>3.1415)*3.1415;
			//camera.yRotTarget += (camera.yRotTarget<0)*3.1415 - (camera.yRotTarget>3.1415)*3.1415;
		}		
		
	}

	
	return {
		mainLoop: mainLoop,
		rotateAll: rotateAll,
		pressedMoveKeys: pressedMoveKeys,
		c: c,
		player: player,
		cursor: cursor,
		camera: camera
	}
});