<?php 
	if($_SERVER["REQUEST_METHOD"] == "GET"){

		//We shall return all handwritten digits as objects in one JSON array 
		$fullTrainingArray = Array();
		$files = scandir("./digitsJSON/");
		
		$files = array_filter($files, function($oneFileName){
			return !is_dir("./digitsJSON/".$oneFileName);
		});
		
		foreach($files as $name){
			//Opening one file to concatenate its array with the big one
			$string = file_get_contents("./digitsJSON/".$name);
			$trainingArr = json_decode($string);
			if(gettype($trainingArr) !== "array")
				continue;
			$fullTrainingArray = array_merge($fullTrainingArray, $trainingArr);

		}
		//header("Content-Type: application/json");
		echo json_encode($fullTrainingArray);
		exit();

	}
	else if($_SERVER["REQUEST_METHOD"] == "POST"){

		//Now we will save user-submitted handwritten digits in a file
		$jsonData = file_get_contents("php://input");
		$postArray = json_decode($jsonData);
		if(gettype($postArray) != "array" or  empty($postArray)){
			exit("POST data was not JSON array with content");
		}
		
		$today = substr(date("c"), 0, 10);
		$fileName = "./digitsJSON/digits" . $today ;
		
		//If files of same date already exist, add #1, #2... suffix
		$num = 1;		
		while(file_exists($fileName . "#" .(string)$num . ".json")){
			$num++;
		}
		$fileName .= "#".(string)$num . ".json";
		
		
		//Open and write to file
		$file = fopen($fileName, "x");
		if(!$file) 
			exit("Could not create file:" . $fileName);
		if(!fwrite($file, $jsonData)) 
			exit("Could not write to file" . $fileName);

		fclose($file);
		echo  "Submitted data saved as " . $fileName;
	}


?>
