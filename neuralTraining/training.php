<!DOCTYPE html>
<html>
<head>
	<?php 
	$droot = $_SERVER["DOCUMENT_ROOT"];
	include($droot . "/modules/head.php");?>
	<script src="/myLib.js"></script>
	<script src="/makeDrawingBox.js"></script>
	<script src="DrawableCanvas.js"></script>
	
	<script src="/neuralTraining/trainingScript.js"></script>
	<link type="text/css" rel="stylesheet" href="/stylesheets/trainingStyle.css">
</head>
<body>
	<?php include($droot . "/modules/topbar.php");?>
	
	<div id="submitResponse">
		<div class="noHeight">
			<span id="response">Submitting</span>
			<button id="submitClose" onclick="toggleSubmitResponse(0)">Close</button>
		</div>
	</div>

	<div id="topFlex">
		<div id="textContainer" class="genericContainer">
			<p class="header3">Draw digits</p>
			<p id="decriptionOfPage">Here you can generate training data and submit to server. It will be added to the already existing data set. To train, click <a href="/neuralNetwork/neural.php">here</a></p>
		</div>
		<div id="drawingContainer" class="genericContainer">
		
			<div id="digitsDiv">
				<?php 
					for($i = 0; $i < 10; $i++){
						echo "<label class='digitRadioLabel' for='$i'>$i
								<input class='digitRadioButton' name='digit' type='radio' value='$i' id='$i'>
							</label>";
					}
				?>
			</div>
		
			<canvas id="drawingBox" width="400" height="400"></canvas>
			<button id="clearButton" onclick="drawable.clear()"> Clear </button>
			<span>  </span>
			<button id="saveButton" onclick="save()"> Save </button>
		</div>
	</div>
	<br>
	<div id="previewDiv" class="genericContainer">
		<p class="header3">Drawn digits</p>
		<?php 
			for($i = 0; $i < 10; $i++){
				echo 
				"<h3>{$i}</h3>
				<div class='preview' id='digit{$i}'>		
				</div>";		
			}
		
		?>
		<button id="submitButton" onclick="sendTrainingData()">Submit</button>
	</div>

<?php include($droot."/modules/bottom.php");?>
</body>
</html>