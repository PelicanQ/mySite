<!DOCTYPE html>

<html>

	<head>
		<?php 
			$root = $_SERVER["DOCUMENT_ROOT"];
			include($root . "/modules/head.php");
		?>
		<link rel="stylesheet" type="text/css" href="/stylesheets/cubeGameStyle.css">
		<script data-main="init.js" src="require.js"></script>
	</head>
	<body id="body">
	<?php 
		include($root . "/modules/topbar.php");
	?>
	<div id="welcomeText" class="genericContainer">
		<p class="header1">Shoot the Squares</p>
		<p>This was my first JS project. Hence the code is not the prettiest</p>
	</div>
	<div id="gameCanvasContainer" class="genericContainer">
		<canvas id="c" width="1400" height="750" ></canvas>
		<canvas id="gameBackgroundCanvas" width="0" height="0"></canvas>
	</div>
	<div id="controls" class="genericContainer">
		<p>Mouse = Move    WASD = Fire    IJKLO = Spawn Enemies (Freeplay)</p>
		<p>Y = Spawn Boss    ZXCVBN = Spawn Powerups (Freeplay)</p>
	</div>
	
	<img id="gabe" style="display: none" src="images/FaceOfGabe.png">
	<img id="nukePic" style="display: none" src="images/nuke.png">
	<img id="clouds"style="display: none"  src="images/background.png">
	<audio id="nukeSound" src="sounds/nuke.mp3" preload="auto"></audio>
	<audio id="laser" src="sounds/pew.mp3" preload="auto"></audio>
	<audio id="click" src="sounds/click.mp3" preload="auto"></audio>
	<audio id="select" src="sounds/select.mp3" preload="auto"></audio>
	<audio id="shieldup" src="sounds/shieldup.mp3" preload="auto"></audio>
	<audio id="shielddown" src="sounds/shielddown.mp3" preload="auto"></audio>
	<audio id="speedup" src="sounds/speedup.mp3" preload="auto"></audio>
	<audio id="speeddown" src="sounds/speeddown.mp3" preload="auto"></audio>
	<audio id="boom" src="sounds/boom.mp3" preload="auto"></audio>
	<audio id="reload" src="sounds/reload.mp3" preload="auto"></audio>
	<audio id="homing" src="sounds/homing.mp3" preload="auto"></audio>
	<audio id="nitrofun" src="sounds/nitrofun.mp3" preload="auto"></audio>


</body>
</html>