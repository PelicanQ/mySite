function sigmoid(x){
	return 1/(1+Math.pow(Math.E, -x));
}
function sigmoidPrime(x){
	return Math.pow(Math.E, -x)/Math.pow(1+Math.pow(Math.E,-x),2)

}
function copyDeepArray(array, endVal){
	const clone = [];
	var iterate = (arr, partOfClone) => {
		for(var i = 0, iLen = arr.length; i < iLen; i++){
			if(!Array.isArray(arr[i])){
				partOfClone[i] = endVal || arr[i];
				return;
			}
			partOfClone[i] = [];			
			iterate(arr[i], partOfClone[i]);
		}
	};
	iterate(array, clone);
	return clone;
}

function tripleDeep(arr, callback){
	for(var i = 0, iLen = arr.length; i < iLen; i++){
		for(var t = 0, tLen = arr[i].length; t < tLen; t++){
			for(var n = 0, nLen = arr[i][t].length; n < nLen; n++){
				callback(arr[i][t][n], i, t, n);
			}
		}
	}
} 
function calcCost(net, oneTrainingData){
	var cost = 0;
	var L = net.length-1;
	for(var t = 0, tLen = net[L].length; t < tLen; t++){
		var singleNodeCost = (net[L][t].activation - oneTrainingData.outputs[t])* (net[L][t].activation - oneTrainingData.outputs[t]);
		cost += singleNodeCost;
		
	}
	return cost;
}