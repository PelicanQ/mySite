define(["geometry"], function(geo){
	var lander = {
		xPos : 400,
		yPos : 100,
		xSpeed : 0,
		ySpeed : 0,
		force : 0,
		width : 20,
		height : 20,
		rot : 0,
		rotSpeed : 0,
		mid: function() {
			return new geo.Point(this.xPos+this.width/2, this.yPos+this.height/2)
		},
		topMid: function(){
			var p = new geo.Point(this.xPos+this.width/2, this.yPos);
			
			p.rotate(this.mid(), this.rot);
			return p;
		},
		fire(x, y){
			var rad = 2;
			var xS = 16 * Math.sin((this.cannon.rotation+this.rot))//sine 
			var yS =  16 * -Math.cos((this.cannon.rotation+this.rot))//cos
			var X = this.xPos+this.width/2+Math.sin(this.rot)*this.width/2 + this.cannon.height * Math.sin((this.cannon.rotation+this.rot))
			var Y = this.yPos +this.height/2- Math.cos(this.rot) * this.height/2  - this.cannon.height * Math.cos((this.cannon.rotation+this.rot))
			
			
			return new geo.Ball(X, Y, xS, yS, rad);
			/*{
				xS : xS,
				x : Y,
				g : rad
			}*/
		},
		cannon : {
			xPos : function(){return lander.xPos+lander.width/2-this.width/2},
			yPos : function(){return lander.yPos-this.height},
			width : 10,
			height : 60,
			rotation : 0 // relative to landers rot
		}
	}
	lander.xparts = {
		leftLeg : {
			xPos : function(){return lander.xPos},
			yPos : function(){return lander.yPos+lander.height},
			width : 5,
			height : 15
		},
		rightLeg : {
			xPos : function(){return lander.xPos+lander.width-5},
			yPos : function(){return lander.yPos+lander.height},
			width : 5,
			height : 15
		}
	}
	return lander;
});