require(["boxes","functions", "Levels", "state"], function(boxes, functions, Levels, state){
	
	boxes.level0.doIt = function(){
		state.draw(state.runningGame);
		Levels.load(0);
		console.log("success!");
	}
	boxes.level1.doIt = function(){
		state.draw(state.runningGame);
		Levels.load(1);
	}
	boxes.level2.doIt = function(){
		state.draw(state.runningGame);
		Levels.load(2);
	}
})