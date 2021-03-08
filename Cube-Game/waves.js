define(["spawnEnemy", "config", "constructors", "preData"], function(spawnEnemy, config, constructors, preData){
	var PowerUp = constructors.PowerUp, loops = preData.loops, powerUps = preData.powerUps;
	
	return function(){
		
	}
	return function(){
		var smallVal = 13; // these values are to decrease to make waves happen more frequently

		//This is a mini wave loop. Small waves of 1-10+ enemies spawn every once in a while
		var normals = function(){//this normals() function is just to setup and start looping
			var lastTime,lastTimeB = 0;
		
			var big = 2000;
			//Big loop V
			var bigLoop = function(timestamp){
				if(!lastTime) lastTime = timestamp;
				//One big loop waits and spawns a wave of several enemies. Then the big loops is put on wait again for next wave.
				//if random time reached, start mini loops
				if(timestamp - lastTime > big){
					console.log("new wave  " + big);
					lastTime = timestamp;
					var times = 8 + Math.round(4000/(smallVal*smallVal));// here t makes one wave spawn more enemies as t decreases as more waves go 
					console.log("Times = "+times);
					var small = 0;
						//looping to check when random time reached to spawn
						
						var smallLoop = function(timestampB){
							var progressB = timestampB-lastTimeB;
							//config.message = timestampB
							if(progressB>small){
								//time reached
								if(times>0){
									lastTimeB = timestampB;
									spawnEnemy({sak : "normal", x : "random"});
									times--;
									small = 900+Math.random()*100*smallVal;
								}
								else {
								//exit this wave loop when as many enemies as times say have spawned during this wave
									window.cancelAnimationFrame(smallLoop);
									return
								}
							}
							loops.IDs.smallLoop = window.requestAnimationFrame(smallLoop)
						};
						smallLoop();
					 // t d after one wave
					smallVal = smallVal<=1 ? 1: smallVal * 20/21; //if t is very low, it is prevented to go any lower	
					console.log("smallVal = " +smallVal);
					big = 6000+1000*smallVal;
				}
				loops.IDs.bigLoop = window.requestAnimationFrame(bigLoop);
				
			};
			loops.starters.bigLoop = bigLoop;
			window.requestAnimationFrame(bigLoop);
		};
		
		var tanks = function(){
			var big = 40000;
			var lastTime = 0;
			var tankLoop = function(timestamp){
				if(timestamp-lastTime>big){
					lastTime = timestamp;
					
					spawnEnemy({sak :"tank", x:"random"});
					big = 5000+4000*smallVal/15;
				}
				window.requestAnimationFrame(tankLoop);
			}	
			loops.IDs = window.requestAnimationFrame(tankLoop)
			loops.starters.tankLoop = tankLoop;
		}
		var fasts = function(){
			var big = 600000;
			var lastTime = 0;
			var fastsLoop = function(timestamp){
				if(timestamp-lastTime>big){
					lastTime = timestamp;
					
					if(Math.random()<0.5)
						spawnEnemy({sak :"Xfast", x:"random"});
					else 
						spawnEnemy({sak :"Yfast", x:"random"});
					big = 2000+3500*smallVal/15;
				}
				window.requestAnimationFrame(fastsLoop);
			}	
			loops.IDs = window.requestAnimationFrame(fastsLoop)
			loops.starters.fasts = fastsLoop;
		}

		var powUps = function(){
			var lastTime = 0;
			var time = 5000;
			var powLoop = function(timestamp){
				if(timestamp - lastTime > time){
					lastTime = timestamp;
					var a = Math.random();
					var b1 = ["speed", "shield", "double", "blast", "cash", "regen"];
					var b2 = ["#F00",  "#F0F"  , " #00F ", " #FA5", "#0FF", "#F2C" ];	
					// all possible powUps
					var c1, c2;
					for(var i = 0; i < b1.length; i++){
						if(a > i/b1.length){
							c1 = b1[i];
							c2 = b2[i];
						}
						else {
							break;
						}
					}
					powerUps.push(new PowerUp(c2, c1, 15));
					time = 10000 + 1000*smallVal;
				}
				loops.IDs.powLoop = window.requestAnimationFrame(powLoop);
			};
			loops.starters.powLoop = powLoop;
			window.requestAnimationFrame(powLoop);
		}
		normals();
		fasts();
		tanks();
		powUps()
	}
});