define(["preData", "mainScript", "tools", "functions"],function(preData, main, tools, functions){
	var c = preData.c;
	var ctx = preData.ctx;
	var lander = main.lander;
	var checkCollision = functions.checkCollision;
	var obj = {
		Box : function(txt, xPos, yPos, color,size){
			this.margin = size/3;
			this.Rsize = size
			this.Asize = size
			this.txt = txt
			ctx.font = size+"px t"
			this.xPos = xPos
			this.staticyPos = yPos
			this.yPos = this.staticYpos
			this.width = function(){
				ctx.font = this.Asize + "px t";
				return ctx.measureText(this.txt).width
			}
			this.color = color;
			this.boxThis = function(){
				ctx.font = this.Asize + 'px t'
				this.yPos = this.staticyPos+ this.Asize/2
				ctx.fillStyle = "#FFF"
				ctx.fillRect(this.xPos-this.margin,this.yPos-this.Asize,this.width()+this.margin*2,this.Asize+this.margin)
				ctx.fillStyle = color
				ctx.fillText(this.txt,this.xPos,this.yPos);
				ctx.strokeStyle = "#000"
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(this.xPos-this.margin,this.yPos+this.margin);
				ctx.lineTo(this.xPos+this.width()+this.margin,this.yPos+this.margin);
				ctx.lineTo(this.xPos+this.width()+this.margin,this.yPos-this.Asize);
				ctx.lineTo(this.xPos-this.margin,this.yPos-this.Asize);
				ctx.lineTo(this.xPos-this.margin,this.yPos+this.margin);
				ctx.stroke();
				this.visible = true;
				ctx.font="50px t";
			};
			this.visible = false;
			this.selected = false;
		},
		Ball : function(xPos, yPos, xS, yS, rad){
			this.xPos = xPos;
			this.yPos = yPos;
			this.xSpeed = xS;
			this.ySpeed = yS;
			this.radius = rad;
		},
		Turret : function(xPos, yPos, height){
			this.xPos = xPos;
			this.yPos = yPos;
			this.height = height;
			this.width = 7;	
			this.rotation = 0;
			this.coolDown = 10;
			this.fire = function() {
				for(var i = 0; i<100;i++) {
					var futureX = lander.xPos + lander.xSpeed * (i+1);              //Add the length times frames
					var futureY = lander.yPos + lander.ySpeed * (i+1);
					this.rotation =  tools.t2(this.yPos, futureY+lander.height/2,  (futureX+lander.width/20) -(this.xPos+this.width/2) ,180);         // turret will follow aim straight at lander then fire at predicted location
					//console.log(this.rotation);
					var x = this.xPos+this.width/2+ -Math.sin(this.rotation*Math.PI/180)*this.height;
					var y = this.yPos+this.height*Math.cos(this.rotation*Math.PI/180) ;
					var xS = -10 * Math.sin((this.rotation)*Math.PI/180);
					var yS = 10 * Math.cos((this.rotation)*Math.PI/180);
					//preData.meteors[preData.meteors.length] = new obj.Ball(x+xS*(i+1), y+yS*(i+1), 0, 0, 5);
					//preData.meteors[preData.meteors.length] = new obj.Ball(futureX, futureY, 0, 0, 1);
					if(checkCollision({xPos : futureX,	
										yPos: futureY,
										width : lander.width,
										height : lander.height
										},
					new obj.Ball(x+xS*(i+1), y+yS*(i+1), 0, 0, 5), true)){
						preData.meteors[preData.meteors.length] = new obj.Ball(x, y, xS, yS, 5);
						return;
					}
					else { 
						//console.log("No hit");
						continue;
					}
				}
			}
		},

	}
	return obj
})