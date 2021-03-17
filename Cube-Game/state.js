define(["boxes", "preData", "config", "script", "sound"], function(boxes, preData, config , script, sound){
	var {c, ctx, mouseActions, loops} = preData;
	var draw = script.draw;
	return {
		paused : function(){
			draw();
			ctx.fillStyle = "rgba(0,0,0,0.3)";
			ctx.fillRect(0, 0, c.width, c.height);
			boxes.settings.staticy = boxes.paused.staticy + 350;
			boxes.quit.staticy = boxes.settings.staticy + 150;
			boxes.settings.boxThis();
			boxes.paused.boxThis();
			boxes.paused.visible = false;
			boxes.quit.boxThis();
		},
		menu : function(){
			boxes.settings.staticy = c.height-100;
			boxes.customBoss.staticy = boxes.settings.staticy - boxes.settings.Rsize - boxes.settings.margin*2;
			boxes.play.staticy = boxes.customBoss.staticy - boxes.customBoss.Rsize - boxes.customBoss.margin*2;
			
			config.points = 0;
			config.gamemode = "menu";
			config.mouse.actions.splice(0);
			config.mouse.actions.push("clickMenu", "redrawMenu");
			boxes.play.boxThis();
			boxes.customBoss.boxThis();
			boxes.settings.boxThis();

		},
		modes : function(){
			boxes.multi.staticy = c.height-100;
			boxes.gabenMode.staticy = boxes.multi.staticy-boxes.multi.Rsize-boxes.multi.margin*2;
			boxes.modeTwo.staticy = boxes.gabenMode.staticy-boxes.gabenMode.Rsize-boxes.gabenMode.margin*2;
			boxes.s.staticy = boxes.modeTwo.staticy-boxes.modeTwo.Rsize-boxes.modeTwo.margin*2;
			config.mouse.actions.splice(0);
			config.mouse.actions.push("clickMenu", "redrawMenu");
			
			boxes.multi.boxThis();
			boxes.gabenMode.boxThis();
			boxes.modeTwo.boxThis();
			boxes.s.boxThis();
			
		},
		customBoss : function(){
			config.mouse.actions.splice(0);
			config.mouse.actions.push("redrawMenu", "clickMenu", "blocks");
			boxes.part_laser.staticy = boxes.part_structural.staticy + boxes.part_structural.Rsize+boxes.part_structural.margin*2;
			boxes.part_missile.staticy = boxes.part_laser.staticy + boxes.part_laser.Rsize+boxes.part_laser.margin*2;
			boxes.saveBoss.staticy = boxes.part_missile.staticy +  boxes.part_laser.Rsize + boxes.part_laser.margin*2
		},
		settings : function(){
			if(config.gamemode !== "menu"){			
				draw();//if paused mid-game
				ctx.fillStyle = "rgba(0,0,0,0.3)";
				ctx.fillRect(0, 0, c.width, c.height);
			}
			boxes.settings.staticy = 160;
			boxes.settings.Asize = boxes.settings.Rsize+10;
			boxes.settings.boxThis();
			boxes.settings.visible = false;
			boxes.settings.selected = false;
			boxes.music.staticy = boxes.settings.staticy+180;
			boxes.sfx.staticy = boxes.music.staticy+boxes.music.Rsize+boxes.music.margin*2;
			boxes.bars.staticy = boxes.sfx.staticy+boxes.sfx.Rsize+boxes.sfx.margin*2;
			boxes.music.boxThis();
			boxes.back.boxThis();
			boxes.sfx.boxThis();
			boxes.bars.boxThis();
		},
		gameOver : function(){
			boxes.gameOver.boxThis();
		},
		last : [],
		draw : function(state, noAdd){
			var a = ctx.globalAlpha;
			ctx.globalAlpha = 1;
			ctx.clearRect(0, 0, c.width, c.height);
			ctx.globalAlpha = a;
			if(!noAdd){
				this.last.push(state);
			}
			for(var i in boxes){
				boxes[i].visible = false;
			}
			//preData.mouseActions = [];
			if(state){
				state();
			}
		}
		
	}
});