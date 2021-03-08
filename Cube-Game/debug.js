var debug = (function(c, state){
	
	var values = {
		last : state.last
	}
	var a, progress, lastTime = 0;
	display = function(timestamp){
		progress = timestamp - lastTime;
		if(progress > 5){
			lastTime = timestamp;
			for(var i in values){
				//ctx.fillRect()
				ctx.fillStyle = "#F0F";
				ctx.font = "50px t"
				//ctx.fillText(Object.keys(values)[i]+" adw", 100, 100);
			}
			window.requestAnimationFrame(display);
		}
	};
	window.requestAnimationFrame(display)
}(load.c, load.state))