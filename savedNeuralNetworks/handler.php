<?php
	if($_SERVER["REQUEST_METHOD"] === "GET" && $_GET["all"] === "all"){
		$scan = scandir("./");
		$allNeuralNets = Array();
		foreach ($scan as $fileName) {
			if(!is_dir($fileName) && substr($fileName, -5) === ".json"){
				$file = file_get_contents($fileName);
				$network = json_decode($file, true);
				array_push($allNeuralNets, $network);
			}
		}
		echo json_encode($allNeuralNets);
		exit();
	}
	$JSON = json_decode(file_get_contents("php://input"), true);
	if(strlen($JSON["NN"]["name"]) == 0){
		http_response_code(400);
		exit("No name");
	}
	if($JSON["NN"]["name"] == "default" && $JSON["password"] !== "gamer"){
		http_response_code(401);
		exit("Not allowed");
	}	
	$file = fopen($JSON["NN"]["name"] . ".json", "w");
	fwrite($file, json_encode($JSON["NN"]));
	fclose($file);
	echo "Saved as " . $JSON["NN"]["name"];
?>