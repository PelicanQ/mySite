define(function(){
	return {
		opacity: 1,
		opacitySpeed:0,
		gamemode :"menu",
		progress : 0,
		lastTime : 0,
		dt: 0,
		fps : 120,
		points : 0, 
		pointsCounter : 0, 
		message : "",
		healthval : 100, 
		somevals : 100, 
		
		pressTimes : 0, 
		drawMeter : true,
		reset : false ,
		timers : { 
			speed : 0, 
			shield : 0, 
			doubleShot : 0, 
			cash: 0, 
			health : true,
			message : 100
		},
		mouse : {
			x : 0,
			y : 0,
			actions: []
		},
		red : 0,
		green : 0,
		music : true,
		sfx : true,
		bars : false
	}
})