function setTestMethod(method){
	//Changes between the two ways of testing: Drawing custom digits, or loaded digits
	if(method == "custom"){
		$("#testCustom")[0].checked = true;
		$("#dataSelectInput").css("visibility", "hidden");
		$("#customDraw").css("display", "inline-block");
		$("#previewCanvas").css("display", "none");
		$("#drawingButtons").show();
	}
	else if(method == "example"){
		$("#testExample")[0].checked = true;
		$("#dataSelectInput").css("visibility", "visible");
		$("#customDraw").css("display", "none");
		$("#previewCanvas").css("display", "inline-block");
		$("#drawingButtons").hide();
	}
}
function testWithExample(digitObj){
	//calling will test neural network with one of trainingData digits

	drawPreviewDigit(digitObj, $("#previewCanvas")[0]);
	
	//$("#dataSelectIndex")[0].innerHTML = index;

	const [resultingDigit, cost] = NN.testWithDigit(digitObj);
	$("#outputDigit")[0].innerHTML = resultingDigit
	$("#costOfCurrentInput")[0].innerHTML = cost;
	draw(NN, ctx);
	
}

function testWithCustom(){
	var customDigit = new Digit(customGrid, undefined);
	var [outputDigit] = NN.testWithDigit(customDigit);

	$("#outputDigit")[0].innerHTML = outputDigit;
	draw(NN, ctx);
}

function drawPreviewDigit(digitObj, canvas){
	var miniCtx = canvas.getContext("2d");
	miniCtx.clearRect(0,0,canvas.width, canvas.height);

	var pixelSize = canvas.width/digitObj.pixelGrid.length;
	for(var x in digitObj.pixelGrid){
		for(var y in digitObj.pixelGrid[x]){
			miniCtx.fillStyle = "rgba(0,255,0, " + digitObj.pixelGrid[x][y] + ")"
			miniCtx.fillRect(parseInt(x)*pixelSize, parseInt(y)*pixelSize, pixelSize, pixelSize);
			
		}
	}
}

function clearCustomGrid(){
	for(var x in customGrid){
		for(var y in customGrid){
			customGrid[x][y] = 0;
		}
	}
	var c2 = $("#customDraw")[0];
	var ctx2 = c2.getContext("2d");
	ctx2.fillStyle = "#FFF"
	ctx2.fillRect(0,0, c2.width, c2.height);
}

function toggleTrainingStatus(IO){
	if(IO){
		$("#overlayMessage").css("opacity", "1");
		$("#overlayMessage").css("height", "100%");
		$("#overlayMessage div").removeClass("noHeight").addClass("fullHeight");
		
	}
	else {
		$("#overlayMessage div").removeClass("fullHeight").addClass("noHeight");
		$("#overlayMessage").css("opacity", "0");
		setTimeout(()=>{
			$("#overlayMessage").css("height", "0");
		},600)
		
	}

}
function switchNetwork(newNet){
	
	NN.replaceSelf(newNet);
	
	costChart.data.datasets[0].data = NN.costHistory.avrages;
	costChart.data.labels = NN.costHistory.avrages.map((val, i) => {
		return i
	});
	if(costChart.data.labels.length == 0) costChart.data.labels = [0];
	$("#networkSelector")[0].value = NN.name;
	$("#timesTrained")[0].innerHTML = NN.timesTrained;
	//$("#saveStatus")[0].innerHTML = newNet.name;
	costChart.update();
	draw(NN, ctx);

}
function saveNetwork(neuralNet){
	//window.localStorage.setItem("savedNNObj", JSON.stringify(NN));
	//alert(JSON.stringify(NN.weights).length)
/*
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://oggewatz.com/savedNeuralNetworks/handler.php");
	xhr.onload = ()=> console.log(xhr.response);
	xhr.onerror = xhr.ontimeout = ()=> console.log("something went wrong");
	var objToSend = {
		weights : neuralNet.weights,
		biases : neuralNet.biases
	};
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify(objToSend));*/
}
async function saveNeuralNet(){
	var password = "";
	if(NN.name === "New"){
		NN.name = prompt("Enter name of network");
	}
	if(!NN.name){
		alert("Weird... There was no name");
		return;
	}
	if(NN.name === "default"){
		password = prompt("Password needed. Users cannot save default network");
	} 
	
	await fetch(window.location.origin + "/savedNeuralNetworks/handler.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body : JSON.stringify({NN: NN, password: password})
	}).then((resp) => {
		if(!resp.ok){
			throw resp.statusText;
		}
		resp.text().then((text) => {
			alert(text);
		})
	}).catch((error) => {
		console.log("Saving failed ", error);
	});

	await getNeuralNets();

	switchNetwork(listOfNetworks[0]);

}	

function getNeuralNets(){
	return new Promise((resolve) => {
		fetch(window.location.origin + "/savedNeuralNetworks/handler.php?all=all")
		.then(response => response.json())
		.then(data => {
			data.forEach((fetchedNet) => {
				if(!listOfNetworks.find((net) => net.name === fetchedNet.name)){
					listOfNetworks.push(fetchedNet);
				}
			});

			$("#networkSelector").empty();
			listOfNetworks.forEach((net) => {

				$("#networkSelector").append("<option>" + net.name + "</option>");
			});
			resolve(data);
		})
	})		
}