define(function(){
	class Point {
		constructor(x, y){
			this.x = x;
			this.y = y;
		}
		rotate(pivot, deltaAngle){
			var distance = this.distanceTo(pivot);
			var angle = Math.atan2(this.y-pivot.y, this.x - pivot.x);
			angle += deltaAngle;
			this.x = pivot.x + distance * Math.cos(angle);
			this.y = pivot.y + distance * Math.sin(angle);
		}
		distanceTo(point){
			return Math.sqrt((this.x - point.x)* (this.x - point.x) + (this.y - point.y)* (this.y - point.y));
		}
	}
	var Ball = function(x, y, xS, yS, rad){
		this.x = x;
		this.y = y;
		this.xSpeed = xS;
		this.ySpeed = yS;
		this.radius = rad;
	}
	
	return {
		Point: Point,
		Ball: Ball
	}
});
