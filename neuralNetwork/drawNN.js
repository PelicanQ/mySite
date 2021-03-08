function draw(NNobj, ctx){
	//Clear canvas
	const c = ctx.canvas;
	ctx.fillStyle = "rgba(255,255,255,0.94)";
	ctx.fillRect(0,0, c.width, c.height);
	ctx.fillStyle="#000";
	ctx.translate(50, 50);
	
	const network = NNobj.network;
	const weights = NNobj.weights;

	//Draw Weights
	for(var i = 0; i < weights.length; i++){
		for(var t = 0; t< weights[i].length; t++){
			for(var z = 0; z < weights[i][t].length; z++){
				var thisWeight = weights[i][t][z];
				if(thisWeight<0){
					ctx.strokeStyle = "rgba(255,0,0,"+0.2+")";
				}
				else {
					ctx.strokeStyle = "rgba(0,255,0, "+0.2+")";
				}
				ctx.lineWidth = 1 
				ctx.beginPath();
				ctx.moveTo(network[i][t].x*xscale,network[i][t].y*yscale);
				ctx.lineTo(network[i+1][z].x*xscale, network[i+1][z].y*yscale);
				ctx.stroke();
			}
			
		}
	}
	//Draw nodes
	for(var i = 0; i < network.length; i+=1){
		
		for(var t = 0; t< network[i].length; t++){
			var x = network[i][t].x*xscale;
			var y = network[i][t].y*yscale;
			ctx.lineWidth = 1.5;
			ctx.strokeStyle = "#000";
			ctx.beginPath();
			ctx.arc(x, y, 10, 0, 2*Math.PI);
			ctx.fillStyle = "#FFF";
			ctx.fill();
			ctx.fillStyle = "rgba(0,255,255,"+network[i][t].activation.toString()+")";
			ctx.fill();
	
			ctx.stroke();
			
			ctx.fillStyle = "#000";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.font = "17px Arial";
			//ctx.fillText((Math.round(network[i][t].activation*1000)/1000).toString()+"           "
			//+(Math.round(network[i][t].bias*100)/100).toString(), x, y);
			
			
		}
	}
	ctx.fillStyle = "#000";
	//ctx.fillText(vals.avrageCost(), c.width-500, c.height - 300)
	ctx.translate(-50,-50);
}
