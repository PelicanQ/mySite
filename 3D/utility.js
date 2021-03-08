define(function(){
	var handleWASD = function(pressedKeys){
		var walkDir = 0;
		loop1:
		for(var i = 0; i < pressedKeys.length; i++){
			switch(pressedKeys[i]){
				case 87:
					if(pressedKeys.indexOf(68) > -1){
						walkDir = 3.1415/4;
						break loop1;
					}
					else if(pressedKeys.indexOf(65) > -1){
						walkDir = 3.1415*7/4;
						break loop1;
					}
					walkDir = 0;
					break;
				case 68:
					walkDir = 3.1415/2;
					break;
				case 83:
					if(pressedKeys.indexOf(68) > -1){
						walkDir = 3.1415*3/4 ;
						break loop1;
					}
					else if(pressedKeys.indexOf(65) > -1){
						walkDir = 3.1415*5/4;
						break loop1;
					}
					walkDir = 3.1415;
					break;
				case 65:
					walkDir = 3.1415*3/2;
					break;
			}
		}
		return walkDir;
	}
	
	var bubblesort = function (array, basis){
		var orderArray = array.map((item, index)=>basis(item))//{return{order: basis(item), index: index}});
		
		/*orderArray.sort((a, b)=> a.order-b.order)
		var newArray = orderArray.map((item)=>array[item.index])
		array  =newArray;
		return;*/
		var startIndex = 0;
		var iteration = ()=>{
			if(startIndex === array.length) return;
			var leftmost = startIndex;
			
			for(var i = startIndex; i < orderArray.length; i++){
				if(orderArray[i] < orderArray[leftmost]){
					leftmost = i;
	
				}
			}
			orderArray.unshift(orderArray[leftmost]);
			array.unshift(array[leftmost]);
			orderArray.splice(leftmost+1, 1);
			array.splice(leftmost+1, 1);
			startIndex++;
			iteration();
		}
		iteration();
	}
	
	var collision = function (minA, maxA, minB, maxB){
		return (minA < maxB && maxA > minB);
		
	}
	var collision3D = function (a, b){
		return 	a.x-a.sx/2 < b.x+b.sx/2 && a.x+a.sx/2 > b.x-b.sx/2 &&
			a.y-a.sy/2 < b.y+b.sy/2 && a.y+a.sy/2 > b.y-b.sy/2 &&
			a.z-a.sz/2 < b.z+b.sz/2 && a.z+a.sz/2 > b.z-b.sz/2;
	}
	return {
		handleWASD: handleWASD,
		bubblesort: bubblesort,
		collision: collision,
		collision3D: collision3D
	}
})