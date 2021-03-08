//Here, objects are added to the world
define(["shapes", "game", "interactions"], function(shapes, game, interactionNodes){
	const pressedMoveKeys = [];
	const worldPath = [];
	const solids = [];	
	const blocks = [];
	const faces = [];
	const effectFaces = [];
	const timedEvents = [];
	const interactions = interactionNodes;

	var door = new shapes.Cuboid(0, -120, 1800, 500, 200, 50, "#AFA");
	var spinningTower = {
		blocks: [],
		rotationSpeed : 0.004
	};
	for(var i = 0; i< 7; i++){
		spinningTower.blocks.push(new shapes.Cuboid(800, 0 - i*30, 800, 50+i*15, 15, 50+i*15, "rgba(255, "+i*255/7+", 255, 1)"));
	}
	
	solids.push(
		//door,
		new shapes.Cuboid(0, 70, 1500, 200, 40,200, "#FFF"),
		new shapes.Cuboid(0, 70, 1900, 200, 40,200, "#CCC"),
		new shapes.Cuboid(0, 70, 2200, 200, 40,200, "#AAA"),
		//new Cuboid(0, 50, 1300, 150, 100, 20, "#AAF"),
		new shapes.Cuboid(0, -250, 2600, 400, 50, 400, "#777"),
		new shapes.Cuboid(-120, 0, 1200, 20, 50, 400, "#888"),
		new shapes.Cuboid(120, 0, 1200, 20, 50, 400, "#888"),
		new shapes.Cuboid(-600, -30, 800, 20, 60, 200, "#5CF"),
		new shapes.Cuboid(-120, 0, 200, 20, 90, 400, "#888"),
		new shapes.Cuboid(120, 0, 200, 20, 90, 400, "#888"),
		
	);
	
	worldPath.push(
		{x: -90, y: 0, z: 1}, {x: -90, y: 0, z: 700},{x:-600, y:0, z: 700},
		{x: -600, y: 0, z: 900},{x: -90, y: 0, z: 900}, 
		{x: -90, y: 0, z: 5000}, {x:90, y:0, z: 5000}, 
		{x: 90, y: 0, z: 900}, {x:600, y:0, z: 900},
		{x: 600, y: 0, z: 700},{x: 90, y: 0, z: 700}, 
		{x: 90, y: 0, z: 1}, {x:-90, y:0, z: 1}
	);
		
	blocks.unshift(new shapes.Cuboid(800, -420, 800, 200, 200, 200, "#F5F"));
	
	return {
		spinningTower: spinningTower,
		worldPath: worldPath,
		solids: solids,
		worldPath: worldPath,
		solids : solids,
		blocks: blocks,
		faces: faces,
		effectFaces: effectFaces,
		timedEvents: timedEvents,
		interactions: interactions

	}
});