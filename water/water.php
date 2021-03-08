<!DOCTYPE html>
<html>
<head>
	<?php 
	$root = $_SERVER["DOCUMENT_ROOT"];
	include($root . "/modules/head.php"); ?>
	<link rel="stylesheet" type="text/css" href="/stylesheets/tempStyle.css">
	<script src="waterScript.js"></script>
</head>

<body onload="init()">

	<?php include($root . "/modules/topbar.php"); ?>

	<div class="infoRow">
		<h1>Room</h1>

		<div class="horizontalCenter">
			<div class="verticalSeparate infoBox genericContainer" id="tempCard">
				<div>
					<h2>Temperature</h2><img src="/images/temp.png" class="moduleIcon">
					<p>Sensor Status : <span id="sensorStatus"></span><span class="dotsSpan"></span>  </p>
				</div>
				<span id="temperature"><span id="value">--</span>°C</span>
				<button id="aa" onclick="getTemperature()">Update</button>
			</div>

			<div id="fanCard" class="verticalSeparate infoBox genericContainer">
				<div>
					<h2>Fan</h2>
					<img src="/images/fan.png" class="moduleIcon" >
					<p>Fan Status : <span id="fanStatus"></span><span class="dotsSpan"></span></p>
				</div>
				<div>
					<button onclick="toggleFan(1)">On</button>
					<button onclick="toggleFan(0)">Off</button>
				</div>
			</div>
		</div>
	</div>




	<div class="infoRow">
		<h1>Irrigation</h1>
		<div class="horizontalCenter">


			<div class="verticalSeparate infoBox genericContainer" id="valveCard">
				<!--<div class="frontface">-->
					<!--FRONTFACE-->
					<div>
						<img class="moduleIcon" src="/images/drop.png" >
						<h2>Valve</h2>
						<p>Status: <span id="valveStatus">Connecting</span><span class="dotsSpan"></p>
						<p>Mode : <span id="valveMode">--</span></p>
						
						<p>Next Spray at : <span id="nextSpray">--</span></p>
						<img onclick="flip(1)" src="/images/cog.png" width="42" height="42" style="cursor: pointer; position: absolute; right: 4%; top: 4%">
					</div>

					<div>
						<button onclick="toValve('burst;')" style="font-size: 25px;">Spray</button>
						<button onclick="toValve('')" style="font-size: 25px;">Open</button>
						<button onclick="toValve('0;')" style="font-size: 25px;">Close</button>
					</div>			
					

				<!--</div>-->
				<div class="backface verticalSeparate">
					<!--BACKFACE-->
					<img onclick="flip(0)" src="/images/cog.png" width="45" height="45" style="cursor: pointer; position: absolute; right: 4%; top: 4%">
					<h2>Settings</h2>
					
					<div>
						<p>Spray duration (seconds) <input type="number" id="periodTime"></p>
						<p style="white-space: pre;">Spray interval (hours) <input type="number" id="intervalTime"></p>
						<p>Password: <input style="width: 70px" type="text" id="valvePassword"></p>
					</div>
					<button onclick="sendParams()">Set</button>
				</div>

			</div>

			<div class="verticalSeparate infoBox genericContainer">
				<div>
					<img class="moduleIcon" src="/images/bat.png" >
					<h2>Battery Voltage</h2>
				</div>
				<span id="voltageContainer"><span id="voltage">--</span></span>
				<button>Update</button>
	
			</div>
		
	</div>

</body>
</html>