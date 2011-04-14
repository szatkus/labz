var terrain = new Array();

function addTerrain(t)
{
	terrain[terrain.length] = t;
}

function Terrain(img, sw, sh, x, y, w, h, color)
{
	this.img = img;
	//this.pattern = context.createPattern(img, 'repeat');
	this.w = w;
	this.h = h;
	this.sw = sw;
	this.sh = sh;
	this.x = x;
	this.y = y;
	this.color = color;
	this.position = 0;
	this.visible = true;
}

Terrain.prototype.draw = function()
{
	
	if (this.visible && testCollision(cx,cy, canvas.width, canvas.height,this.x, this.y, this.w, this.h, 10))
	{
		if (showTerrain)
		{
			this.img.width = this.sw;
			this.img.height = this.sh;
			context.fillStyle=context.createPattern(this.img, "repeat");
			context.fillRect(this.x, this.y, this.w, this.h);
		}
		else
		{
			context.fillStyle=this.color;
			context.fillRect(this.x, this.y, this.w, this.h);
		}
		//context.fillStyle = this.pattern;
		//context.fillRect(this.x,this.y,this.w, this.h);
		//context.fillRect(this.x,this.y,40, 40);
	}
}
