var sector = new Array();

var sectorWidth = 2000;
var sectorHeight = 2000;
var generatorActive = true;
var freezeGame = false;


function generateSector(x, y)
{
	x = x*sectorWidth;
	y = y*sectorHeight;
	margin = 100;
	tempObj = new Array();
	tempObj[0] = hero;
	function genCoordX(w)
	{
		return(x+margin+Math.random()*(sectorWidth-2*margin-w));
	}
	function genCoordY(h)
	{
		return(y+margin+Math.random()*(sectorHeight-2*margin-h));
	}
	function genCoord(a)
	{
		a.x = genCoordX(a.w);
		a.y = genCoordY(a.d);
	}
	function genIsCollision(tx, ty, tw, th, ex)
	{
		for (igs2 = 0; igs2 < tempObj.length; igs2++)
		{
			if (tempObj[igs2].ex > ex) ex = tempObj[igs2].ex;
			if (testCollision(tx, ty, tw, th, tempObj[igs2].x, tempObj[igs2].y, tempObj[igs2].w, tempObj[igs2].h, ex))
				return true;
		}
		return false;
	}
	function genAddZone(tx, ty, tw, th, ex)
	{
		tempObj[tempObj.length] = new Object();
		tempObj[tempObj.length-1].x = tx;
		tempObj[tempObj.length-1].y = ty;
		tempObj[tempObj.length-1].w = tw;
		tempObj[tempObj.length-1].h = th;
		tempObj[tempObj.length-1].ex = ex;
	}
	function genAddObject(a, ex)
	{
		if (!genIsCollision(a.x, a.y, a.w, a.d, ex))
		{
			genAddZone(a.x, a.y, a.w, a.d, ex);
			addObject(a);
		}
	}
	//Make sand
	addTerrain(new Terrain(loadImage("sand.png"), 50, 50, x, y, sectorWidth, sectorHeight, "#f3bd00"));
	//Some buildings
	for (igs = 0; igs < Math.random()*2; igs++)
	{
		//Generate size
		bw = Math.random()*600+200;
		bh = Math.random()*600+200;
		bx = genCoordX(bw);
		by = genCoordY(bh);
		//Generate walls
		temp1 = createObject("wallh", bx+16, by);
		temp1.w = bw-32;
		temp2 = createObject("wallv", bx, by);
		temp2.h = bh;
		temp2.d = bh-96;
		temp3 = createObject("wallv", bx+bw-16, by);
		temp3.h = bh;
		temp3.d = bh-96;
		temp4 = createObject("wallh", bx+16, by+bh-128, bw/2-70);
		temp4.w = bw/2-70;
		temp5 = createObject("wallh", bx-16+bw/2+70, by+bh-128, bw/2-70);
		temp5.w = bw/2-70;
		if (!genIsCollision(bx, by, bw, bh, 100))
		{
			addTerrain(new Terrain(loadImage("floor.png"), bw, bh-96, bx, by, bw, bh-96, "#ebe6e6"));
			terrain[terrain.length-1].position = 20;
			genAddZone(bx, by, bw, bh, 100)
			addObject(temp1);
			addObject(temp2);
			addObject(temp3);
			addObject(temp4);
			addObject(temp5);
		}
	}
	//Rocks
	for (igs = 0; igs < Math.random()*100; igs++)
	{
		temp = createObject("rock", 0, 0);
		genCoord(temp);
		genAddObject(temp, 40);
	}
	//Ponds
	for (igs = 0; igs < Math.random()*10; igs++)
	{
		temp = createObject("pond", 0, 0);
		genCoord(temp);
		genAddObject(temp, 40);
	}
	//Palms
	for (igs = 0; igs < Math.random()*330; igs++)
	{
		temp = createObject("palm", 0, 0);
		genCoord(temp);
		if (temp.nearest("pond") < 50) genAddObject(temp, 40);
	}
	//Dogs
	if(Math.random() < 0.5)
	{
		temp = createObject("dog", 0, 0);
		genCoord(temp);
		genAddObject(temp, 40);
	}
	//Traveler
	if(Math.random() < 0.5)
	{
		temp = createObject("traveler", 0, 0);
		genCoord(temp);
		genAddObject(temp, 40);
	}
}

function getSectorX(x)
{
	return(Math.floor(x/sectorWidth));
}

function getSectorY(y)
{
	return(Math.floor(y/sectorHeight));
}

//Check if sector is generated
function checkSector(x, y)
{
	if (!sector[x]) sector[x] = new Array();
	if (!sector[x][y] && generatorActive)
	{
		generateSector(x, y);
		sector[x][y] = true;
	}
}

function checkVicinity(x, y, r)
{
	for (ix = x-r; ix <= x+r; ix++)
	{
		for (iy = y-r; iy <= y+r; iy++)
		{
			checkSector(ix, iy);
		}
	}
}

