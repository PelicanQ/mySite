define(["preData", "functions", "geometry"], function(preData, functions, geometry){
	console.log("Loading constructors.js")
	var c = preData.c;
	var ctx = preData.ctx;
	var checkCollision = functions.checkCollision;
	var Rectangle = function(x, y, width, height, id){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.id = id;
	}
	var	Box = function(txt, x, y, color, size){
		this.margin = size/3;
		this.Rsize = size;
		this.Asize = size;
		this.txt = txt;
		ctx.font = size+"px t";

		this.x = x;
		this.staticy = y;
		this.y = this.staticy;
		this.width = function(){
			ctx.font = this.Asize + "px t";
			return ctx.measureText(this.txt).width
		}
		this.color = color;
		this.boxThis = function(){
			ctx.font = this.Asize + 'px t'
			this.y = this.staticy+ this.Asize/2
			ctx.fillStyle = "#FFF"
			ctx.fillRect(this.x-this.margin, this.y-this.Asize, this.width()+this.margin*2, this.Asize+this.margin)
			ctx.fillStyle = color;
			ctx.fillText(this.txt,this.x, this.y);
			ctx.strokeStyle = "#000"
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(this.x-this.margin, this.y+this.margin);
			ctx.lineTo(this.x+this.width()+this.margin, this.y+this.margin);
			ctx.lineTo(this.x+this.width()+this.margin, this.y-this.Asize);
			ctx.lineTo(this.x-this.margin, this.y-this.Asize);
			ctx.lineTo(this.x-this.margin, this.y+this.margin);
			ctx.stroke();
			this.visible = true;
			ctx.font="50px t";
		};
		this.visible = false;
		this.selected = false;
	}
	var Ball = function(x, y, xS, yS, rad){
		this.x = x;
		this.y = y;
		this.xSpeed = xS;
		this.ySpeed = yS;
		this.radius = rad;
	}
	var Turret = function(x, y, height){
		Rectangle.call(this, x, y, 7, height);
		this.targetRotation = 0;
		this.rotation = 0;
		this.coolDown = 10;
		this.bulletSpeed = 700;
		this.predictAim = (obj) => {
			//Predicted aim found on reddit

			var targetX = obj.x - this.x;
			var targetY = obj.y - this.y;
		    var rCrossV = targetX * obj.ySpeed - targetY * obj.xSpeed;
		    var magR = Math.sqrt(targetX * targetX + targetY * targetY);
		    var angleAdjust = Math.asin(rCrossV / (this.bulletSpeed * magR));

		    var newAngle = angleAdjust + Math.atan2(targetY, targetX);

			if(!isNaN(newAngle))
				this.targetRotation = newAngle;
		    return this.targetRotation;
			
		};
		this.topMid = () => {
			var p = new geometry.Point(this.x + this.width/2, this.y);
			p.rotate({x: this.x+this.width/2, y: this.y+this.height/2}, this.rot + Math.PI/2);

			return p;
		};
		this.fire = () => {
			//var mid = this.topMid();
		    return new Ball(this.x+this.width/2, this.y, this.bulletSpeed * Math.cos(this.rotation), this.bulletSpeed * Math.sin(this.rotation), 5);
		};
	}

	return {
		Box: Box,
		Ball: Ball,
		Turret: Turret,
		Rectangle: Rectangle
	}
})