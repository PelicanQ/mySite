//This project seems to be chached a lot. Adding cache bust
require.config({
	urlArgs: "bust=" + Date.now().toString()
})

define("boxes", [], function(){
	console.log("loading boxes.js");
	return {}
})