define(["geometry"], function(geo){
	var lander = {
		x : 0,
		y : 500,
		xSpeed : 0,
		ySpeed : 0,
		force : 0,
		width : 20,
		height : 20,
		rot : Math.PI/2,
		rotSpeed : 0,
		mid: function() {
			return new geo.Point(this.x+this.width/2, this.y+this.height/2)
		},
		topMid: function(){
			var p = new geo.Point(this.x + this.width/2, this.y);
			p.rotate({x: this.x+this.width/2, y: this.y+this.height/2}, this.rot-Math.PI/2);

			return p;
		},
		fire(){
			var rad = 2;
			var xS = 800 * Math.cos(this.cannon.rotation); 
			var yS =  800 * Math.sin(this.cannon.rotation);
			var topMid = this.topMid();
			var X = topMid.x + this.cannon.height * Math.cos(this.cannon.rotation);
			var Y = topMid.y + this.cannon.height * Math.sin(this.cannon.rotation);
			
			return new geo.Ball(X, Y, xS, yS, rad);
			
		},
		cannon : {
			x : function(){return lander.topMid().x - this.width/2},
			y : function(){return lander.topMid().y},
			width : 4,
			height : 20,
			rotation : 0 // relative to landers rot
		}
	}
	lander.xparts = {
		leftLeg : {
			x : function(){return lander.x},
			y : function(){return lander.y+lander.height},
			width : 5,
			height : 15
		},
		rightLeg : {
			x : function(){return lander.x+lander.width-5},
			y : function(){return lander.y+lander.height},
			width : 5,
			height : 15
		}
	}
	return lander;
});