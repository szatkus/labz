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
		sx = this.x;
		ex = this.x+this.w;
		sy = this.y;
		ey = this.y+this.h;
		if (sx < cx) sx = this.x+Math.floor((cx-this.x)/this.sw)*this.sw;
		if (ex > cx+canvas.width) ex = cx+canvas.width;
		if (sy < cy) sy = this.y+Math.floor((cy-this.y)/this.sh)*this.sh;
		if (ey > cy+canvas.height) ey = cy+canvas.height;
		for (xx = sx; xx < ex; xx += this.sw)
		{
			for (yy = sy; yy < ey; yy += this.sh)
			{
				drawImage(this.img, xx, yy, this.sw, this.sh, 0);
			}
		}
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
