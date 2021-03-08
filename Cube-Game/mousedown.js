require(["functions", "preData", "boxes", "config", "sound","customBoss","state"],function(functions,preData,boxes, config, sound, customBoss, state){
	preData.c.addEventListener("mousedown", function(event){
		var boundClient = preData.c.getBoundingClientRect();
		var x = event.clientX - boundClient.left;
		var y = event.clientY - boundClient.top;
		
		for(var action of config.mouse.actions){
			var box = functions.clicked(x, y);
			if(action === "clickMenu"){
				if(box){
					if(!box.selected){
						box.Asize +=10;
					}
					box.onClick();
					sound.play(sound.click);
				}
			}
			if(action === "blocks" && !box){
				customBoss.addBlock(x, y);
			}
		
		
		}
    });
});