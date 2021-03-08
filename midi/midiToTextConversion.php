 <?php
 	//This class is 3rd party, Not mine!
 	require('midiConverter/midi.class.php');
    //
    
    $midiFile = $_FILES["midiFile"]["tmp_name"];
    $midi = new Midi();
    $midi->importMid($midiFile);
    $midiText = $midi-> getTxt(1);//1 is for delta times
    
	$result = "";
	while (strlen($midiText) > 0){

		$eol = strfind($midiText, "\n");//End of line index
		if (strfind($midiText, " On ", 0, $eol) !== False){
			//If line is not on
			$delay = substr($midiText, 0, strfind($midiText, " "));
			$indexN = strfind($midiText, "n=");
			$note = substr($midiText, $indexN+2, strfind($midiText, " ", $indexN)-$indexN-2);
			$result .= "\ndelay(${delay} * factor);";
			$result .= "\ntone(tonePin, round(tuning * 440*pow(2, (${note} - 	69)/12.0)));";
		}
		else if(strfind($midiText, " Off ", 0, $eol) !== False){
			//If line is note off
			echo "3";
			$delay = substr($midiText, 0, strfind($midiText, " "));
			$result .= "\ndelay(${delay} * factor);";
			$result .= "\nnoTone(tonePin);";
		}
	
		$midiText = substr($midiText, strfind($midiText, "\n")+1);
	}
	
	echo $result;
	
	function strfind($haystack, $needle, $offset = 0, $length = NULL){
    	if(is_null($length)){
    		$length  = strlen($haystack);
    	}
    	return strpos(substr($haystack, 0, $length), $needle, $offset);
    }

    /* NOT MANUALLY TRANSPILED PYTHON CODE
    result = ""

	while len(midiText) > 0:
		eol = midiText.find("\n")
		if midiText.find(" on ", 0, eol) > -1:
			delay = midiText[0 : midiText.find(" ")]
			indexN = midiText.find("n=")
			note = midiText[indexN+2 : midiText.find(" ", indexN)]  
			result += f"\ndelay({delay} * factor);"
			result += f"\ntone(tonePin, round(tuning * 440*pow(2, ({note} - 	69)/12.0)));"
		
		elif midiText.find(" off ", 0, eol) > -1:
			delay = midiText[0 : midiText.find(" ")]
			result += f"\ndelay({delay} * factor);"
			result += "\nnoTone(tonePin);"

	midiText = midiText[midiText.find("\n")+1:] 
	*/
	
?>