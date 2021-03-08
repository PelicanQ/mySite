var makeBackgroundAnimationCanvas = function(canvas, parentToFill){
	var c = canvas;
	var ctx = c.getContext("2d");
	if(!parentToFill || !parentToFill.clientWidth){
		parentToFill = window;
	}
	c.width = parentToFill.clientWidth;
	c.height = parentToFill.clientHeight;
	
	function Cloud(x, y, degrees, r, col) {
		var xS = Math.sin(degrees * Math.PI/180);
		var yS = Math.cos(degrees * Math.PI/180);
		this.xPos = x;
		this.yPos = y;
		this.xSpeedRef = Math.abs(xS);
		this.ySpeedRef = Math.abs(yS);
		this.xSpeed = xS;
		this.ySpeed = yS;
		this.radius = r;
		this.color = col;
	}
	var clouds;
	if(sessionStorage.clouds){
		clouds = JSON.parse(sessionStorage.clouds);
	}
	else {
		clouds = [
			new Cloud(10, 10, 125, 300, "#00EDED"),
			new Cloud(500, 100, 180, 200, "#007744"),
			new Cloud(1600, 400, 270, 400, "#cc00cc"),
			new Cloud(300, 800, 200, 300, "#33ff88"),
			new Cloud(300, 700, 100, 200, "#00EDED")
		];
		sessionStorage.clouds = JSON.stringify(clouds);
	}

	var scaleFactorX, scaleFactorY;
	var animationCalc = function(){
		
		scaleFactorX = 1;// window.innerWidth/1920;
		scaleFactorY = 1;//window.innerHeight/1080;
		
		for(var i in clouds){
           	clouds[i].xPos += clouds[i].xSpeed   * 0.5;
           	clouds[i].yPos += clouds[i].ySpeed   * 0.5;
           	if(clouds[i].xPos+clouds[i].radius >= c.width/scaleFactorX){ 
           		
           		clouds[i].xSpeed = -clouds[i].xSpeedRef;
           	}
           	else if (clouds[i].xPos-clouds[i].radius < 0){
           		
           		clouds[i].xSpeed = clouds[i].xSpeedRef;
           	}
           	if(clouds[i].yPos-clouds[i].radius < 0){ 
           		
           		clouds[i].ySpeed = clouds[i].ySpeedRef;
           	}
           	else if (clouds[i].yPos+clouds[i].radius > c.height/scaleFactorY){
           		
           		clouds[i].ySpeed = -clouds[i].ySpeedRef; 
           	}

        }
        sessionStorage.clouds = JSON.stringify(clouds);
	};

	var animationDraw = function(){
		ctx.clearRect(0, 0, c.width, c.height);


		
        for(var i in clouds){
        	ctx.fillStyle = clouds[i].color;;
			ctx.strokeStyle= "#00EDED";
			ctx.lineWidth = 0;
        	ctx.beginPath();
        	ctx.arc(clouds[i].xPos, clouds[i].yPos, clouds[i].radius, 0, 2 * Math.PI);
        	ctx.fill();
        }

	};
	
	var progress = 0, lastTime = 0;
	var animation = function(timestamp){
		
		progress = timestamp - lastTime;
		if(progress > 17){
			lastTime = timestamp;
			
			animationCalc();
			animationDraw();
			
			
		}
		window.requestAnimationFrame(animation);
	};
	window.requestAnimationFrame(animation);
	
}