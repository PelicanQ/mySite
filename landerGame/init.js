//Dont know why this project alone is being cached so much.
//Need a cache bust for quick changes of code
require.config({
	urlArgs: "bust=" + Date.now().toString()
})

require(["mainScript", "state", "functions",  "Levels", "constructors", "boxes" ,"list", "mousedown",   "preData", "buttons", "boxDoers"],
	function(main, state, functions, Levels, constructors, boxes){
	console.log("loading init.js");

	for(var i = 0; i < Levels.levelsArray.length; i++){ // this code loos through all levels and makes a menuBox for each
		var x = 100 + i * 100;
		boxes["level"+i.toString()] = new constructors.Box(i.toString(), x, 100, "#F0F", 50);	
	}

	state.draw(state.menu, true);
})