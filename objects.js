//All object
var obj = new Array();
//Visible objects
var obj2 = new Array();

//Add new object to set
function addObject(a)
{
	obj[obj.length] = a;
}

//Remove object
function removeObject(a)
{
	for (iro = 0; iro < obj.length; iro++)
	{
		if (obj[iro].target == a)
		{
			obj[iro].target = null;
		}
		while (obj[iro] == a)
		{
			obj[iro] = obj[obj.length-1];
			obj.length--;
		}
	}
	for (iro = 0; iro < obj2.length; iro++)
	{
		while (obj2[iro] == a)
		{
			obj2[iro] = obj2[obj2.length-1];
			obj2.length--;
		}
	}
	for (iro = 0; iro < obj3.length; iro++)
	{
		while (obj3[iro] == a)
		{
			obj3[iro] = obj3[obj3.length-1];
			obj3.length--;
		}
	}
}

//Basic game object
function GameObject(name)
{
	this.img = new Image();
	this.name = name;
	this.x = 0;
	this.y = 0;
	this.w = 0;
	this.h = 0;
	this.d = 0;
	this.visible = false;
	this.ghost = false;
}

GameObject.prototype.setSize = function(x, y, z, w, h, d)
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.d = d;
}

GameObject.prototype.testCollisionC = function(x, y, w, h, ex)
{
	return(testCollision(x, y, w, h, this.x, this.y, this.w, this.d, ex));
}

GameObject.prototype.testCollision = function(a, ex)
{
	if (a != this && !a.ghost)
	{
		return(this.testCollisionC(a.x, a.y, a.w, a.d, ex));
	}
	else return(false);
}

GameObject.prototype.testLineCollision=function(x1, y1, x2, y2)
{
	//Special case
	if (x1 == x2) x1 += 0.0001;
	if (x1 > x2)
	{
		hx = x1;
		hy = y1;
		x1 = x2;
		y1 = y2;
		x2 = hx;
		y2 = hy;
	}
	a = (y2-y1)/(x2-x1);
	b = y1-a*x1;
	
			d1 = 0;
			d2 = 0;
			if (this.x <= x1 && x1 <= this.x+this.w)
			{
				if (this.y <= y1 && y1 <= this.y+this.d) d1 = 1;
				if (this.y > y1) d1 = 2;
				if (this.y+this.d < y1) d1 = 3;
			}
			if (this.x <= x2 && x2 <= this.x+this.w)
			{
				if (this.y <= y2 && y2 <= this.y+this.d) d2 = 1;
				if (this.y > y2) d2 = 2;
				if (this.y+this.d < y2) d2 = 3;
			}
			if (this.x > x1)
			{
				yt = this.x*a+b;
				if (this.y <= yt && yt <= this.y+this.d) d1 = 1;
				if (this.y > yt) d1 = 2;
				if (this.y+this.d < yt) d1 = 3;
			}
			if (this.x+this.w < x2)
			{
				yt = (this.x+this.w)*a+b;
				if (this.y <= yt && yt <= this.y+this.d) d2 = 1;
				if (this.y > yt) d2 = 2;
				if (this.y+this.d < yt) d2 = 3;
			}
			
			if (d1 == 1 && d2 != 0) return(true);
			if (d2 == 1 && d1 != 0) return(true);
			if (d1 == 2 && d2 == 3) return(true);
			if (d1 == 3 && d2 == 2) return(true);
	return false;
}


GameObject.prototype.isCollision = function()
{
	for (ii = 0; ii < obj2.length; ii++)
	{
		if (this.testCollision(obj2[ii], 0)) return(obj2[ii]);
	}
	return(null);
}

GameObject.prototype.isCollisionEx = function(ex)
{
	for (ii = 0; ii < obj2.length; ii++)
	{
		if (this.testCollision(obj2[ii], ex)) return(obj2[ii]);
	}
	return(null);
}

GameObject.prototype.getDX = function(a)
{
	return a.x+a.w/2-this.x-this.w/2;
}

GameObject.prototype.getDY = function(a)
{
	return a.y+a.d/2-this.y-this.d/2;
}

GameObject.prototype.getDLC = function(x, y)
{
	dx = x-this.x-this.w/2;
	dy = y-this.y-this.d/2;
	return Math.sqrt(dx*dx+dy*dy);
}

GameObject.prototype.getDL = function(a)
{
	dx = this.getDX(a);
	dy = this.getDY(a);
	return Math.sqrt(dx*dx+dy*dy);
}

GameObject.prototype.nearest = function(name)
{
	//W chuj daleko
	var best = 100000;
	for (ii = 0; ii < obj.length; ii++)
	{
		dl = this.getDL(obj[ii]);
		if (((name == "ActiveObject" && obj[ii].blocks) || name == "" || obj[ii].name == name) 
			&& dl < best && obj[ii] != this) best = dl;
	}
	
	return(best);
}
	
GameObject.prototype.draw = function()
{
	drawImage(this.img, this.x, this.y+this.d-this.h, this.w, this.h, 0);
	
	if (debug)
	{
		context.strokeStyle = "black";
		if (this.waypointX)
		{
			context.beginPath();
			context.moveTo(this.x, this.y);
			for (ii = this.waypointX.length-1; ii >=0 ; ii--)
			{
				context.fillStyle = "red";
				context.fillText(ii, this.waypointX[ii], this.waypointY[ii]);
				context.strokeRect(this.waypointX[ii], this.waypointY[ii], 10, 10);
				context.lineTo(this.waypointX[ii], this.waypointY[ii]);
				context.stroke();
				context.closePath();
				context.beginPath();
				context.moveTo(this.waypointX[ii], this.waypointY[ii]);
			}
		}
		context.drawImage(this.img, this.x, this.y+this.d-this.h, this.w, this.h);
		context.strokeRect(this.x, this.y, this.w, this.d);
		if (debug && testRange && this.blocks)
		{
			for (iro = 0; iro < obj3.length; iro++)
			{
				if (checkRangeO(this, obj3[iro], 10000)) context.strokeStyle = "green";
				else context.strokeStyle = "red";
				
				
				context.beginPath();
				
				context.moveTo(this.x+this.w/2+1, this.y+this.d/2);
				context.lineTo(obj3[iro].x+obj3[iro].w/2, obj3[iro].y+obj3[iro].d/2);
				context.stroke();
				context.closePath();
			}
		}
		context.strokeStyle = "black";
	}
}

GameObject.prototype.visibility = function(state)
{
	if (this.visible && !state)
	{
		this.visible = state;
		for (ii = 0; ii < obj2.length; ii++)
		{
			if (obj2[ii] == this)
			{
				obj2[ii] = obj2[obj2.length-1];
				obj2[obj2.length-1] = null;
				obj2.length--;
			}
		}
	}
	if (!this.visible && state)
	{
		this.visible = state;
		obj2[obj2.length] = this;
	}
}
