var makeDrawingBox = function(c, pixelsPerSide){
	var config = {
		pixels : pixelsPerSide,
		pixelSize : function(){return c.width/this.pixels}
	};
	var grid = [[]];
	for(var x = 0; x< config.pixels; x++){
		grid[x] = [];
		for(var y = 0; y < config.pixels; y++){
			grid[x][y] = 0;
		} 
	}
	var mouseDown = false;
	
	var lastPoint1, lastPoint2;

	var ctx = c.getContext("2d");
	
	var pointOnLine = function(t, A, B){
		var midPoint = {
			x : A.x + t*(B.x-A.x),
			y : A.y + t*(B.y-A.y)
		}
		return midPoint;
	}

	var draw = function(){
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0,0, c.width, c.height);
		ctx.fillStyle = "#000";
		for(var x in grid){
			for(var y in grid[x]){
				ctx.fillStyle = "rgba(0, 0,0 ," + grid[x][y] + ")";
				ctx.fillRect(x *  config.pixelSize()  , y * config.pixelSize(), config.pixelSize()*0.95, config.pixelSize()*0.95);
			}
			
		}
	}
	draw();//Clear canvas
	c.addEventListener("mousedown", function(event){
		mouseDown = true;
		
		
	}); 
	c.addEventListener("mouseup", function(event){
		mouseDown = false;
		lastPoint1 = lastPoint2 = undefined;
		
	});
	c.addEventListener("mouseleave" , function(){
		mouseDown = false;
		lastPoint1 = lastPoint2 = undefined;
		
		//draw();
	})
	//Heres where the magic happens
	c.addEventListener("mousemove", function(event){
		if(!mouseDown) return;
		
		if(event.offsetX < 0 || event.offsetY < 0 || event.offsetX >= c.width || event.offsetY >= c.height) {
			mouseDown = false;
			lastPoint1 = lastPoint2 = undefined;
			return;
		}

		if(!lastPoint1){
			lastPoint1 = {
				x : event.offsetX, 
				y : event.offsetY
			}
			lastPoint2 = Object.assign({},lastPoint1);
			return;
		}
		
		//console.log(lastPoint1.x + " a "+event.offsetX);
		if(Math.floor(event.offsetX/config.pixelSize()) == Math.floor(lastPoint1.x/config.pixelSize())){
			//return;
		}

		var point1 = {
			x : event.offsetX, 
			y : event.offsetY
		};
		var point2 = Object.assign({},point1);
		var intersectedCellsX = [];
		var intersectedCellsY = [];
		intersectedCellsX.push({
			indX : Math.floor(point1.x/config.pixelSize()),
			indY : Math.floor(point1.y/config.pixelSize())
		})
		if(point1.x < lastPoint1.x){
			point1 = [lastPoint1, lastPoint1 = point1][0];
		}
		if(point2.y < lastPoint2.y){
			point2 = [lastPoint2, lastPoint2 = point2][0]
		}
		
		var firstYCut = {
			x: config.pixelSize() * Math.floor(lastPoint1.x/config.pixelSize()),
		 	y : pointOnLine((this.x -  lastPoint1.x)/(point1.x-lastPoint1.x), lastPoint1, point1).y	
		}
		
		var firstXCut = {
			
			y : config.pixelSize() * Math.floor(lastPoint2.y/config.pixelSize()),
			x : pointOnLine((this.y-lastPoint2.y)/(point2.x-lastPoint2.x), lastPoint2, point2).x
		}
				
		var lastCell1 = {
			x : firstYCut.x,
			y : firstYCut.y,
			indX : firstYCut.x/config.pixelSize(),
			indY : Math.floor(firstYCut.y/config.pixelSize())
		}

		var lastCell2 = {
			x : firstXCut.x,
			y : firstXCut.y,
			indX : Math.floor(firstXCut.x/config.pixelSize()),
			indY : firstXCut.y/config.pixelSize()
		}	
		intersectedCellsX.push(Object.assign({},lastCell1));
		while(lastCell1.x + config.pixelSize() < point1.x){
			var newX = lastCell1.x +  config.pixelSize();
			var newY = pointOnLine((newX-lastPoint1.x)/(point1.x-lastPoint1.x), lastPoint1, point1).y;

			lastCell1 = {
				x : newX, 
				y : newY,
				indX : newX/config.pixelSize(),
				indY: Math.floor(newY/config.pixelSize())
			}
			
			
			intersectedCellsX.push(Object.assign({},lastCell1));	
			
		}

		while(lastCell2.y + config.pixelSize() < point2.y){
			var newY = lastCell2.y + config.pixelSize();
			var newX =  pointOnLine((newY-lastPoint2.y)/(point2.y-lastPoint2.y), lastPoint2, point2).x
			lastCell2 = {
				x : newX,
				y : newY,
				indX : Math.floor(newX/config.pixelSize()),
				indY: Math.floor(newY/config.pixelSize())
			}	
			intersectedCellsY.push(Object.assign({},lastCell2));
		}
		

		for(var cell of intersectedCellsX){
			//console.log(cell.indX)
			grid[cell.indX][cell.indY] = 1;
		}
		for(var cell of intersectedCellsY){
		
			grid[cell.indX][cell.indY] = 1;
		}

		if(event.offsetX < point1.x){
			point1 = [lastPoint1, lastPoint1 = point1][0];
		}
		if(event.offsetY < point2.y){
			point2 = [lastPoint2, lastPoint2 = point2][0];
		}
		lastPoint1 = Object.assign({}, point1);
		lastPoint2 = Object.assign({},point2);
		requestAnimationFrame(draw);
	});
	return grid;
}