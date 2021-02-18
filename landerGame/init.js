require(["state", "functions","constructors", "list", "tools", "mousedown", "mainScript",  "levels", "boxes" , "preData", "buttons", "boxDoers"], function(state, functions){
	console.log("entered init");
	//functions.windowResize();
	state.draw(state.menu, true);
	console.log("  aaa" + state.menu);
})