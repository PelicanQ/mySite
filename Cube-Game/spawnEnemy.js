define(["preData", "config", "constructors"], function(preData, config, constructors){
	var ctx = preData.ctx;
	var c = preData.c;
	var enemies = preData.enemies;
	var Enemy = constructors.Enemy;
	var keys = preData.keys;
	return function(o){
		if(o.sak=="normal"){
			o.wid = 32;o.hei=32;o.health=150;o.xR=1.4;o.yR=1.4;o.col="#2D2";o.poi=20;o.dmg=33.4;
		}
		else if(o.sak=="tank"){
			o.wid = 50;o.hei=50;o.health=800;o.xR=1;o.yR=1;o.col="#F21";o.poi=40;o.dmg=50;
		}
		else if(o.sak=="Xfast"){
			o.wid = 20; o.hei = 20;o.health=100;o.xR=9;o.yR=0.5;o.col="#e266ff";o.poi=10;o.dmg=25;
		}
		else if(o.sak=="Yfast"){
			o.wid=20;o.hei=20;o.health=100;o.xR=0.5;o.yR=9;o.col="#FF2";o.poi=10;o.dmg=25
		}
		else if(o.sak === "laser"){
			o.health=200;o.xR=1;o.yR=1;o.col="#F00";o.poi=0;o.dmg;100;
		}
		else if(o.sak === "slasher"){
			o.wid=30;o.hei=30;o.health=200;o.xR=1;o.yR=1;o.col="#ABC";o.poi=100;o.dmg=15;
		}
		else if (o.sak === "leader"){
			o.wid=50;o.hei=50;o.health=200;o.xR=1;o.yR=1;o.col="#ABC";o.poi=100;o.dmg=15;
		}
		else if(o.sak === "follower"){
			o.wid=15;o.hei=15;o.health=40;o.xR=1;o.yR=1;o.col="#00C";o.poi=50;o.dmg=15;
		}
		else {
			o.health=100;o.xR=1;o.yR=1;o.col="#F00";o.poi=1;o.dmg=100;
		}
		
		if(o.x=="random"||o.y=="random"){

			if(Math.random() > 0.5){
				o.x = Math.random() * c.width;
				if(Math.random() < 0.5){
					o.y = c.height
				}
				else {
					o.y = 0 - o.hei
				}
			}
			else {
				o.y = Math.random() * c.height;
				if(Math.random() < 0.5){ 
					o.x = c.width
				}
				else{
					o.x = 0 - o.wid
				}
			}
			console.log(o.x/c.width, o.y/c.height)
		}
		enemies.push(new Enemy(o.x, o.y, 0, 0, o.wid, o.hei, o.health, o.xR, o.yR, o.col, o.sak, o.poi, o.dmg));
		preData.leaders.push(enemies[enemies.length-1]);
		//config.pressTimes++  CURRENTLY UNUSED
	}
})