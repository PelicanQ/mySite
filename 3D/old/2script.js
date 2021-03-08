define(function(){
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#000000";
	
	var lastDirection = 270;
	var jumpDist = 50;
	
	var frameCount = 0;
	var rot_sine = 0;
	var rot_cos = 1;
	var deg = 0;
	var FOV = 90;
	var base_length = c.height * 0.5 /( Math.tan((FOV/2) / (180 / Math.PI) ) ); // Längd till "fönstret"
	var position = {	
		x : 700,
		y : 700,
		z : 1000
	};
	var fovDivider = 2// position.z / base_length ;
	console.log(fovDivider);
	ctx.fillStyle = "#FFFFFF";
	window.addEventListener("keypress", function(event){
		if(event.keyCode == 97){
			FOV += 10; //A
		}
		else if (event.keyCode == 119){
			
			deg += 10 // W
			rot_sine = Math.sin(deg / (180 / Math.PI));
			rot_cos = Math.cos(deg / (180 / Math.PI))
			console.log(rot_cos);
		}
		else if (event.keyCode == 106){
			size -=0.1;
		}
			frameCount = 0;
			ctx.clearRect(0,0, c.width, c.height);
			ctx.beginPath();
			position.x = 700 + jumpDist * (1-rot_cos) / 2;
			position.y = 900 + rot_sine * 0.5 * (c.height / (fovDivider - ((jumpDist/2) / base_length)) - jumpDist );
			lastDirection = 270;
			ctx.moveTo(position.x, position.y);
			id = setInterval(loop, 1);
	})

	ctx.beginPath();
	ctx.moveTo(position.x, position.y);
	var loop = function(){
		var randomNumber = 1//Math.random();  //Här var en random float, den målade random linjer med tilt --> 3D
		jumpDist = c.height / fovDivider; //fovDivider är förhållande Z till base_length. Som nämnare JumpDist är längden av en sida 
		//Draw to left
		if((lastDirection == 180)){

			position.x -= jumpDist * rot_cos;
			position.y += rot_sine * 0.5 * Math.abs( (  c.height / (fovDivider - ((jumpDist/2) / base_length))) - (c.height / (fovDivider + ((jumpDist/2) / base_length))) ) ; 
			lastDirection = 270;
		}
		//Draw to up
		else if( lastDirection == 270 ){

			position.y -= jumpDist  +  rot_sine * ( c.height / (fovDivider - ((jumpDist/2) / base_length)) - jumpDist)  * Math.ceil(rot_sine)
						+ rot_sine * (jumpDist - c.height / ( fovDivider + ((jumpDist/2) / base_length) ) ) * Math.ceil(-rot_sine);
			//position.x -=jumpDist
			lastDirection = 0;
		}
		//Draw to down
		else if( lastDirection == 90 ) {

			position.y += jumpDist - rot_sine * (jumpDist - ( c.height / ( fovDivider + ((jumpDist/2) / base_length) ) )) * Math.ceil(rot_sine) - 
									rot_sine * ( c.height / ( fovDivider - ((jumpDist/2) / base_length) ) - jumpDist) * Math.ceil(-rot_sine) 	 
			
			lastDirection = 180;
		}
		//Draw to right
		else {

			position.x += jumpDist * rot_cos;
			position.y += rot_sine *  0.5 *  Math.abs(c.height / (fovDivider - ((jumpDist/2) / base_length)) - ( c.height / (fovDivider + ((jumpDist/2) / base_length)))) ;
			lastDirection = 90;
		}
		ctx.lineTo(position.x, position.y);
		ctx.stroke();
		ctx.font = "50px Arial";
		ctx.fillStyle = "#000000";
		ctx.fillText(rot_sine.toString() + " Deg : " + deg.toString(), 100, 100); //Print the sine of rot, and rot in degrees
		frameCount += 1;
		if (frameCount > 3) {
			clearInterval(id);
			frameCount = 0
		}
	};
	var id = setInterval(loop, 200);
	
})