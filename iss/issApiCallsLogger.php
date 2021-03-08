<?php 
	//Check if it is JSON coming in
	if(!isset(getallheaders()["Content-Type"]) or !getallheaders()["Content-Type"] == "json"){
		exit();//Did not recieve JSON data
	}
	$data = json_decode(file_get_contents("php://input"));
	$fileRead = fopen("apiCalls.txt", "r");
	$line = fgets($fileRead);
	//if the current date is already at top of apiCalls.txt, then it has already been called today
	if(strpos($line,  $data->currentDate) !== FALSE){
		
		$newAmount = (int)substr(fgets($fileRead), 12) + 1;
		fclose($fileRead);
		echo "Already called today. calls:<p id='amount'>" . (string)$newAmount ."</p>" . PHP_EOL;
		$content = file_get_contents("apiCalls.txt");
		$theString = substr($content, 0, strpos($content, PHP_EOL, strpos($content, "Calls Today:"))+1);
		$newContent = str_replace($theString, $data->currentDate . PHP_EOL . "Calls Today:" . (string)$newAmount . PHP_EOL, $content);
		$fileWrite = fopen("apiCalls.txt", "w+");
		fwrite($fileWrite, $newContent);
		fclose($fileWrite);
	}
	else {
		echo "first call today" . PHP_EOL;
		$content = file_get_contents("apiCalls.txt");
		$newContent = $data->currentDate . PHP_EOL . "Calls Today:1". PHP_EOL;
		$fileWrite = fopen("apiCalls.txt", "w+");
		fwrite($fileWrite, $newContent . $content);
		fclose($fileWrite);
		echo "<p id='amount'>1</p>";
		
	}
	exit("\nEnding script");
	
	
?>