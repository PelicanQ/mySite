define(["preData"], function(preData){
	var ctx = preData.ctx;
	var c = preData.c;
	var PowerUp = function(col, thing, rad, x, y){
		this.x = x || Math.random() * c.width
		this.y = y || Math.random() * c.height
		this.radius = rad
		this.color = col
		this.thing = thing
		this.timer = 0
	}
	var Box =  function(txt, y, color,size){
		this.margin = size/3;
		this.Rsize = size
		this.Asize = size
		this.txt = txt
		ctx.font = size+"px t"
		this.x = 0
		this.staticy = y
		this.y = this.staticy
		this.width = function(){
			ctx.font = this.Asize+"px t"
			return ctx.measureText(this.txt).width;
		}
		this.color = color;
		this.boxThis = function(){
			ctx.font = this.Asize + 'px t';
			this.x = 50;
			this.y = this.staticy+ this.Asize/2;
			ctx.fillStyle = "#FFF";
			ctx.fillRect(this.x-this.margin,this.y-this.Asize,this.width()+this.margin*2,this.Asize+this.margin);
			ctx.fillStyle = color;
			ctx.fillText(this.txt,this.x,this.y);
			ctx.strokeStyle = "#000";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(this.x-this.margin,this.y+this.margin);
			ctx.lineTo(this.x+this.width()+this.margin,this.y+this.margin);
			ctx.lineTo(this.x+this.width()+this.margin,this.y-this.Asize);
			ctx.lineTo(this.x-this.margin,this.y-this.Asize);
			ctx.lineTo(this.x-this.margin,this.y+this.margin);
			ctx.stroke();
			this.visible = true;
			ctx.font="50px t";
		}
		this.visible = false
		this.selected = false
	}
	var Laser = function(x,y,ySpeed,xSpeed,wid,hei,dmg, id, color){
		this.x = x;
		this.y = y;
		this.shake = 0;
		this.ySpeed = ySpeed;
		this.xSpeed = xSpeed;
		this.xRatio = 1;
		this.yRatio = 1;
		this.width = wid;
		this.height = hei;
		this.id = id || "laser";
		this.color = color || "#26F";
		this.damage = dmg ;
		this.health = 10;
		this.midX = function(){
			return this.x + this.width/2;
		}
		this.midY = function(){
			return this.y + this.height/2;
		}
	}
	var Enemy = function(x,y,ySpeed,xSpeed,wid,hei,health,xR,yR,col,id,poi,dmg){
		this.x = x
		this.y = y
		this.shake = 0;
		this.ySpeed = ySpeed
		this.xSpeed = xSpeed
		this.width = wid
		this.height = hei
		this.health = health
		this.xRatio = xR
		this.yRatio = yR
		this.color = col
		this.id = id
		this.points = poi
		this.damage = dmg
		this.coolDown = 200
		this.busy = false
		this.midX = function(){
			return this.x + this.width/2
		}
		this.midY = function(){
			return this.y + this.height/2
		}
	}
	var Zone = function(x, y, r, color, thing, time){
		this.x = x
		this.y = y
		this.radius = r
		this.color = color
		this.thing = thing
		this.timer = time
	}
	
	return {
		PowerUp : PowerUp,
		Box : Box,
		Laser : Laser,
		Enemy : Enemy,
		Zone : Zone
	}
});