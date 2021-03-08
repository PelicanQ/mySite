async function convert(){
	if($("#midiFile")[0].files.length == 0){
		console.log("File empty?");
		return;
	}
	var data = new FormData();
	data.append("midiFile", $("#midiFile")[0].files[0]);

	fetch("midiToTextConversion.php", {
		method : "POST",
		headers : {
			"User-Agent" : "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4136.7 Safari/537.36"//,
			//"Content-Type" : "multipart/form"
		},
		body : data
	}).then((response) => {
		response.text().then((text)=>{
			$("#codeOutput")[0].innerHTML = text;
			return;
			var arr = $.parseHTML(text);
			arr.forEach((el) => {
				if(el.id === "code"){
					$("#codeOutput")[0].innerHTML = el.innerHTML;
				}
			});
		})
		
	}).catch(()=>{
		console.log("fail");
	})
}