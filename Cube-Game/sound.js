define(["config"], function(config){
	return {
		pew : document.getElementById("laser"),
		click : document.getElementById("click"),
		select : document.getElementById("select"),
		shieldUp : document.getElementById("shieldup"),
		shieldDown : document.getElementById("shielddown"),
		speedUp : document.getElementById("speedup"),
		speedDown : document.getElementById("speeddown"),
		boom : document.getElementById("boom"),
		reload : document.getElementById("reload"),
		nuke : document.getElementById("nukeSound"),
		homing : document.getElementById("homing"),
		nitrofun : document.getElementById("nitrofun"),
		a : [],
		play : function(s){
			if(config.sfx){
				if(s.paused){
					this.a[this.a.length] = document.createElement("AUDIO");
					this.a[this.a.length-1].src = s.src
					this.a[this.a.length-1].play()
				
				}
				else{
			
					s.play()
				}
			}
		}
		
	}
});


