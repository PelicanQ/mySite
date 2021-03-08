define(["constructors", "preData", "mainScript", "state"], function(constructors, preData, main, state){
	console.log("loading Levels.js");
	const {Turret, Rectangle} = constructors;
	const {obstacles, turrets, platforms} = preData;
	const Levels = {
		levelsArray: [
			{
				obstacles : [ 
					new Rectangle(-700, 610, 100, 20, "platform"),
					new Rectangle(-400, preData.c.height-200, 1000, 50)

				],
				turrets : [
					new Turret(-300, 500, 30)
				],
				platforms : []
			},
			{
				obstacles : [
					
					new Rectangle(-200, preData.c.height-200, 400, 50),
					new Rectangle(-200, 100, 40, 500),
					new Rectangle(200, 100, 40, 500),
					new Rectangle(-40, 700, 100, 20, "platform")
				],
				turrets : [
					new Turret(-320, 100, 50), 
					//new Turret(900, 550, 40), 
					new Turret(400, 100, 40)
				],	
				platforms : []
			},
			{
				obstacles : [
					new Rectangle(-200, preData.c.height-200, 400, 50),
					new Rectangle(-200, 0, 50, 600),
					new Rectangle(-200, -100, 50, 250),
					new Rectangle(200, 100, 50, 500),
					new Rectangle(200, 100, 500, 50),
					new Rectangle(-200, -100, 1100, 50),
					new Rectangle(900, -100, 50, 600),
				],
				turrets : [
					new Turret(400, 500, 50),
					new Turret(490, 500, 50)
				],	
				platforms : [],
				setup: () => {
					main.View.zoom = 0.6;
					main.View.zoomTarget = 0.5;
				}
			}
		],
		load(i){
			const currentLevel = Levels.levelsArray[i];
			preData.obstacles.splice(0);
			preData.turrets.splice(0);
			preData.platforms.splice(0);
			
			currentLevel.obstacles.forEach(obstacle => obstacles.push(obstacle));
			currentLevel.turrets.forEach(turret => turrets.push(turret));
			currentLevel.platforms.forEach((platform)=> platforms.push(platform));

			preData.platforms.push();
			currentLevel.setup && currentLevel.setup();
			main.resumeGame();
		}
		
	}
	return Levels;
})