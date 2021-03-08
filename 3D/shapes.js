define(["geometryFunctions"], function(geoFunc){
class Shape {
	constructor(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.lines = [];
	}
	move(x, y, z){
		this.x += x;
		this.y += y;
		this.z += z;
		for(var point of this.points){
			point.x += x;
			point.y += y;
			point.z += z;
		}
		if(!this.faces) return;
		this.faces.forEach((face)=>face.move(x, y, z));
		return;
	}
	rotateZ(rad, about){
		var pivot = about ? about : this;
		for(var point of this.points.concat([this])){
			var newP = geoFunc.rotatePoint({a: point.x, b: point.y}, {a: pivot.x, b: pivot.y}, rad);
			point.x = newP.a;
			point.y = newP.b;
		}
		if(this.faces) this.faces.forEach((face)=>face.rotateZ(rad, pivot));
	}
	rotateX(rad, about){
		var pivot = about ? about : this;
		for(var point of this.points.concat([this])){
			var newP = geoFunc.rotatePoint({a: point.z, b: point.y}, {a: pivot.z, b: pivot.y}, rad);
			point.z = newP.a;
			point.y = newP.b;
		}
		if(this.faces) this.faces.forEach((face)=>face.rotateX(rad, pivot));
	}
	rotateY(rad, about){
		var pivot = about ? about : this;
		for(var point of this.points.concat([this])){
			var newP = geoFunc.rotatePoint({a: point.x, b: point.z}, {a: pivot.x, b: pivot.z}, rad);
			point.x = newP.a;
			point.z = newP.b;
		}
		if(this.faces) this.faces.forEach((face)=>face.rotateY(rad, pivot));
	}
}


class Cuboid extends Shape {
	constructor(x, y, z, sx, sy, sz, color){
		super(x, y, z);
		
		this.faces =  [
			new Face(x, y, z-sz/2, sx, sy, 0, color),  new Face(x, y, z+sz/2, sx, sy, 0, color),
			new Face(x, y-sy/2, z, sx, 0, sz, color), new Face(x, y+sy/2, z, sx, 0, sz, color),
			new Face(x-sx/2, y, z, 0, sy, sz, color), new Face(x+sx/2, y, z, 0, sy, sz, color)

		];
		
		this.sx = sx; this.sy = sy; this.sz = sz;
		x -= sx/2;
		y -= sy/2;
		z -= sz/2;
		this.points = [
			[x, y, z], [x+sx, y, z], [x+sx, y+sy, z], [x, y+sy, z], 
			[x, y, z], [x, y, z+sz], [x+sx, y, z+sz], [x+sx, y+sy, z+sz], [x, y+sy, z+sz], [x, y, z+sz], 
			[x+sx, y, z+sz], [x+sx, y, z], [x+sx, y+sy, z], [x+sx, y+sy, z+sz], [x, y+sy, z+sz], [x, y+sy, z]
		]
		this.points.forEach((item, i)=>this.points[i] = new Point(item[0], item[1], item[2]));
		
	}
	
}
class Cube extends Cuboid {
	constructor(x, y, z, side, color){
		super(x, y, z, side, side, side, color);
		this.side = side;
	}
}
class Face extends Shape{
	constructor(x, y, z, sx, sy, sz, color){
		super(x,y,z)
		x -= sx/2;
		y -= sy/2;
		z -= sz/2;
		
		var F = 0;
		if(sx === 0){
			F = 1;	
		}

		this.sx = sx; this.sy = sy; this.sz = sz;
		this.points = [
			{x: x,   y: y,   z: z},
			{x: x+this.sx, y: y,   z: z+this.sz*F},
			{x: x+this.sx, y: y+this.sy, z: z+this.sz},
			{x: x,   y: y+this.sy, z: z+this.sz*(1-F)},
			{x: x,   y: y,   z: z}
		];
		this.color = color;
	}
	scale(factor){
		factor -= 1;
		for(var p of this.points){
			p.x += (factor)*(p.x - this.x);
			p.y += factor*(p.y - this.y);
			p.z += factor*(p.z - this.z);
		}
	}
}
var Point = function(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
}


return {
	Shape: Shape,
	Cuboid: Cuboid,
	Cube: Cube,
	Face: Face,
	Point: Point
}
})