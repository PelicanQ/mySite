define(function(){
	//variables used in files before script.js. These need to be defined before functions.js
	var obj = {
		enemies : [],
		bosses : [],
		zones: [],
		powerUps : [],
		explosions : [],
		follows : [],
		leaders : [],
		shakers : [],
		nukeTimers : [],
		loops : {
			IDs : {},
			starters : {}
		},
		c : document.getElementById("c"),
		keys : {
			map : [],
			mPressed : undefined,	
			mReleased : undefined,
			pressed: false,
			lastPressed : undefined,
			lastReleased : undefined
		},
		r : { //r is player rectangle
			x: 0,
			y: 0,
			shake : 0,
			ySpeed : 0,
			xSpeed: 0,
			xRatio : 0.9,
			yRatio : 0.9,
			width: 30,	
			height: 30,
			id: "box", //ID box to indicate player box, 
			color : "#26F",
			health: 100,
			shield : false,
			midX : function(){
				return this.x + this.width/2
			},
			midY : function(){
				return this.y + this.height/2
			}
		},
		player2 : {
			x : 100,
			y : 100,
			ySpeed : 0,
			xSpeed: 0,
			xRatio : 0.9,
			yRatio : 0.9,
			width: 30,
			height: 30,
			id: "box",
			color : "#00FF00",
			health: 100,
			shield : false
		},
	}
	obj.ctx = obj.c.getContext("2d");
	obj.friends = [obj.r];
	return obj;
})
