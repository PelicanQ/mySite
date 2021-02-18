define("boxes",[], function(){
	
	return {}
})
require(["boxes", "levels", "constructors", "init"], function(obj, levels, constructors){
	console.log("expanding boxes");
	for(var i = 0; i < Object.keys(levels).length; i++){ // this code loos through all levels and makes a menuBox for each
		var x = obj["level0"] ? obj[Object.keys(obj)[i-1]].xPos + obj[Object.keys(obj)[i-1]].width()/2 + 100 : 100
		obj["level"+i.toString()] = new constructors.Box(i.toString(), x, 100, "#F0F", 50);	
	}
	return {}
})