define(["preData", "state", "boxes", "script"], function(preData,state,boxes,script){
	var c = preData.c;
	var ctx = preData.ctx;
	return function(s, p){
		var lastTime = 0;
		var progress = undefined;
		var o; //Loop ID
		var v = 1; //So that the value can be remembered after state.draw has set the opacity to 100%
		console.log("Fade transition started");

		var loop = function(timestamp){
			progress = timestamp - lastTime
			if(progress>10){
				//console.log("Frame fired")
				ctx.globalAlpha = v < p ? 0 : v - p;
				lastTime = timestamp;
				v = ctx.globalAlpha;
				state.draw(state.last[state.last.length-1],true);
				for(var i in boxes){
					boxes[i].visible = false;
				}
			}
			if(v > 0){//still going
				o = window.requestAnimationFrame(loop);
			}
			else{
				ctx.globalAlpha = 1;
				window.cancelAnimationFrame(o);
				s();
				console.log("Fade transition done")
				
			}
        };
		window.requestAnimationFrame(loop);
		
	};
});
/*
//Snabb Fel  Drar mus över box
Fade transition started
Frame fired
State drawn
visible = false
State drawn

Box exited. Smallify
visible = true             <-- där blir den visible

Box entered. Biggify. Box.visible = true
State drawn
visible = true
In same box

//Långsam rätt
Fade transition started
visible = false
State drawn

Box exited. Smallify
Frame fired                   <-- Här blir det en frame innan som sätter
State drawn
visible = false

Frame fired
State drawn
visible = false
Frame fired
State drawn
visible = false
Frame fired
*/