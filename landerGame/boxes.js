require.config({
	urlArgs: "bust=" + Date.now().toString()
})

define("boxes", [], function(){
	console.log("loading boxes.js")
	return {}
})