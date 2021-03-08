<!DOCTYPE html>
<html>
<head>
	<?php 
	$root = $_SERVER["DOCUMENT_ROOT"];
	include($root . "/modules/head.php");?>
	<script src="issScript.js"></script>
	<link rel="stylesheet" type="text/css" href="/stylesheets/issStyle.css">
</head>
<body>
	<?php include($root . "/modules/topbar.php");?>
	<div class="container">
		<div id="position" class="genericContainer">
			<div>
				<p class="header2" id="issHeader">Current Coordinates of ISS</p>
				<p class="line">Latitude: <span id="lat"></span></p>
				<p class="line">Longitude: <span id="long"></span></p>
				<p class="line">Updated: <span id="timestamp"></span><input id="refresh" type="image" src="/images/refresh.png"></input></p>
				
			</div>

			<div id="apiInfo">

				<p>ISS Coordinates fetched from <a href="http://api.open-notify.org/">api.open-notify.org</a></p>
				<p>Map is loaded from <a href="https://www.tomtom.com/en_us/drive/maps-services/maps/">TomTom</a></p>
				<p>TomTom allows 2500 free requests daily. Today there have been <span id="calls"></span> / 2500 Requests</p>
			</div>

		</div>
		<div id="mapContainer">
			<div id="mapDiv">
				<img id="map" hidden>
				<img id="centerSymbol" src="/images/crosshair.png">
			</div>

			<div id="lower">
				
				
				
			</div>
		</div>
	</div>
	

</body>
</html>