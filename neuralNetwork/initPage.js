//SETUP
function initPage(){

	costChart = new Chart($("#costChart"), {
		type : "line",
		data : {
			labels : [0],
			datasets : [{
				label : "Cost",
				backgroundColor : "rgba(40,255,40,0.8)",
				borderColor : "#5C5",
				borderWidth : 0.1,
				data : []
			}]
		},
		options : {
			responsive: true,
			scales: {
				xAxes: [{
					ticks: {
						fontColor : "#AAA",
						fontSize : 15,
						maxTicksLimit : 15
					}
				}],
				yAxes: [{
					type: "logarithmic",
					ticks: {
						fontColor : "#AAA",
						beginAtZero: true,
						callback : function(val, index){
							if(index % 2 == 0)
								return val;
						}
					}
				}]
			}
		}
	});
	window.addEventListener("resize", function(event){
		//$("#neuralCanvas")[0].width = $(".container").width()*0.7;
		//$("#neuralCanvas")[0].height = $(".container").height();
		//NN.refresh();
		//$("#costChart")[0].width = $(".container")[0].offsetWidth;
		//costChart.update();
	});
	
	$("#dataSelectInput")[0].max = (NN.trainingData.length-1).toString();
	
	//Now let's loop through and display all training digits
	//Canvas holder so jQuery doesn't append for every canvas
	var canvasHolders = [];
	for(let i = 0; i < 10; i++){
		canvasHolders[i] = $();	
	}
	
	for(let i = 0; i < NN.trainingData.length; i++){
		var digitCanvas = $("<canvas width='35' height='35'>");
		var whichDigit = NN.trainingData[i].numValue;
		canvasHolders[whichDigit] = canvasHolders[whichDigit].add(digitCanvas);
		digitCanvas.data("digitObject", NN.trainingData[i]);
		drawPreviewDigit(NN.trainingData[i], digitCanvas[0]);
	}
	canvasHolders.forEach((holder, i)=>{
		$("#digit" + i).append(holder);	
	})

	$("#allDigits").click(function(e){
		if(e.target.nodeName.toLowerCase() !== "canvas"){
			return;
		}
		var storedData = $(e.target).data();
		testWithExample(storedData.digitObject);

		$("#allDigits canvas").removeClass("currentTest");
		$(e.target).addClass("currentTest");
		setTestMethod("example");
	});

	$("#networkSelector").on("change", function(event){
		var selectedNetwork = listOfNetworks.find((net) => net.name === event.target.value);
		if(!selectedNetwork)
			return;
		switchNetwork(selectedNetwork);
	})
	$("#deleteButton").click(() => {
		//$("#selectNetwork").val("New").find("option:contains(Saved)").hide();
		//window.localStorage.removeItem("savedNNObj");
		//var newOne = new NeuralNetwork(); 
		//newOne.init();
		//switchNetwork(newOne);
		
	})

	$("#testCustom").click (() => {
		setTestMethod("custom");
	})

	$("#testExample").click(() => {
		setTestMethod("example");
		testWithExample($("#allDigits canvas").eq($("#dataSelectInput")[0].value).data().digitObject);
	})

	$("#dataSelectInput").on("input", function(event){
		var indexSelectedExample = parseInt(event.target.value);
		var selectedCanvas = $("#allDigits canvas").eq(indexSelectedExample);

		testWithExample(selectedCanvas.data().digitObject);
		
		$("#allDigits canvas").removeClass("currentTest");
		selectedCanvas.addClass("currentTest");
		
	});

	$("#trainButton").click(function(event){
		var times = parseInt($("#trainTimes")[0].value);
		if(typeof times !== "number" && times<=0){
			return;
		}
		train(times);
	});

	$("#cancelTrainingButton").on("click", function(event){
		if(!NN.currentlyTraining) 
			return;
		NN.backpropWorker.terminate();
		$("#trainingStatus")[0].innerHTML = "Cancelled";
		$("#closeButton")[0].disabled = false;
		$("#cancelTrainingButton")[0].disabled = true;
	});
	
	switchNetwork(NN);
	NN.refresh();
	draw(NN, ctx);
	setTestMethod("custom");
	
}