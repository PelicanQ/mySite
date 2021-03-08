function DrawableCanvas(c, pixelsPerSide) {
	const ctx = c.getContext("2d");
	var mouseDown = false;
	var lastPoint1, lastPoint2;
	
	this.c = c;
	this.grid = [[]];
	for(var x = 0; x < pixelsPerSide; x++){
		this.grid[x] = [];
		for(var y = 0; y < pixelsPerSide; y++){
			this.grid[x][y] = 0;
		} 
	}

	this.pixelSize = function(){
		return c.width / pixelsPerSide;	
	}

	this.clear = () => {
		for(let x in this.grid){
			for(let y in this.grid[x]){
				this.grid[x][y] = 0;
			}
		}
		this.draw();
	};
	this.draw = (digitObj) => {
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0, 0, this.c.width, this.c.height);
		ctx.fillStyle = "#000";
		
		if(digitObj && typeof digitObj.pixelGrid !== "undefined"){
			this.grid = digitObj.pixelGrid;
		}
		for(let x in this.grid){
			for(let y in this.grid[x]){
				ctx.fillStyle = "rgba(0, 0, 0 ," + this.grid[x][y] + ")";
				ctx.fillRect(x * this.pixelSize()  , y * this.pixelSize(), this.pixelSize() * 0.95, this.pixelSize() * 0.95);
			}
		}
	};

	//Here comes 

	var pointOnLine = function(t, A, B){
		var midPoint = {
			x : A.x + t*(B.x-A.x),
			y : A.y + t*(B.y-A.y)
		}
		return midPoint;
	};

	this.c.addEventListener("mousedown", function(event){
		mouseDown = true;
		
	}); 
	this.c.addEventListener("mouseup", function(event){
		mouseDown = false;
		lastPoint1 = lastPoint2 = undefined;
	});
	this.c.addEventListener("mouseleave" , function(){
		mouseDown = false;
		lastPoint1 = lastPoint2 = undefined;
	})

	//Heres where the magic happens
	this.c.addEventListener("mousemove", (event)=>{
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
		
		if(Math.floor(event.offsetX/this.pixelSize()) == Math.floor(lastPoint1.x/this.pixelSize())){
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
			indX : Math.floor(point1.x/this.pixelSize()),
			indY : Math.floor(point1.y/this.pixelSize())
		})
		if(point1.x < lastPoint1.x){
			point1 = [lastPoint1, lastPoint1 = point1][0];
		}
		if(point2.y < lastPoint2.y){
			point2 = [lastPoint2, lastPoint2 = point2][0]
		}
		
		var firstYCut = {
			x: this.pixelSize() * Math.floor(lastPoint1.x/this.pixelSize()),
		 	y : pointOnLine((this.x -  lastPoint1.x)/(point1.x-lastPoint1.x), lastPoint1, point1).y	
		}
		
		var firstXCut = {
			
			y : this.pixelSize() * Math.floor(lastPoint2.y/this.pixelSize()),
			x : pointOnLine((this.y-lastPoint2.y)/(point2.x-lastPoint2.x), lastPoint2, point2).x
		}
				
		var lastCell1 = {
			x : firstYCut.x,
			y : firstYCut.y,
			indX : firstYCut.x/this.pixelSize(),
			indY : Math.floor(firstYCut.y/this.pixelSize())
		}

		var lastCell2 = {
			x : firstXCut.x,
			y : firstXCut.y,
			indX : Math.floor(firstXCut.x/this.pixelSize()),
			indY : firstXCut.y/this.pixelSize()
		}	
		intersectedCellsX.push(Object.assign({},lastCell1));
		while(lastCell1.x + this.pixelSize() < point1.x){
			var newX = lastCell1.x +  this.pixelSize();
			var newY = pointOnLine((newX-lastPoint1.x)/(point1.x-lastPoint1.x), lastPoint1, point1).y;

			lastCell1 = {
				x : newX, 
				y : newY,
				indX : newX/this.pixelSize(),
				indY: Math.floor(newY/this.pixelSize())
			}
			
			intersectedCellsX.push(Object.assign({},lastCell1));	
			
		}

		while(lastCell2.y + this.pixelSize() < point2.y){
			var newY = lastCell2.y + this.pixelSize();
			var newX =  pointOnLine((newY-lastPoint2.y)/(point2.y-lastPoint2.y), lastPoint2, point2).x
			lastCell2 = {
				x : newX,
				y : newY,
				indX : Math.floor(newX/this.pixelSize()),
				indY: Math.floor(newY/this.pixelSize())
			}	
			intersectedCellsY.push(Object.assign({},lastCell2));
		}
		

		for(var cell of intersectedCellsX){
			this.grid[cell.indX][cell.indY] = 1;
		}
		for(var cell of intersectedCellsY){
		
			this.grid[cell.indX][cell.indY] = 1;
		}

		if(event.offsetX < point1.x){
			point1 = [lastPoint1, lastPoint1 = point1][0];
		}
		if(event.offsetY < point2.y){
			point2 = [lastPoint2, lastPoint2 = point2][0];
		}
		lastPoint1 = Object.assign({}, point1);
		lastPoint2 = Object.assign({},point2);
		requestAnimationFrame(this.draw);
	});
}


