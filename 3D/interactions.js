define(["world", "shapes", "pong"], function(world, shapes, pong){
	require(["world"], function(requiredWorld){
		world = requiredWorld;
	})
	
	function Interaction(x, y, z, info, mouseDown, mouseUp){
		this.x = x; this.y = y; this.z = z;
		this.mouseDown = mouseDown;
		this.clicks = 0;
		this.mouseUp = mouseUp;
		this.active = false;
		this.cube = new shapes.Cube(x, y, z, 20, "#0FF");
		this.info = info || "Unnamed Button";
	}
	function TimedEvent(func, duration = 0){
		this.onFrame = func;
		this.timeLeft = duration;
		this.duration;
	}

	var interactionArray = [
		
		new Interaction(-600, -90, 750, "Rotate Faces", ()=>{
			this.active = !this.active;
			if(this.active)
				world.timedEvents.push(new TimedEvent((dt)=>{
					world.effectFaces.forEach((face)=>face.rotateX(dt/300))
				}, Infinity))
			else 
				world.timedEvents.pop();			
			}, 
			()=>{
			
			}
		),

		new Interaction(-600, -90, 800, "Spawn Faces", function(){
				for(var x = 0; x< 5; x+=2){	
					for(var z = 0; z< 10; z+=2){
						world.effectFaces.push(new shapes.Face(-1000,-400+x*80, 500+z*80, 0, 10, 10, "#FFF"));
					}
				}
				for(var x = 0; x< 5; x+=2){
					for(var z = 0; z< 10; z+=2){
						world.effectFaces.push(new shapes.Face(-1500,-400+x*80, 500+z*80, 0, 10, 10, "#F00"));
					}
				}
				for(var x = 0; x< 5; x+=2){
					for(var z = 0; z< 10; z+=2){
						world.effectFaces.push(new shapes.Face(-2000,-400+x*80, 500+z*80, 0, 10, 10, "#0F0"));
					}
				}
				world.timedEvents.push(new TimedEvent(function(dt){
					frameCount = 0;
					for(var i = world.effectFaces.length-1; i >= 0; i--){
						var face = world.effectFaces[i];
						for(var e = face.points.length-1; e >= 0; e--){
							face.points[e].x +=((face.points[e].x-face.x>0)-0.5)*3//-(face.points[e].x-face.x)/5;
							face.points[e].y += ((face.points[e].y-face.y>0)-0.5)*3//-(face.points[e].y-face.y)/5;
							face.points[e].z += ((face.points[e].z-face.z>0)-0.5)*3//-(face.points[e].z-face.z)/5;
						}
					}
				}, 400))
				interactionArray.splice(interactionArray.indexOf(this), 1);
			},
			()=>{

			}
		),
		

		new Interaction(100, -100, 1300, "Toggle Stairs", function(){
				var sign = Math.sign(this.clicks%2-0.5);
				world.timedEvents.push(new TimedEvent((dt)=>{
					//door.move(0, -dt/10, 0);
					world.solids[0].move(0, sign*dt/15, 0);
					world.solids[1].move(0, sign*dt/10, 0);
					world.solids[2].move(0, sign*dt/7, 0);
				}, 2000))
				this.clicks++;
			},
			()=>{

			}
		),

		new Interaction(0, -400, 2800, "Start Pong", function(){
			if(this.clicks > 0) return;
			pong.active = true;
			pong.init();
			setTimeout(()=>pong.start(), 2000);
			
			
			}, 
			function(){
			if(this.clicks > 0) return;
			setTimeout(() => interactionArray.splice(interactionArray.indexOf(this), 1),500);
		}),

		new Interaction(600, -80, 800, "Reverse", function(){
			console.log(2222)
				world.spinningTower.rotationSpeed *= -1;
			},
			function(){

		})	
	];

	return interactionArray;
});