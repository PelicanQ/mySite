define(["preData", "constructors", "config"] ,function(preData, constructors, config){
	const types = ["speed", "shield", "double", "blast", "cash", "regen", "nuke"];
	const colors = ["#F00",  "#F0F"  , " #00F ", " #FA5", "#0FF", "#F2C",  "#FF0"];	
	
	
	return function(type){
		if(!type){
			var randomIndex = Math.round(Math.random() * types.length);
			type = types[randomIndex];
		}
		preData.powerUps.push(new constructors.PowerUp(colors[types.indexOf(type)], type, 20));	
	}
})