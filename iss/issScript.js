
$(document).ready(() => {
	updatePosition(1, ()=>{
		$("#centerSymbol").css("visibility", "visible")
	});
	$("#refresh").click(() => updatePosition())
});

function updatePosition(delay, callback){
	$("#refresh")[0].disabled = true;

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://api.open-notify.org/iss-now.json");
	xhr.responseType = "json";

	xhr.onload = function(){

		//If call to fetch iss coordinates succeded, send the logging request
		var today = new Date();
		var fullDate = today.getDate() + " " + today.getMonth() + " " + today.getFullYear();
		addCall.send(JSON.stringify({
			currentDate : fullDate,
			foo : 1
		}));

		//Parameters for map request
		var longitude = xhr.response.iss_position.longitude;
		var latitude = xhr.response.iss_position.latitude;
		var date = new Date(xhr.response.timestamp*1000);
		var zoom = 1;
		var timestamp = date.getFullYear()+"-" + date.getMonth()+1 +"-"+ date.getDate();
		timestamp += "  " + date.getHours() + ":" +("0"+date.getMinutes()).substr(-2) + ":" +("0"+date.getSeconds()).substr(-2);
		
		var url = "https://api.tomtom.com/map/1/staticimage?layer=basic&style=main&format=png&zoom="+zoom.toString()+"&center="+longitude.toString()+"%2C"+latitude.toString()+"&width=512&height=512&view=Unified&key=aqjXznxDEK3NfAg0iEqP3lq6HK5ahEch";
		$("#mapDiv").prepend($("<img id='preload' src='"+url+"'>"));
		
		//Delay helps hide a ripple effect when loading the new map
		setTimeout(()=>{
			$("#map").remove();
			$("#preload")[0].id ="map";
			$("#long")[0].innerHTML = longitude;
			$("#lat")[0].innerHTML = latitude;
			$("#timestamp")[0].innerHTML = timestamp;
			$("#refresh")[0].disabled = false;
			!callback || callback();
		}, delay || 700);
		
	}

	//Request to add one to the amount of calls today
	var addCall = new XMLHttpRequest();
	addCall.open("POST", "/iss/issApiCallsLogger.php");
	addCall.setRequestHeader("Content-Type", "json"); 
	addCall.responseType = "document";

	addCall.onload = () => {
		var amount = addCall.response.getElementById("amount").innerHTML;
		$("#calls")[0].innerHTML = amount;
	}

	//Fire away
	xhr.send();	
}