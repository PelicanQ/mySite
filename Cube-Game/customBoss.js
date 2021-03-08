define(["preData", "functions", "customBosses", "bossConstructor", "state", "boxes", "config"], 
	function(preData, functions, customBosses, Boss, state, boxes, config
){
	var c = preData.c, ctx = preData.ctx,drawRect = functions.drawRect, loops = preData.loops;
	var preBoss = new Boss(c.width/2, c.height/2, 50, 50);
	var bossName;
	var blocks = {
		structural : function(diffX, diffY){
			this.width = 10;
			this.height = 30;
			this.color = "#24A";
			this.id = "structural";
  			this.diffX = diffX;
  			this.diffY = diffY;
  			this.x = function(){
  				return preBoss.parts[0].x + diffX;
  			}
  			this.y = function(){
  				return preBoss.parts[0].y + diffY;
  			}
		},
		laser : function(diffX, diffY){
  			this.width = 30;
  			this.height = 10;
  			this.color = "#F00";
  			this.id = "laser";
  			this.fireDir = "right";
  			this.diffX = diffX;
  			this.diffY = diffY;
  			this.coolDown = 0;
  			this.x = function(){
  				return preBoss.parts[0].x + diffX;
  			}
  			this.y = function(){
  				return preBoss.parts[0].y + diffY;
  			}
		},
		missile : function(diffX, diffY){
			this.width = 30;
  			this.height = 10;
  			this.color = "#486";
  			this.id = "missile";
  			this.fireDir = "right";
  			this.diffX = diffX;
  			this.diffY = diffY;
  			this.coolDown = 0;
  			this.x = function(){
  				return preBoss.parts[0].x + diffX;
  			}
  			this.y = function(){
  				return preBoss.parts[0].y + diffY;
  			}
		}
	}
	return {
		selectedBlock : "structural",
		addBlock : function(x, y){
			preBoss.parts[preBoss.parts.length] = 
			new blocks[this.selectedBlock]( x-preBoss.parts[0].x,   y-preBoss.parts[0].y);
			
		},	
		start : function(){
		bossName = "a";
		
		var progress = 0;
		var lastTime = 0;
		var create = function(timestamp){
				
				progress = progress ? timestamp - lastTime : 0
				if(progress < 17){
					lastTime = timestamp;
					ctx.fillStyle = "#ffffff";
					ctx.fillRect(0,0,c.width,c.height)
					ctx.fillStyle = "#F00";
					ctx.fillRect(config.mouse.x, config.mouse.y, 10, 30);
					
					for(var i in preBoss.parts){
						ctx.fillStyle = "#ff0000";
						drawRect(preBoss.parts[i]);
					}
					boxes.part_laser.boxThis();
					boxes.part_structural.boxThis();
					boxes.part_missile.boxThis();
					boxes.saveBoss.boxThis();
				}
				loops.IDs.customBoss = window.requestAnimationFrame(create);
			}
			
			loops.IDs.customBoss = window.requestAnimationFrame(create);
		},
		finalize : function(){
			customBosses[bossName] = preBoss;
			window.cancelAnimationFrame(loops.IDs.customBoss);
			delete loops.IDs.customBoss;
		}
	}
})