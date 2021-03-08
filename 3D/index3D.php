<!DOCTYPE html>
<html>
	<head>
		<?php include($_SERVER["DOCUMENT_ROOT"]."/modules/head.php"); ?>
		<link href="/stylesheets/3Dstyle.css" type="text/css" rel="stylesheet">
	</head>
	
	<body>
		<?php include($_SERVER["DOCUMENT_ROOT"]."/modules/topbar.php"); ?>
		
		<div id="welcomeText" class="genericContainer">
			<p class="header1">3D Canvas Graphics</p>

			<p>Interact with the blue cubes</p>
		</div>

		<div id="canvasContainer" class="genericContainer">
			<canvas id="gameCanvas" width="1600" height="800"></canvas>
			<div id="clickOverlay">
				<img src="/images/click.png">
			</div>
		</div><br>

		<div class="genericContainer" id="controls">
			<p>WASD = Move    Space = Jump    V = Toggle View    LMB = Interact   </p>
			<p> Esc = Exit    Up/Down = Pong    Scroll = Zoom/FOV    Shift = Free Camera</p>
		</div>
		
		<script data-main="initialize.js" src="require.js"></script>
		
	</body>
</html>