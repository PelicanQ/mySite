
<!DOCTYPE html>
<html>
<head>
	<?php 
		$root = $_SERVER["DOCUMENT_ROOT"];
		include($root . "/modules/head.php");
	?>
	<link rel="stylesheet" href="/stylesheets/midiStyle.css">
	<script src="midiScript.js"></script>
</head>

<body>

	<?php 
	include($root . "/modules/topbar.php");?>

	<div class="container">
		<div id="inputDiv" class="genericContainer">
			<p class="header3">MIDI File</p>
			<input id="midiFile" type="file" >
			<button id="convertButton" onclick="convert()">Convert</button>
		</div>
		<div id="outputDiv" class="vertical">
			<p class="header3">Arduino Code Output</p>
			<textarea readonly id="codeOutput">Arduino code appears here</textarea>
		</div>
	</div>
	<?php include($root . "/modules/bottom.php");?>
</body>
</html>