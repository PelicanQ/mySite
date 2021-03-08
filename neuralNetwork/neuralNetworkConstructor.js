function NeuralNetwork(name = "New"){
	this.name = name;
	this.network = [[]];
	this.weights = [];
	this.biases = [];
	this.trainingData = [];
	this.backpropWorker = {};
	this.costHistory = {
		avrages : []
	}
	this.currentlyTraining = false;
	this.timesTrained = 0;
	this.CONFIG  = {
		layers : 4,
		nodesPerHidden : 16,
		inputs : 20*20,
		outputs : 10,
		maxBias : 1,
		maxWeight : 1

	};

	this.init = function(){
		const network = this.network;
		const weights = this.weights;
		const biases = this.biases;
		//Add nodes to the first layer
		for(var i = 0; i < this.CONFIG.inputs; i++){
			network[0][i] = new Node(0, i);
			//first layer doesnt have biases
		}
		//Add hidden hidden layers and their nodes
		for(var i = 1; i < this.CONFIG.layers-1; i++){
			network[i] = [];
			biases[i] = [];
			for(var t = 0; t < this.CONFIG.nodesPerHidden; t++){
				network[i][t] = new Node(i, t);
				biases[i][t] = 2 * this.CONFIG.maxBias * (Math.random() - 0.5);
			}
		}
		//Add outputs (last Layer)
		network.push([]);
		biases.push([]);
		for(var i = 0; i < this.CONFIG.outputs; i++){
			network[network.length-1][i] = new Node(network.length-1, i); 
			biases[network.length-1][i] = 2*this.CONFIG.maxBias * (Math.random()-0.5);
		}
		
		//Add weights to weights array
		for(var i = 0; i < network.length-1; i++){
			weights[i] = [];
			for(var g = 0; g < network[i].length; g++){
				weights[i][g] = [];
				for(var t = 0; t < network[i+1].length; t++){
					weights[i][g][t] = this.CONFIG.maxWeight*2*(Math.random()-0.5); 	
				}
				
			}
		}
	}

	this.setTrainingData = (digitObjs) => {
		this.trainingData = digitObjs;
	};

	this.setInputs = (inputArr) => {
		for(let i = 0; i < this.network[0].length; i++){
			this.network[0][i].activation = inputArr[i];
		} 
	}

	this.refresh = () => {
		const network = this.network;
		//Calculate weighted sums. Inputs should already be set
		for(var i = 1, iLen = network.length; i < iLen; i++){	
			for(var t = 0, tLen = network[i].length; t < tLen; t++){
				network[i][t].activation = 0;
				for(var r = 0, rLen = network[i-1].length; r < rLen; r++){
					network[i][t].activation += network[i-1][r].activation * this.weights[i-1][r][t];	
				}
				network[i][t].weightedSum =  network[i][t].activation + network[i][t].bias;
				network[i][t].activation = 1/(1+Math.pow(Math.E, -network[i][t].weightedSum));//Sigmoid
			}
		}
	}

	this.backprop = (times = 1, onOneBackprop) => {//this has to be arrow function for inside "this" to point beyond this method
		if(this.currentlyTraining){
			console.log("This network is training, don't disturb it");
			return;
		}
		this.currentlyTraining = true;
		this.backpropWorker = new Worker("./backpropWorker.js");

		//Post all necessary data to WebWorker thread
		this.backpropWorker.postMessage({
			network : this.network,
			weights : this.weights,
			biases : this.biases,
			trainingData : this.trainingData,
			times : times
		});

		//Return a promise that resolves when all backpropagations are done in WorkerThread
		return new Promise((resolve, reject) => {//arrow function to allow "this" to rise
			const previousTimesTrained = this.timesTrained;
			this.backpropWorker.onmessage = (e) => {
				if(e.data.status === "inProgress"){
					this.timesTrained = e.data.completed + previousTimesTrained;
					onOneBackprop(e.data);	
				}
				if(e.data.status === "cancelled"){
					this.currentlyTraining = false;
					reject();
				}
				else if(e.data.status === "done"){
					//this.costHistory.avrages = this.costHistory.avrages.concat(e.data.singleBackpropCosts);
					e.data.singleBackpropCosts.forEach(cost =>
						this.costHistory.avrages.push(cost)
					);
					this.timesTrained = previousTimesTrained + times;
					this.currentlyTraining = false;
					this.network = e.data.network;
					this.weights = e.data.weights;
					this.backpropWorker.terminate();
					resolve();
				}
			};

		});
	
	};

	this.testWithDigit = (digitObj) => {
		this.setInputs(digitObj.inputs)
		this.refresh();
		
		var outputNeurons = this.network[this.network.length-1];
		var largestActivation = {
			value: outputNeurons[0].activation,
			index : 0
		}
		for(var i = 0, iLen = outputNeurons.length; i < iLen; i++){
			if(outputNeurons[i].activation > largestActivation.value){
				largestActivation.value = outputNeurons[i].activation;
				largestActivation.index = i;

			}	
		}	
		if(digitObj.numValue === undefined){	
			return [largestActivation.index];
		}
		var cost = 0;
		const L = this.network.length-1;
		const outputs = digitObj.outputs;
		for(var t in this.network[L]){
			cost += Math.pow(this.network[L][t].activation - outputs[t], 2); 
		}
	
		return [largestActivation.index, cost];
	};

	this.replaceSelf = (newNet) => {
		//Gut and replace but leave trainingData
		this.name = newNet.name;
		this.weights = newNet.weights;
		this.network = newNet.network;
		this.timesTrained = newNet.timesTrained;
		this.costHistory = newNet.costHistory;
		this.backpropWorker = {};
	};
}

function Node(x, y, bias){
	this.x = x;
	this.y = y;
	this.activation = Math.random();
	this.bias = bias || 0;
	this.weightedSum;
}