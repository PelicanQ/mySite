class Digit {
	constructor(pixelGrid, numValue){
		this.pixelGrid = pixelGrid;
		this.numValue = numValue;
		this.inputs = [];
		this.outputs = undefined;
		const side = pixelGrid.length
		for(let x = 0; x < side; x++){
			for(let y = 0; y < side; y++){
				this.inputs[x * side + y] = pixelGrid[x][y];
			}
		}
		if(numValue !== undefined){
			this.outputs = [];
			for(let i = 0; i < 10; i++){
				this.outputs[i] = 0;
			}
			this.outputs[numValue] = 1;
		}
	}
}