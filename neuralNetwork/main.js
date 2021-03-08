
//Global variables, Could use requireJS
const xscale = 100;
const yscale = 25;
var costChart; 
var c, ctx;
var customGrid;
const trainingLogs = [];
const INFO = {
	usingSavedNetwork : false
}
const listOfNetworks = [];	//object containing neuralNets created by user or from server
const NN = new NeuralNetwork();	//NN is the one referenced and used
const blankNN = new NeuralNetwork("New");

NN.init();
blankNN.init();
listOfNetworks.push(blankNN);

$(document).ready(() => {
	//Set up page
	c = document.getElementById("neuralCanvas");
	ctx = c.getContext("2d");
	customGrid = makeDrawingBox($("#customDraw")[0], 20);
	ctx.font = "40px Arial";
	ctx.fillText("Loading", c.width/2-ctx.measureText("Loading").width/2, c.height/2);

	//Fetch training data and default neuralNet (already trained)
	Promise.all([
			getNeuralNets(),
			fetch(window.location.origin + "/trainingData/trainingDataHandler.php").then(r => r.json())
	]).then((jsons) => {
		const defaultNet = jsons[0].find((network) => network.name === "default");
		if(defaultNet){
			NN.replaceSelf(defaultNet);	
		}

		var bareDigits = jsons[1];
		var digitObjects = bareDigits.map((bareDigit) => new Digit(bareDigit.pixels, bareDigit.outputs.indexOf(1)));
		NN.setTrainingData(digitObjects);
		
		//After we've gotten training examples we set event listeners and such
		initPage();
	}).catch(() => {
		alert("Ouchie something not good");
	})
});

async function train(times = 1){
	//here we train our neural network
	if(NN.trainingData[0].inputs.length !==  NN.CONFIG.inputs || NN.trainingData[0].outputs.length !== NN.CONFIG.outputs){
		alert("training data inputs or outputs not matching neural network in/outputs");
		return;
	}

	//UI Stuff
	toggleTrainingStatus(1);
	$("#trainingStatus")[0].innerHTML = "Training";
	$("#numberOfCompleted")[0].innerHTML = "0/" + times.toString();
	$("#progressBar div").css("width", "0%");
	$("#closeButton")[0].disabled = true;
	$("#cancelTrainingButton")[0].disabled = false;
	
	//var T = performance.now();
	//Now for the actual training
	await NN.backprop(times, (data) => {
		$("#timesTrained")[0].innerHTML = NN.timesTrained;
		$("#numberOfCompleted")[0].innerHTML = data.completed.toString() + "/" + data.total.toString();
		var progress = data.completed/data.total;
		$("#progressBar div").css("width", (progress*100).toString()+ "%");

	});
	//console.log(`That took ${performance.now() - T}`);

	//$("#numberOfCompleted")[0].innerHTML = times.toString() + "/" +times.toString();
	//More UI Stuff
	$("#trainingStatus")[0].innerHTML = "Done!";	
	$("#avrageCost")[0].innerHTML = NN.costHistory.avrages[NN.costHistory.avrages.length-1];
	$("#closeButton")[0].disabled = false;
	$("#cancelTrainingButton")[0].disabled = true;
	
	//Add x values
	for(var i = 0; i < times; i++){
		costChart.data.labels.push(costChart.data.labels[costChart.data.labels.length-1]+1);
	}

	costChart.data.datasets[0].data = NN.costHistory.avrages;
	costChart.update();
	draw(NN, ctx);
}

function LogRecord() {
	this.avrageCost = 0;
	this.costs;
}