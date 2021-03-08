define(["shapes"], function(shapes){
	var pong = {
		active : false,
		x : 0, y : -500, z : 4000, 
		height : 700,
		width : 1300,
		playerScore : 0, 
		opponentScore : 0,
		ball : {
			shape : undefined,
			xSpeed : 0, ySpeed: 0, yIntersect: undefined
		},
		racketSpeed : 0.4,
		playerDir : 0,
		upKeyPressed : 0,
		downKeyPressed : 0,
		playerRacket : new shapes.Cuboid(0, 0, 0,  10, 250, 40, "#FFF"),
		opponentRacket : new shapes.Cuboid(0, 0, 0,  10, 250, 40, "#000"),
		
		init(){
			pong.ball.shape = new shapes.Cube(pong.x, pong.y, pong.z, 20, "#FFF");
			pong.ball.xSpeed = 0;
			pong.ball.ySpeed = 0;
			pong.playerRacket = new shapes.Cuboid(pong.x-pong.width/2+50, pong.y, pong.z,  20, 200, 40, "#7AF");
			pong.opponentRacket = new shapes.Cuboid(pong.x + pong.width/2-50, pong.y, pong.z,  20, 200, 40, "#F22");
			pong.topBlock = new shapes.Cuboid(pong.x, pong.y - pong.height/2-5, pong.z,  pong.width, 10, 10, "#000");
			pong.bottomBlock = new shapes.Cuboid(pong.x, pong.y + pong.height/2+5, pong.z,  pong.width, 10, 10, "#000");
			
		},
		start(){
			pong.ball.xSpeed = -0.4;
			pong.ball.ySpeed = Math.random()/2-0.25;
		},
		racketCollision(ball){
			/*var racketIntersect = pong.ball.shape.x * pong.ball.ySpeed / pong.ball.xSpeed 
			* (pong.playerRacket.x + pong.playerRacket.sx/2 - pong.ball.shape.x);
			if(racketIntersect < pong.playerRacket.y-pong.playerRacket.sy/2 && racketIntersect < pong.playerRacket.y-pong.playerRacket.sy/2
				&& ball.shape.x - ball.shape.sx/2 < pong.playerRacket.x + pong.playerRacket.sx/2){
				return pong.playerRacket;
			}*/

			if(ball.shape.x - ball.shape.sx/2 < pong.playerRacket.x + pong.playerRacket.sx/2
			&& ball.shape.y + ball.shape.sy/2 > pong.playerRacket.y-pong.playerRacket.sy/2
			&& ball.shape.y - ball.shape.sy/2 < pong.playerRacket.y+pong.playerRacket.sy/2
			&& ball.xSpeed < 0)
				return pong.playerRacket;

			else if(ball.shape.x + ball.shape.sx/2 > pong.opponentRacket.x - pong.opponentRacket.sx/2
			&& ball.shape.y + ball.shape.sy/2 > pong.opponentRacket.y-pong.opponentRacket.sy/2
			&& ball.shape.y - ball.shape.sy/2 < pong.opponentRacket.y+pong.opponentRacket.sy/2
			&& ball.xSpeed > 0)
				return pong.opponentRacket;
			else 
				return 0;

			
		},
		frame(dt){
			//Move player
			var dYplayer = dt*pong.playerDir*pong.racketSpeed;
			var aboveBottom = pong.playerRacket.y+pong.playerRacket.sy/2 + dYplayer < pong.y + pong.height/2; 
			var belowTop = pong.playerRacket.y-pong.playerRacket.sy/2 + dYplayer > pong.y - pong.height/2;
			
			pong.playerRacket.move(0, aboveBottom*belowTop*dYplayer, 0);
			pong.ball.shape.move(pong.ball.xSpeed*dt, pong.ball.ySpeed*dt, 0);

			if(pong.ball.xSpeed > 0){
				var dYopponent =  dt * pong.racketSpeed * Math.sign(pong.ball.yIntersect-pong.opponentRacket.y);
				var aboveBottom = pong.opponentRacket.y+pong.opponentRacket.sy/2 + dYopponent < pong.y + pong.height/2;
				var belowTop = pong.opponentRacket.y-pong.opponentRacket.sy/2 + dYopponent > pong.y - pong.height/2;
				var farFromTarget = Math.abs(pong.opponentRacket.y - pong.ball.yIntersect) > Math.abs(dYopponent)
				pong.opponentRacket.move(0, dYopponent*aboveBottom*belowTop*farFromTarget, 0);	
				
			}
			//Collision checking
			var collidedRacket = pong.racketCollision(pong.ball);
			if(pong.ball.shape.y < pong.y - pong.height/2){
				pong.ball.ySpeed *= Math.sign(pong.ball.ySpeed);  
				pong.ball.yIntersect =  pong.ball.shape.y-(pong.ball.shape.x-pong.opponentRacket.x) * pong.ball.ySpeed /  pong.ball.xSpeed
			}
			else if(pong.ball.shape.y > pong.y + pong.height/2){
				pong.ball.ySpeed *= -Math.sign(pong.ball.ySpeed);  
				pong.ball.yIntersect =  pong.ball.shape.y-(pong.ball.shape.x-pong.opponentRacket.x) * pong.ball.ySpeed /  pong.ball.xSpeed
			}
			else if(collidedRacket != 0){
				var diff = (pong.ball.shape.y-collidedRacket.y)/collidedRacket.sy;
				if(Math.abs(diff) > 0.3){
					pong.ball.ySpeed *= Math.sign(diff) * Math.sign(pong.ball.ySpeed);
					if(Math.abs(pong.ball.ySpeed) < 2){
						pong.ball.ySpeed += 0.2*Math.sign(pong.ball.ySpeed);
						pong.ball.xSpeed /= 1.1;
					}
				}
				//pong.ball.shape.move((collidedRacket.x-Math.sign(pong.ball.xSpeed)*(collidedRacket.sx/2+pong.ball.shape.sx/2)) - pong.ball.shape.x,0,0);
				pong.ball.xSpeed *= -1;
				pong.ball.xSpeed += 0.08 * Math.sign(pong.ball.xSpeed);
				if(collidedRacket === pong.playerRacket)
					pong.ball.yIntersect = pong.ball.shape.y-(pong.ball.shape.x-pong.opponentRacket.x) * pong.ball.ySpeed /  pong.ball.xSpeed;
					
			}
			else if(pong.ball.shape.x < pong.x - pong.width/2){
				pong.opponentScore++;
				pong.init();
				setTimeout(()=>pong.start(), 1500);
			}
			else if(pong.ball.shape.x > pong.x + pong.width/2){
				pong.playerScore++;
				pong.init();
				setTimeout(()=>pong.start(), 1500);
			}
			
			/*if(racketCollision(pong.playerRacket, pong.ball.shape)){
				var diff = (pong.ball.shape.y-pong.playerRacket.y)/pong.playerRacket.sy;
				
				if(Math.abs(diff) > 0.3){
					pong.ball.ySpeed *= Math.sign(diff) * Math.sign(pong.ball.ySpeed);
					if(Math.abs(pong.ball.ySpeed) < 2)
						pong.ball.ySpeed += 0.2*Math.sign(pong.ball.ySpeed);
						pong.ball.xSpeed /= 1.1;
				}

				pong.ball.xSpeed *= -1;
				pong.ball.xSpeed += 0.06;
				pong.ball.shape.x = pong.playerRacket.x+pong.playerRacket.sx/2+pong.ball.shape.sx/2;
				pong.ball.yIntersect = pong.ball.shape.y-(pong.ball.shape.x-pong.opponentRacket.x) * pong.ball.ySpeed /  pong.ball.xSpeed;
				
			} */
			/*else if(racketCollision(pong.opponentRacket, pong.ball.shape)){
				pong.ball.xSpeed *= -1;
				pong.ball.shape.x = pong.opponentRacket.x-pong.opponentRacket.sx/2-pong.ball.shape.sx/2;
			}*/
			
		}
	}
	return pong
});