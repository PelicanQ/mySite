define( ["preData","constructors"], function(preData, constructors){	
	var c = preData.c;
	var ctx = preData.ctx;
	var Box = constructors.Box;
	return {
		s : new Box("FREEPLAY", 0, "#494", 60), //each is a box on screen
		play : new Box("PLAY GAME", 0, "#494", 60),
		modeTwo : new Box("ENDLESS", 0, "#E11", 60),
		gabenMode : new Box("GAB WIP", 0, "#22F", 60),
		settings : new Box("SETTINGS", 0, "#FE1", 60),
		paused : new Box("PAUSED", 150, "#FA5", 60),
		music : new Box("MUSIC : ON", 0, "#72E", 60),
		quit : new Box("QUIT GAME", 0, "#E3C", 60),
		back : new Box("BACK", c.height-50, "#555", 35),
		sfx : new Box("SFX : ON", 400, "#FA5", 60),
		bars : new Box("SHOW HEALTH : FALSE", 200, "#F00", 60),
		multi : new Box("2 PLAYER WIP", 0, "#F20D6A", 65),
		customBoss : new Box("CUSTOM BOSS", 0, "#FF00FF", 60),
		saveBoss : new Box("SAVE AND RETURN", c.height-100, "#FFF020", 50),
		gameOver: new Box("GAME OVER", c.width/2, c.height/2, "#F00", 60),
		part_laser : new Box("LASER", 400, "#f000f0", 50),
		part_structural : new Box("STRUT", 400, "#0f0f0f", 50),
		part_missile : new Box("MISSILE", 600, "#486", 50)
	}
})