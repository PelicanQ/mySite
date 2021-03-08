<!DOCTYPE html>
<html>
<head>
	<?php 
		$droot = $_SERVER["DOCUMENT_ROOT"];
		include($droot . "/modules/head.php");
	?>
	<link rel="stylesheet" type="text/css" href="/stylesheets/neuralStyle.css">
	<link rel="stylesheet" type="text/css" href="/chartJS/Chart.min.css">
	<script src="/chartJS/Chart.js"></script>
	<script src="/myLib.js"></script>
	<script src="/makeDrawingBox.js"></script>
	<script src="digitClass.js"></script>
	<script src="neuralNetworkConstructor.js"></script>
	<script src="initPage.js"></script>
	<script src="utilityFunctions.js"></script>
	<script src="drawNN.js"></script>
	<script src="main.js"></script>

</head>
<body>
	<?php include($droot . "/modules/topbar.php");?>

	<div id="overlayMessage" >
		<div class="noHeight">
			<h3 id="trainingStatus" style="font-size: 30px;">Training...</h3>
			<p><span id="numberOfCompleted"></span> Backpropagations complete</p>
			<div id="progressBar">
				<div></div>
			</div>
			<button id="closeButton" onclick="toggleTrainingStatus(0)">Close</button>
			<button id="cancelTrainingButton">Stop</button>
		</div>
	</div>
	<div id="welcomeText" class="genericContainer">
		<p class="header1">Neural Network</p>
		<p>	This neural network recognizes handwritten digits in a 20x20 grid. You can feed the network with either Custom Drawn or Training Examples loaded from server. The cost of a network, with respect to a data set, indicates its inaccuracy to that set. Generate more training data <a href="/neuralTraining/training.php">here</a></p>
	</div>
	
	<div id="titleBar">
		
		<span>
			
			<strong>Using Network: 
				<select id="networkSelector">
					<option>--</option>
				</select>
			</strong>	
						
			<button id="saveNetworkButton" onclick="saveNeuralNet()">Save</button>
		</span>
		
	</div>
	
	
	
	<div id="flexDiv" class="genericContainer">
		<div id="controlPanel">
			<!--<h2>Control Panel</h2>-->
			<p class="header3">Input</p>
			
			<div style="text-align: left">
				
				<h4>Test network with: </h4>
				<input id="testCustom" type="radio" name="testButton">
				<label for="testCustom">Custom Drawn Example</label>
				
				<br>	
				
				<input id="testExample" type="radio" name="testButton">
				<label for="testExample">Training Example</label>
				<span id="dataSelectIndex"></span>
			</div>
			
			<div id="previewDiv">
				<canvas id="previewCanvas" width="200" height="200"></canvas>
				<canvas id="customDraw" width="200" height="200"></canvas>
				<input id="dataSelectInput" type="range" name="" min="0" step="1">
				
			</div>	
			<div id="drawingButtons">
				<button onclick="testWithCustom()">Test</button>
				<button onclick="clearCustomGrid()">Clear</button>
			</div>
		</div>

		<div id="neuralCanvasContainer" >
			<canvas width="500" height="500" id="neuralCanvas">
			
			</canvas>
		</div>

		<div id="rightDiv">
			<p class="header3">Output</p>
			<span id="outputDigit">-</span>
			<div>
				<h2>Stats</h2>
				<p>Times trained: <span id="timesTrained">--</span></p>
				<p>Cost of current input <span id="costOfCurrentInput"></span></p>
				<p>Total cost (avrage over all examples)  <span id="avrageCost"></span></p>
				<h4>Backpropagate over training data</h4>
				
				<span>
					<button id="trainButton">Train</button>
					X
					<input type="number" id="trainTimes" value="1"></input>
				</span>
			</div>
		</div>
	</div>

	<h2>Labeled Training Data from server</h2>
	<div id="allDigits" class="genericContainer">
		<?php 
			for($i = 0; $i < 10; $i++){
				echo 
				"<h3 class='leftAlign'></h3>
				<div class='trainingDigitsDiv' id='digit{$i}'>		
				</div>";		
			}
		?>	
	</div>
	<h2>Cost after training</h2>
	<div id="chartContainer" class="genericContainer">
		<canvas id="costChart"></canvas>
	</div>

	<?php include($droot . "/modules/bottom.php");?>
</body>
</html>