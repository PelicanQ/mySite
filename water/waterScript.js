var dottingElements = [];
function init(){
	getTemperature();
	getFanStatus();
	getValveInfo()
	//setInterval(getTemperature, 600);			
}


function playDots(elm){
	setInterval(() => {
		elm[0].innerHTML = ".";
		setTimeout(()=>{elm[0].innerHTML = ".."}, 500);
		setTimeout(()=>{elm[0].innerHTML = "..."}, 1000);	
	}, 1500);

}
function stopDots(elm) {
	elm.replaceWith("<span class='dotsSpan'></span>");
	return;
}		

function getTemperature(){
	playDots($("#tempCard .dotsSpan"));
	$("#sensorStatus")[0].innerHTML = "Connecting";
	$("#sensorStatus").css("color", "unset");

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://oggewatz.com:81");
	xhr.responseType = "document";

	xhr.onload = () => {
		console.log(xhr.response);
		stopDots($("#tempCard .dotsSpan"));
		$("#sensorStatus")[0].innerHTML = "Online";
		$("#sensorStatus").css("color", "#0E0");
		$("#value")[0].innerHTML = xhr.response.getElementById("value").innerHTML;
	};
	xhr.timeout = 4000;
	xhr.onerror = () => {
		console.log("error");
		stopDots($("#tempCard .dotsSpan"));
		$("#sensorStatus")[0].innerHTML = "No Connection";
		$("#sensorStatus").css("color", "#F10");
		
	};
	xhr.ontimeout = xhr.onerror;
	xhr.send();
}
function getFanStatus(){
	$("#fanStatus").css("color", "unset");
	$("#fanStatus")[0].innerHTML = "Connecting";

	playDots($("#fanCard .dotsSpan"));
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://oggewatz.com:81");
	xhr.responseType = "text";
	xhr.timeout = 4000;
	xhr.onload = () => {
		console.log("Esp reponse : ");
		console.log(xhr.response);
		stopDots($("#fanCard .dotsSpan"));
		var resp = xhr.response.toLowerCase();
		if(resp.indexOf("off") > -1){
			$("#fanStatus")[0].innerHTML = "Off";
		}
		else if(resp.indexOf("on")){
			$("#fanStatus")[0].innerHTML = "On";
		}
	}
	xhr.onerror = () => {
		stopDots($("#fanCard .dotsSpan"));
		$("#fanStatus")[0].innerHTML = "No Connection";
		$("#fanStatus").css("color", "#F10");
	}
	xhr.ontimeout = xhr.onerror;
	xhr.send();
}
function toggleFan(state){
	if(state !== 0 && state !== 1){
		throw "int 1 or 0 not passed as arguments"; 
		return;
	}
	$("#fanStatus").css("color", "unset");
	$("#fanStatus")[0].innerHTML = "Turning " + ((state)? "on" : "off");
	playDots($("#fanCard .dotsSpan"));

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://oggewatz.com:81");
	xhr.timeout = 4000;
	xhr.setRequestHeader("Content-Type", "text/plain");
	xhr.responseType = "text";

	xhr.onload = () => {
		console.log("From ESP " + xhr.response);
		stopDots($("#fanCard .dotsSpan"));
		var resp = xhr.response.toLowerCase();
		if(resp.indexOf("off") > -1){
			$("#fanStatus")[0].innerHTML = "Off";
		}
		else if(resp.indexOf("on")){
			$("#fanStatus")[0].innerHTML = "On";
		}
	}
	xhr.onerror = () => {
		stopDots($("#fanCard .dotsSpan"));
		getFanStatus();
	}
	xhr.ontimeout = xhr.onerror;
	xhr.send(state);
	console.log("sending " + state);
}


function getValveInfo(){
	playDots($("#valveCard .dotsSpan"))
	var xhr = new XMLHttpRequest()
	xhr.open("GET", "http://oggewatz.com:82");
	xhr.responseType = "document";
	xhr.onload = ()=> {
		$("#valveStatus")[0].innerHTML= "Online";

		var voltString = xhr.response.getElementById("espVoltage").innerHTML;
		var voltage = parseFloat(voltString.substring(voltString.indexOf(":")+1, voltString.indexOf("(")).trim());
		$("#voltage")[0].innerHTML = voltage;

		var mode = xhr.response.getElementById("espMode").innerHTML;
		$("#valveMode")[0].innerHTML = mode;

		if(mode.toLowerCase() === "auto"){
			var timeString = xhr.response.getElementById("espTimeRemain").innerHTML;
			var timeUntilNext = parseInt(timeString.substring(0, timeString.indexOf("m") - 1).trim());//Milliseconds from ESP!!!!
			var clockTime = new Date(Date.now() + timeUntilNext);
			$("#nextSpray")[0].innerHTML = clockTime.toLocaleTimeString() +  " " + clockTime.toLocaleDateString();
			
		}
	}
	xhr.onerror = () => {
		stopDots($("#valveCard .dotsSpan"));
		$("#valveStatus")[0].innerHTML = "No Connection";
		$("#valveStatus").css("color", "#F10");
	}
	xhr.send();
	
}

function flip(toBack){
	if(toBack)
		$("#valveCard").css("transform", "rotateY(180deg)");
	else 
		$("#valveCard").css("transform", "rotateY(0deg)");
}
function sendParams(){
	var period = parseInt($("#periodTime")[0].value),
	interval = parseInt($("#intervalTime")[0].value)*3600,
	pass = $("#valvePassword")[0].value;

	//Trying fetch API, although it seems somewhat exeperimental
	fetch("http://oggewatz.com:82", {
		method: "post",
		body: "setInterval:" +period+ "/" +interval+ "#" +pass+ ";"
	}).then((r)=>r.text().then((text)=>{
		alert(text);
	}));
}

function toValve(data){
	if(data == "toggle"){
		data = (mode == "auto") ? "setState:manual;" : "setState:auto;";
	}
	fetch("http://oggewatz.com:82", {
		method : "post",
		body : data
	}).then((r)=>{
		r.text().then((t)=>{
			alert(t);
		})
	});
}