define(["spawnEnemy", "preData", "constructors", "sound"], function(spawnEnemy, preData, constructors, sound){
	var enemies = preData.enemies;
	var Laser = constructors.Laser;
	var r = preData.r;
	
	return function(x, y, width, height, color){
		this.parts = [
			body = {
				x : x,
				y : y,
				width : width,
				height : height,
				id : "core"
			}
		];
		this.getX = function(){
			return this.parts[0].x;	
		};
		this.getY = function(){
			return this.parts[0].y;	
		}
		this.requestFire = function(a){//a is a part of bosses
			var x = a.x, y = a.y, wid, hei, xS, yS, id;
			if(typeof a.x ==="function"){
				x = a.x();
				y = a.y();
			}
			if(r.x + r.width > x  &&  r.x < x + a.width || r.y < y+a.height && r.y + r.height > y){
				//r is somewhere within lines drawn out from boss's edges

				if(Math.abs(y+a.height/2-(r.y+r.height/2)) > Math.abs(x+a.width/2-(r.x+r.width/2))){ 
				// is above or below. Difference in Y is greater than difference in X
					wid = 7; hei = 20;
					xS = 0;

					if(r.y+r.height/2 < y+a.height/2  &&  a.fireDir == "down"){
						yS = 14;//DOWN
					}
					else if(r.y+r.height/2 > y+a.height/2 && a.fireDir =="up"){
						yS =  -14;//UP
					}
					else return;
				}
				else { //is to sides. Difference in X is greater than difference in Y
					wid = 20; hei = 7;
					yS = 0;


					if(r.x+r.width/2 < x+a.width/2  &&  a.fireDir == "left"){
						xS = -14;//LEFT
					}
					else if(r.x+r.width/2 > x+a.width/2  &&  a.fireDir == "right"){
						xS = 14;//RIGHT
					}
					else return;
				}//from here a projectile is imminent 
				if(a.id == "missile"){//50 percent chance to fire a missile explosive
					wid = wid * 1.5;
					hei = hei * 1.5;
					xS = xS/1.5;
					yS = yS/1.5;
					id = "explosive";
					console.log("Explosive fired");
				}
				sound.play(sound.pew);
				enemies[enemies.length] = new Laser(x + a.width/2 - wid/2, y + a.height/2 - hei/2, yS, xS, wid, hei, 12, id);
				console.log(enemies[enemies.length-1]);
				enemies[enemies.length-1].destination = {x : r.x, y : r.y}
				
			}
			
		}
		this.health = 1000
		this.damage = 40
		this.xRatio = 1;
		this.yRatio = 1;
		this.xSpeed = 0,
		this.ySpeed = 0
		this.color = color;
	}
});