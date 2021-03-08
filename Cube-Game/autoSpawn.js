define(["spawnEnemy", "config", "constructors", "preData", "spawnPowerUp"], function(spawnEnemy, config, constructors, preData, spawnPowerUp){
	const PowerUp = constructors.PowerUp;
	const {loops, powerUps} = preData;

	return function(){

		spawnEnemy({sak : "normal", x : "random"});
		spawnEnemy({sak : "normal", x : "random"});
		var spawnNumbers = {
			normal: 1,
			tank: 0.4,
			Xfast: 0.6,
			Yfast: 0.6,
			slasher: 0.5,
			powerUps: 0.6
		};
		var lastTime = 0;
		var progress = 0;
		var spawningLoop = function(timestamp){
			progress = timestamp - lastTime;
			if(progress > 1000){
				lastTime = timestamp;

				for(let i in spawnNumbers){
					var spawnAmount = Math.round(Math.random()*spawnNumbers[i]);
					for(let n = 0; n < spawnAmount; n++){
						spawnEnemy({sak : i, x : "random"});
					}
				}
				
				for(let i = 0; i < Math.round(Math.random() * spawnNumbers.powerUps); i++){
					powerUps.length < 10 && spawnPowerUp();
				}
				spawnNumbers.normal += 0.003;
				spawnNumbers.tank += 0.003;
				spawnNumbers.Xfast += 0.003;
				spawnNumbers.Yfast += 0.003;
				spawnNumbers.slasher += 0.002;
				spawnNumbers.powerUps += 0.002;
				
			}	
			window.requestAnimationFrame(spawningLoop);	
		}
		window.requestAnimationFrame(spawningLoop);
	}
	/*
	return function(){
		var smallVal = 13; // these values are to decrease to make waves happen more frequently

		var normals = function(){//this normals() function is just to setup and start looping
			var lastTimeB = 0;
			var small = 3000;
			var smallLoop = function(timestampB){
				var progressB = timestampB-lastTimeB;
				if(progressB > small){//small loop started
					lastTimeB = timestampB;
					spawnEnemy({sak : "normal", x : "random"});
					small = 400+Math.random()*100*smallVal;
					config.message = "!!";
				}
				
				window.requestAnimationFrame(smallLoop);
				
			};
			loops.IDs.smallLoop = window.requestAnimationFrame(smallLoop);
			loops.starters.smallLoop = smallLoop;
		};
		
		var tanks = function(){
			var big = 40000;
			var lastTime = 0;
			var tankLoop = function(timestamp){
				if(timestamp-lastTime>big){
					lastTime = timestamp;
					
					spawnEnemy({sak :"tank", x:"random"});
					big = 500+5000*smallVal/15;
				}
				loops.IDs.tankLoop = window.requestAnimationFrame(tankLoop);
			}	
			loops.IDs.tankLoop = window.requestAnimationFrame(tankLoop)
			loops.starters.tankLoop = tankLoop;
			console.log("tanks confirmed");
		}
		var fasts = function(){
			var big = 60000;//first timer is set high for delay
			var lastTime = 0;
			var fastsLoop = function(timestamp){
				if(timestamp-lastTime>big){
					lastTime = timestamp;
					
					if(Math.random()<0.5)
						spawnEnemy({sak : "Xfast", x:"random"});
					else 
						spawnEnemy({sak :"Yfast", x:"random"});
					big = 800+3000*smallVal/15;
				}
				loops.IDs.fastsLoop = window.requestAnimationFrame(fastsLoop);
			}	
			loops.IDs.fastsLoop = window.requestAnimationFrame(fastsLoop);
			loops.starters.fastsLoop = fastsLoop;
			
		}

		var slashers = function(){
			var big = 90000;
			var lastTime = 0;
			var slashLoop = function(timestamp){
				if(timestamp-lastTime>big){
					lastTime = timestamp;
					
					spawnEnemy({sak :"slasher", x:"random"});
					big = 800+4000*smallVal/15;
				}
				loops.IDs.slashLoop = window.requestAnimationFrame(slashLoop);
			}	
			loops.IDs.slashLoop = window.requestAnimationFrame(slashLoop);
			loops.starters.slashLoop = slashLoop;
			
		}
		var powUps = function(){
			var lastTime = 0;
			var time = 0;
			var powLoop = function(timestamp){
				if(timestamp - lastTime > time){
					lastTime = timestamp;
					// all possible powUps
					var b1 = ["speed", "shield", "double", "blast", "cash", "regen", "nuke"];
					var b2 = ["#F00",  "#F0F"  , " #00F ", " #FA5", "#0FF", "#F2C",  "#FF0"];	
					var a = Math.round(Math.random()*b1.length);
					powerUps.push(new PowerUp(b2[a], b1[a], 20));
					time = 7000 + 6000*Math.random();
					smallVal *= 19/20;
					console.log(smallVal);
				}
				loops.IDs.powLoop = window.requestAnimationFrame(powLoop);
			};
			
			loops.IDs.powLoop = window.requestAnimationFrame(powLoop);
			loops.starters.powLoop = powLoop;
		}
		normals();
		fasts();
		tanks();
		powUps();
		slashers();
	}*/
});