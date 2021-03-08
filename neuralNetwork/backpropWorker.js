importScripts("refresh.js", "/myLib.js", "neuralNetworkConstructor.js");
const NN = new NeuralNetwork();


onmessage = function(e){
	if(e.data === "cancel"){
		postMessage({status : "cancelled"});
		close();
	}
	//var {network, weights, biases, trainingData} = e.data;
	NN.network = e.data.network;
	NN.weights = e.data.weights;
	NN.biases = e.data.biases;
	NN.trainingData = e.data.trainingData;
	var singleBackpropCosts = [];
	for(var i = 0; i < e.data.times; i++){
		singleBackpropCosts[i] = backprop();
		(i % 4 === 0) && postMessage({
			status: "inProgress",
			completed: i+1,
			total: e.data.times
		})
	}
	postMessage({
		status: "inProgress",
		completed: i,
		total: e.data.times
	})
	postMessage({
		weights : NN.weights,
		network : NN.network,
		singleBackpropCosts : singleBackpropCosts,
		status : "done"

	});
}

function backprop(){
	var Gradient = function(endVal){
		//endVal is the value to place at the bottom
		this.weights =  copyDeepArray(NN.weights, endVal);//3D
		this.biases = copyDeepArray(NN.network, endVal); //2D
		this.biases[0] = [];//Because theres no bias on the input layer
	}
	
	var totalGradient = new Gradient(0);
	var singleDataGradients = [];
	var avrageCost = 0;
	for(var i = 0, iLen = NN.trainingData.length; i < iLen; i++){//Trainingdata
		
		//Set all inputs acordingly
		NN.setInputs(NN.trainingData[i].inputs);
		
		/*for(var t = 0, tLen = trainingData[i].inputs.length; t < tLen; t++){
			NN.network[0][t].activation = trainingData[i].inputs[t];
		}*/

		//Run the weighted sum function 
		NN.refresh();
	
		singleDataGradients[i] = new Gradient();
		var dCost_dActivations = copyDeepArray(NN.network, 0);
		var lastLayer = NN.network.length-1;
	
		//First add dCost_dActivation of last layer neurons to array. We know these and they will be used when defining dC_dW
		for(var n = 0, nLen = NN.network[lastLayer].length; n < nLen; n++){
			dCost_dActivations[lastLayer][n] = 2*(NN.network[lastLayer][n].activation - NN.trainingData[i].outputs[n]); 	
			
		}
	
		//Now lets start at the last layer and propagate backwards!! Thats how we find the derivatives
		for(var L = NN.network.length-1; L > 0; L--){
			var frontLayer = L;
			//Here we compute derivate of Cost with respect to weights and biases
			for(var j = 0, jLen = NN.network[frontLayer].length; j<jLen; j++){//Iterate through frontLayer neurons
				var cacheVar = Math.pow(Math.E,-NN.network[frontLayer][j].weightedSum);
				NN.network[frontLayer][j].cachedSigmoidPrime = cacheVar/((1+cacheVar)*(1+cacheVar))
				
				var dCost_dBias =  1 * NN.network[frontLayer][j].cachedSigmoidPrime * dCost_dActivations[frontLayer][j];
				singleDataGradients[i].biases[frontLayer][j] = dCost_dBias;
				
				for(var k = 0, kLen = NN.network[frontLayer-1].length; k < kLen; k++){//Iterate through previous layer neurons

					var dCost_dWeight = NN.network[frontLayer-1][k].activation * 
						NN.network[frontLayer][j].cachedSigmoidPrime*
						dCost_dActivations[frontLayer][j];
					
					singleDataGradients[i].weights[frontLayer-1][k][j] = dCost_dWeight;					
				}
			}
			//Before moving to previous layer, lets compute dCost_dActivation of the prev neurons
			//Iterate through back neurnons
			for(var k = 0, kLen = NN.network[frontLayer-1].length; k < kLen; k++){
				dCost_dActivations[frontLayer-1][k] = 0;
				//iterate through front neurons
				for(var j = 0, jLen = NN.network[frontLayer].length; j < jLen; j++){
					dCost_dActivations[frontLayer-1][k] += NN.weights[frontLayer-1][k][j] * NN.network[frontLayer][j].cachedSigmoidPrime * dCost_dActivations[frontLayer][j];
					//console.log(dCost_dActivations[frontLayer-1][k]+" "+trainingData[i].outputs[j]+ " "+ j);
				}
			}
		}
	
	}
	//Here we add all weights and biases of singleDataGradients to a totalGradient
	//singleDataGradients.forEach(gradient => tripleDeep(gradient.weights, (wei, x, y, z) => weights[x][y][z] -= wei/trainingData.length)); 
	for(var i = 0, iLen = singleDataGradients.length; i < iLen; i++){
		tripleDeep(singleDataGradients[i].weights, (wei, x, y, z) => NN.weights[x][y][z] -= wei/NN.trainingData.length);
	}
	//biases.forEach((a, x) => a.forEach((bias, y)=> singleDataGradients.forEach((gradient)=> bias -= gradient.biases[x][y]/trainingData.length)));
	//singleDataGradients.forEach((gradient) => gradient.biases.forEach((a, x) => a.forEach((bias, y)=> biases[x][y] -= bias/trainingData.length))); 
	for(var i = 0, iLen = singleDataGradients.length; i < iLen; i++){
		for(var x = 0, xLen = singleDataGradients[i].biases.length; x < xLen; x++){
			for(var y = 0, yLen = singleDataGradients[i].biases[x].length; y < yLen; y++){
				NN.biases[x][y] -= singleDataGradients[i].biases[x][y]/NN.trainingData.length;	
			}
		}
	}
	//tripleDeep(weights, (wei, x, y, z)=> weights[x][y][z] -= totalGradient.weights[x][y][z]);
	//biases.forEach((a, x) => a.forEach((bias, y) => biases[x][y] -= totalGradient.biases[x][y]));
	
	var singleDataCosts = [];
	var avrageCost;
	for(var i in NN.trainingData){
		for(var t in NN.trainingData[i].inputs){
			NN.network[0][t].activation = NN.trainingData[i].inputs[t];
		}
		NN.refresh();
		
		var cost = 0;
		var L = NN.network.length-1;
		for(var t = 0, tLen = NN.network[L].length; t < tLen; t++){
			cost += (NN.network[L][t].activation - NN.trainingData[i].outputs[t])* (NN.network[L][t].activation - NN.trainingData[i].outputs[t]);
			
		}

		singleDataCosts[i] = cost;
	}
	singleDataCosts.forEach(num=>avrageCost+=num);
	avrageCost /= NN.trainingData.length;
	return avrageCost;
}
