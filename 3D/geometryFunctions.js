define(function(){

	var rotatePoint = function(point, about, rad){
		var a = point.a;
		var b = point.b;
		var dist = Math.sqrt(Math.pow(a-about.a,2) + Math.pow(b-about.b,2))
		var sign = Math.sign(Math.sign(a-about.a)+0.5);
		var ratio = (b-about.b)/(a - about.a);
		ratio = Number.isNaN(ratio) ? 1 : ratio; 
		var lastAngle = Math.atan(ratio);
		return {
			a: about.a + sign * dist * Math.cos(lastAngle+ rad),
			b: about.b + sign * dist * Math.sin(lastAngle + rad)
		}
	}

	var rotate3D = function (point, pivot, xRot, yRot, zRot){
		var cx = Math.cos(xRot);
		var cy = Math.cos(yRot);
		var cz = Math.cos(zRot);
		var sx = Math.sin(xRot);
		var sy = Math.sin(yRot);
		var sz = Math.sin(zRot);
		
		var xRel = point.x - pivot.x;
		var yRel = point.y - pivot.y;
		var zRel = point.z - pivot.z;
		
		return {
			x:  cy*(sz*yRel + cz *xRel) - sy * zRel, 
			y: sx*(cy * zRel + sy*(sz * yRel + cz * xRel)) + cx * (cz*yRel - sz * xRel), 
			z: cx*(cy * zRel + sy * (sz * yRel + cz * xRel)) - sx * (cz * yRel - sz * xRel) 
		}
	}

	var projectFace = function (face, ctx, camera, trigValues){
		const c = ctx.canvas;
		ctx.beginPath();
		
		const displayX = 0;
		const displayY = 0;
		const displayZ =  1/Math.tan(camera.FOV/2);
		
		const [cx, cy, cz, sx, sy, sz] = trigValues;

		var last = {};

		for(var i = 0; i < face.points.length; i++){
			var xRel = face.points[i].x - camera.x;
			var yRel = face.points[i].y - camera.y;
			var zRel = face.points[i].z - camera.z;

			//These are the coorodinates of the points, relative to camera plane. 
			//Copies because we will truncate lines behind camera and alter original coordinates
			var ax = axCopy = cy*(sz*yRel + cz *xRel) - sy * zRel;
			var ay = ayCopy = sx*(cy * zRel + sy*(sz * yRel + cz * xRel)) + cx * (cz*yRel - sz * xRel);
			var az = azCopy = cx*(cy * zRel + sy * (sz * yRel + cz * xRel)) - sx * (cz * yRel - sz * xRel);
			
			
			if(i===0){
				//Can't do anything with just one point
				last = {x: ax, y: ay, z: az};
				continue;
			}

			
			var toLast = false;
			var dYdZ = (ay - last.y)/(az - last.z);//Slopes between two points
			var dXdZ = (ax - last.x)/(az - last.z);
			dYdZ = Number.isNaN(dYdZ) ? 0 : dYdZ;
			dXdZ = Number.isNaN(dXdZ) ? 0 : dXdZ;

			if(az > 0 || last.z > 0){//If both this and previous points were behind camera: ingore that line.
				
				if(last.z <= 0) {//
					last.y = last.y - last.z*dYdZ;
					last.x = last.x - last.z*dXdZ;
					last.z = 0.001;
					toLast = true;
				}
				if(az <= 0) {//Truncate line form last to current point if it streches behind camera
					ay = ay - az*dYdZ;
					ax = ax - az*dXdZ;
					az = 0.001;
					//toLast = true;
				}
				
				projX = c.width/2   +c.height/2 * (displayZ/az * ax + displayX);
				projY = c.height/2 * (1 + (displayZ/az * ay + displayY));
				
				last.projX = c.width/2 + c.height/2* (displayZ/last.z * last.x + displayX);
				last.projY = c.height/2 * (1 + (displayZ/last.z * last.y + displayY));
				
				if(i===1) 
					ctx.moveTo(last.projX, last.projY);
				if(toLast) 
					ctx.lineTo(last.projX, last.projY);
				ctx.lineTo(projX, projY);
			}
			last = {
				x: axCopy,
				y: ayCopy, 
				z: azCopy
				
			};
		}
		
		ctx.fillStyle = face.color;	
		face.color && ctx.fill();	

		ctx.strokeStyle = "#000";
		ctx.stroke();
	}

	var projectPath = function (points, ctx, camera, trigValues){
		var c = ctx.canvas;
		ctx.beginPath();
		
		var displayX = 0;
		var displayY = 0;
		var displayZ =  1/Math.tan(camera.FOV/2);
		
		const [cx, cy, cz, sx, sy, sz] = trigValues;
		
		var last = {};
		for(var i = 0; i < points.length; i++){
			var xRel = points[i].x - camera.x;
			var yRel = points[i].y - camera.y;
			var zRel = points[i].z - camera.z;
			var ax = axCopy = cy*(sz*yRel + cz *xRel) - sy * zRel;
			var ay = ayCopy = sx*(cy * zRel + sy*(sz * yRel + cz * xRel)) + cx * (cz*yRel - sz * xRel);
			var az = azCopy = cx*(cy * zRel + sy * (sz * yRel + cz * xRel)) - sx * (cz * yRel - sz * xRel);
			//Copies because we will truncate lines behind camera and alter ax, ay, az

			if(i===0){
				last = {
					x: ax, y: ay, z: az,
					

				};
				continue;
			}
			
			var dYdZ = (ay - last.y)/(az - last.z);
			var dXdZ = (ax - last.x)/(az - last.z);
			dYdZ = Number.isNaN(dYdZ) ? 0 : dYdZ;
			dXdZ = Number.isNaN(dXdZ) ? 0 : dXdZ;
			if(az > 0 || last.z > 0){
				
				if(last.z <= 0) {
					last.y = last.y - last.z*dYdZ;
					last.x = last.x - last.z*dXdZ;
					last.z = 0.001;
				}
				if(az <= 0) {
					ay = ay - az*dYdZ;
					ax = ax - az*dXdZ;
					az = 0.001;
				}
				
				//projX = c.width/2  * (1 + (displayZ/az * ax + displayX));
				projX = c.width/2 + c.height/2 * (displayZ/az * ax + displayX);
				projY = c.height/2 * (1 + (displayZ/az * ay + displayY));
				//last.projX = c.width/2  * (1 + (displayZ/last.z * last.x + displayX));
				last.projX = c.width/2 + c.height/2* (displayZ/last.z * last.x + displayX);
				last.projY = c.height/2 * (1 + (displayZ/last.z * last.y + displayY));
				
				
				ctx.moveTo(last.projX, last.projY);
				ctx.lineTo(projX, projY);
			}
			last = {
				x: axCopy,
				y: ayCopy, 
				z: azCopy
				
			};
		}
		ctx.stroke();
	}

	return {
		rotatePoint: rotatePoint,
		rotate3D: rotate3D,
		projectFace: projectFace,
		projectPath: projectPath
	}
});