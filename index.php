<!DOCTYPE html>
<html>
	<head>
		<?php 
			$root = $_SERVER["DOCUMENT_ROOT"];
			include($root . "/modules/head.php");
		?>
		<link rel="stylesheet" type="text/css" href="/stylesheets/mainStyle.css">
	</head>

	<body>
		<?php include($root . "/modules/topbar.php");?>
		
		<div id="welcomeText" class="genericContainer">
			<p class="header1">Hello World!</p>
			<p>Here are a few projects I've made.</p>
		</div>
		
		<div class="flexContainer">
			<div class="myCol">
			
			<?php 
				class Content {
					function __construct($args){
						$argNames = Array("href", "imgSrc", "imgClass", "title", "description");
						$args = func_get_args();
						for($i = 0; $i < count($args); $i++){
							$this->{$argNames[$i]} = $args[$i];
						}
					}
				}
				$content = Array(
					new Content("./neuralNetwork/neural.php",    "images/brain.jpg",			"pinkBrainPic", "Neural Network", 			"A neural network learning through backpropagation to recognize written digits"),
					new Content("./neuralTraining/training.php", "images/brain.jpg", 			"pinkBrainPic", "Generate Training Data", 	"Draw digits that will serve as data to train the neural network"),
					new Content("./iss/iss.php", 	 			 "images/station.jpg", 			"issPic", 		"Position of ISS", 			"See where the ISS is on a map"),
					new Content("./water/water.php", 			 "images/blueThermo.jpg", 		"tempPic", 		"Water and Climate", 		"Remotely water some plants. Room climate"),
					new Content("./3D/index3D.php", 			 "images/cube.png",	 			"cubePic", 		"Redneck 3D", 	 			"Rudimentary 3D engine. Pong included"),
					new Content("./midi/midi.php", 				 "images/arduinoSimple.png", 	"arduPic", 		"MIDI to Arduino", 			"Convert a MIDI melody to Arduino code"),
					new Content("./Cube-Game/index.php", 		 "images/square.png", 			"squarePic", 	"Square Game",				"Square Game"),
					new Content("./landerGame/index.php", 		 "./images/brackets.png",	 	"codePic", 		"Lander Game", 				"Very Unfinished"),
					
				);

				for($i = 0; $i < count($content); $i++){
					$item = $content[$i];
					if($i == round(count($content)/2)){
						echo "</div><div class='myCol'>";
					}

					echo 
					"<div class='myRow genericContainer'>
						<div class='normal'>
							<a href='{$item->href}'>
								<img class='boxImg {$item->imgClass}' src='{$item->imgSrc}' >
								<p class='verticalCenter'></p>
							</a>
						</div>
						
						<div class='description'>
							<h2>{$item->title}</h2>

							{$item->description}
						</div>
					</div>";
				}
			?>
				
			</div>
		</div>
		
		<?php include($root . "/modules/bottom.php");?>
	</body>

</html>