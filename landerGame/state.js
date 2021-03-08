define(["preData", "boxes", "mainScript", "lander"], function(preData, boxes, main, lander){
	console.log("loading state.js");
	var ctx = preData.ctx;
	return {
		paused : function(){
			draw();
			ctx.fillStyle = "rgba(0,0,0,0.3)";
			ctx.fillRect(0,0,ctx.width,ctx.height);
			boxes.settings.staticy = boxes.paused.staticy+350;
			boxes.quit.staticy = boxes.settings.staticy+150;
			boxes.settings.boxThis();
			boxes.paused.boxThis();
			boxes.paused.visible = false;
			boxes.quit.boxThis()
		},
		menu : function(){
			var functions = require("functions");
			main.mouse.mouseDown = function(x, y){
				var clickedBox = functions.clicked(x, y);
				if(clickedBox){
					if(!clickedBox.selected){
						clickedBox.Asize += 10;
					}
					
					clickedBox.doIt();
					//sound.play(sound.click);
					//box.minify(); maybe
				}
		    }

			var t = require("boxes");
			console.log (t);
			console.log(boxes);
			for(var i in boxes){
				if(i.slice(0, 5) == "level"){
					boxes[i].boxThis();
				}
			}
		},
		blank : function(){},
		runningGame: function(){
			main.mouse.mouseDown = function(x, y){
				preData.shots.push(lander.fire(x, y));
				console.log("awdawd")
			};
		},
		last : [],
		draw : function(stat, add, a){
			a = ctx.globalAlpha;
			ctx.globalAlpha = 1;
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.globalAlpha = a;
			if (!add) {
				this.last [this.last.length] = stat;
			}
			for(var i in boxes){
				boxes[i].visible = false;
			}
			stat();
		}
		
	}
})