var CONFIG = {
	pixels : 20
}
var trainingDigits = [];
var canvas;
var context;

$(document).ready(() => {
	//page setup
	canvas = $("#drawingBox")[0];
	context = canvas.getContext("2d");
	drawable = new DrawableCanvas(canvas, 20);
	context.fillStyle = "#000";
	context.font = "50px Arial"
	context.fillText("Draw digits here", canvas.width/2-context.measureText("Draw digits here").width/2, canvas.height/2);
	toggleSubmitResponse(0);
	
	window.addEventListener("keydown" , function(e){
		if(e.keyCode == 83){
			save();
		}
	});
});

function save(){
	
	//Find checked digit button => which digit to label inputs with
	var digit;
	var radioButtons = $(".digitRadioButton");
	for(var i = 0; i < radioButtons.length; i++){
		if(radioButtons[i].checked){
			digit = radioButtons[i].value;
			break;
		}
	}

	//Check if no digit is selected
	if(digit == undefined) {
		console.log("No digit selected!");
		if($(".noneSelected").length > 0) return;
		var span = $("<span class='noneSelected'>No digit selected!</span>")
		$("#saveButton").after(span);
		setTimeout(()=>{span.remove()}, 2000);
		return;
	} 

	//Make copy of grid, then place copy in the saved 
	var gridClone = copyDeepArray(drawable.grid);
	for(var x in drawable.grid){
		for(var y in drawable.grid[x]){
			gridClone[x][y] = drawable.grid[x][y];
		}
	}
	var outputs = [];
	for(var i = 0; i < 10; i++){
		outputs[i] = 0;
	}
	outputs[digit] = 1;
	trainingDigits.push({pixels : gridClone, outputs})
	
	//Draw a small preview of this digit to previewDiv
	var miniCanvas = $("<canvas width='50' height='50' class='previewCanvas'>");
	$("#digit" + digit.toString()).append(miniCanvas); 
	console.log(miniCanvas);
	var miniCtx = miniCanvas[0].getContext("2d");
	miniCtx.fillStyle = "#FFF";
	miniCtx.fillRect(0, 0,miniCanvas[0].width, miniCanvas[0].height);
	
	for(var x in gridClone){
		for(var y in gridClone[x]){
			miniCtx.fillStyle = "rgba(0,0,0," + (gridClone[x][y]).toString()+")";
			miniCtx.fillRect(x*50/CONFIG.pixels, y*50/CONFIG.pixels, 50/CONFIG.pixels, 50/CONFIG.pixels);
		}
	}
	
	//Clear the grid which is being drawn on
	drawable.clear();
}

function sendTrainingData(){ 
	//Make HTTP POST request and send full trainingDigits array to server for storing
	var xhr = new XMLHttpRequest();
	xhr.open("POST", location.origin+"/trainingData/trainingDataHandler.php");
	
	xhr.onload = () => {
		console.log(xhr.response.body);
		$("#response")[0].innerHTML = xhr.response;
	}
	xhr.onerror = ()=>{
		$("#response")[0].innerHTML = "Something went wrong";	
	}
	xhr.send(JSON.stringify(trainingDigits));
	
	toggleSubmitResponse(1);


}
function toggleSubmitResponse(IO){
	//Toggles a drop down screen when saving digits to server
	if(IO){
		$("#submitResponse").show();
		$("#submitResponse").css("opacity", "1");
		$("#submitResponse").css("height", "100%")
		$("#submitResponse div").removeClass("noHeight").addClass("fullHeight");
	}
	else {
		$("#submitResponse div").removeClass("fullHeight").addClass("noHeight");
		$("#submitResponse").css("opacity", "0");
		setTimeout(()=>{
			$("#submitResponse").hide();
		}, 600)
	}
}
