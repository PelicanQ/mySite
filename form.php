<?php  
header("Access-Control-Allow-Origin: *");
echo "Data recieved".PHP_EOL;
echo file_get_contents("php://input");
echo PHP_EOL . "End";
?>
