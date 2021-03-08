require(["preData", "functions", "boxes", "state", "sound", "config"], function(preData, functions, boxes, state, sound, config, lastBox){
	var c = preData.c, ctx = preData.ctx;
	c.addEventListener("mousemove", function(event){
		var boundClient = c.getBoundingClientRect();
		config.mouse.x = event.clientX - boundClient.left;
		config.mouse.y = event.clientY - boundClient.top;
		var box = functions.clicked(config.mouse.x,  config.mouse.y);
		
		if(!box){//if mouse finds no box
			if(lastBox !== undefined && lastBox.selected){ //mouse just exited a box
				lastBox.Asize = lastBox.Rsize;
				lastBox.selected = false;
				config.mouse.actions.includes("redrawMenu") && state.draw(state.last[state.last.length-1], true);
				console.log("Box exited. Smallify");
			}
			lastBox = undefined;
			//console.log("No box detected");	
			return;
		}
		if(box.selected){
			//console.log("In same box"); // mouse is in same box
			return;	
		}
		//console.log("Box entered. Biggify.");
		if(lastBox){//if one mousemove fires in a box and next in another without passing "void of no boxes"
			lastBox.Asize = lastBox.Rsize;
			lastBox.selected = false;
		}
		box.Asize += 10; //mouse entered a box
		box.selected = true;
		lastBox = box;

		config.mouse.actions.includes("redrawMenu") && state.draw(state.last[state.last.length-1], true);
		sound.play(sound.select);
	})
});