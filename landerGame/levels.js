define(["constructors"], function(consts){
	var Turret = consts.Turret;
	return {
		level0 : {
			obstacles : [{xPos : 10, yPos : 500, width : 45, height: 50}],
			turrets : [new Turret(200, 500, 15)],
			platforms : []
		},
		level1 : {
			obstacles : [],
			turrets : [new Turret(600, 500, 50), new Turret(500, 550, 40)],	
			platforms : []
		}
	}
})